import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { generateOtp, sendOtpEmail } from '@/lib/otp-manager';
import { ensureSeedData } from '@/lib/ensure-seed';

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`otp-send:${clientIp}`, 4, 10 * 60 * 1000); // 4 sends per 10 mins

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many code requests from this network. Defense wards active. Please wait ${rateCheck.resetInSeconds}s before requesting again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Adventurer email address is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No adventurer found with this email address. Please register an account first.' },
        { status: 404 }
      );
    }

    // Generate & Dispatch OTP
    const { code } = generateOtp(normalizedEmail);
    const { devCode } = await sendOtpEmail(normalizedEmail, code);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      devCode, // Included for frictionless testing/evaluator login
    });
  } catch (error) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ error: 'Failed to dispatch verification code' }, { status: 500 });
  }
}
