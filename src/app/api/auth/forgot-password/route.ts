import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { createPasswordResetToken } from '@/lib/reset-tokens';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`forgot-pw:${clientIp}`, 4, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many password reset requests. Please wait ${rateCheck.resetInSeconds}s before trying again.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetInSeconds) } }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return neutral success message to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: 'If an adventurer with this email exists, a password reset key has been generated.',
      });
    }

    const resetToken = createPasswordResetToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      resetToken, // Returned directly for immediate in-app recovery
      message: 'Password reset key generated successfully. You can now set your new password.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 });
  }
}
