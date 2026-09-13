import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { verifyOtp } from '@/lib/otp-manager';
import { ensureSeedData } from '@/lib/ensure-seed';

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`otp-verify:${clientIp}`, 6, 10 * 60 * 1000); // 6 verify attempts per 10 mins

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many verification attempts. Please wait ${rateCheck.resetInSeconds}s before retrying.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and 6-digit code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the OTP code
    const verification = verifyOtp(normalizedEmail, code);
    if (!verification.success) {
      return NextResponse.json({ error: verification.error || 'Invalid verification code' }, { status: 400 });
    }

    // Fetch user and character profile
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        character: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Adventurer profile not found' }, { status: 404 });
    }

    // Reset rate limiter upon verified success
    rateLimiter.reset(`otp-verify:${clientIp}`);
    rateLimiter.reset(`otp-send:${clientIp}`);

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        characterTitle: user.characterTitle,
      },
      character: user.character,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('OTP Verify error:', error);
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 });
  }
}
