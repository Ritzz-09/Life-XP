import crypto from 'crypto';

interface ResetEntry {
  userId: string;
  email: string;
  expiresAt: number;
}

// In-memory token store with 15-minute TTL
const tokenStore = new Map<string, ResetEntry>();

export function createPasswordResetToken(userId: string, email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
  tokenStore.set(token, { userId, email, expiresAt });
  return token;
}

export function verifyPasswordResetToken(token: string): { valid: boolean; userId?: string; email?: string } {
  const entry = tokenStore.get(token);
  if (!entry) {
    return { valid: false };
  }

  if (Date.now() > entry.expiresAt) {
    tokenStore.delete(token);
    return { valid: false };
  }

  return { valid: true, userId: entry.userId, email: entry.email };
}

export function invalidatePasswordResetToken(token: string): void {
  tokenStore.delete(token);
}
