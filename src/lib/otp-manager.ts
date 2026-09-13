import crypto from 'crypto';

interface OtpEntry {
  code: string;
  expiresAt: number;
  attemptsLeft: number;
}

// In-memory OTP store keyed by lowercase email
const otpStore = new Map<string, OtpEntry>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

/**
 * Generates a cryptographically secure 6-digit numeric OTP
 */
export function generateOtp(email: string): { code: string; expiresAt: number } {
  const normalizedEmail = email.toLowerCase().trim();
  // Secure random integer between 100000 and 999999
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpStore.set(normalizedEmail, {
    code,
    expiresAt,
    attemptsLeft: MAX_ATTEMPTS,
  });

  return { code, expiresAt };
}

/**
 * Validates the OTP for a given email
 */
export function verifyOtp(
  email: string,
  userCode: string
): { success: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = otpStore.get(normalizedEmail);

  if (!entry) {
    return {
      success: false,
      error: 'No active verification code found. Please request a new code.',
    };
  }

  // Check TTL expiration
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  // Check attempts lockout
  if (entry.attemptsLeft <= 0) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, this code has been revoked. Please request a new one.',
    };
  }

  // Check code match
  if (entry.code !== userCode.trim()) {
    entry.attemptsLeft -= 1;
    if (entry.attemptsLeft <= 0) {
      otpStore.delete(normalizedEmail);
      return {
        success: false,
        error: 'Too many incorrect attempts. Code revoked for your protection.',
      };
    }
    return {
      success: false,
      error: `Invalid verification code. ${entry.attemptsLeft} attempt(s) remaining.`,
    };
  }

  // Code is valid! Invalidate immediately to prevent replay attacks
  otpStore.delete(normalizedEmail);
  return { success: true };
}

/**
 * Dispatches the OTP email
 */
export async function sendOtpEmail(
  email: string,
  code: string,
  purpose: 'login' | 'registration' = 'registration'
): Promise<{ delivered: boolean; devCode: string }> {
  const isReg = purpose === 'registration';
  console.log(`\n======================================================`);
  console.log(`⚡ [LIFE-XP AUTH] EMAIL OTP VERIFICATION DISPATCHED (${purpose.toUpperCase()})`);
  console.log(`✉️  Recipient: ${email}`);
  console.log(`🔑 Verification Code: ${code}`);
  console.log(`⏱️  Valid For: 5 Minutes (Expires at ${new Date(Date.now() + OTP_TTL_MS).toLocaleTimeString()})`);
  console.log(`======================================================\n`);

  // Optional: If RESEND_API_KEY or SMTP is set in environment, send real mail
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'Life-XP <realm@lifexp.game>',
          to: email,
          subject: isReg
            ? `${code} is your Life-XP Guild Registration Code`
            : `${code} is your Life-XP Realm Login Code`,
          html: `
            <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 28px; border-radius: 16px; border: 1px solid #1e293b; max-width: 500px; margin: auto;">
              <h2 style="color: #f59e0b; margin-top: 0; font-size: 24px;">⚡ Life-XP Realm</h2>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">
                ${
                  isReg
                    ? 'Welcome, brave adventurer! Enter this 6-digit confirmation code to activate your guild membership and begin your journey:'
                    : 'Your one-time security code to enter the realm is:'
                }
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; background: #0f172a; padding: 14px 24px; display: inline-block; border-radius: 12px; border: 1px solid #0284c7;">
                  ${code}
                </span>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
                ⏱️ This code will expire in 5 minutes. If you did not request this, you can safely ignore this parchment.
              </p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error('Failed to send email via Resend API:', err);
    }
  }

  return { delivered: true, devCode: code };
}
