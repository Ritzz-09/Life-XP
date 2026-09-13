import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { verifyPasswordResetToken, invalidatePasswordResetToken } from '@/lib/reset-tokens';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`reset-pw:${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many password reset attempts. Please wait ${rateCheck.resetInSeconds}s before retrying.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetInSeconds) } }
      );
    }

    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Reset token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    const verification = verifyPasswordResetToken(token);
    if (!verification.valid || !verification.userId) {
      return NextResponse.json({ error: 'Invalid or expired password reset key' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: verification.userId },
      data: { passwordHash },
    });

    // Invalidate token so it cannot be re-used
    invalidatePasswordResetToken(token);

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now login with your new credentials.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
