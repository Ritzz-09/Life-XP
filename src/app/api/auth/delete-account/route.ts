import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, verifyPassword, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Adventurer credentials required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    // Verify password if provided or required
    if (password) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Incorrect password confirmation' }, { status: 403 });
      }
    }

    // Cascade delete user and all associated gameplay entities
    await prisma.user.delete({
      where: { id: user.id },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Adventurer account and all associated records permanently expunged from the realm.',
    });

    // Clear session cookie immediately
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to expunge account. Please contact realm moderators.' },
      { status: 500 }
    );
  }
}
