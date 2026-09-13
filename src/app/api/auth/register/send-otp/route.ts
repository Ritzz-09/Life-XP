import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { generateOtp, sendOtpEmail } from '@/lib/otp-manager';
import { ensureSeedData } from '@/lib/ensure-seed';

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`register-otp:${clientIp}`, 5, 10 * 60 * 1000); // 5 sends per 10 mins

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many verification code requests. Please wait ${rateCheck.resetInSeconds}s before requesting again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Hero Name, email address, and password are required' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
      return NextResponse.json(
        { error: 'Hero Name must be between 3 and 24 characters' },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        { error: 'Hero Name can only contain letters, numbers, hyphens, and underscores' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters for guild security' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A hero with this email already exists in the realm' },
        { status: 409 }
      );
    }

    // Check if hero name already claimed
    const existingUsername = await prisma.user.findFirst({
      where: { username: { equals: trimmedUsername } },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Hero Name is already claimed by another adventurer' },
        { status: 409 }
      );
    }

    // Generate & Dispatch Registration OTP
    const { code } = generateOtp(normalizedEmail);
    await sendOtpEmail(normalizedEmail, code, 'registration');

    return NextResponse.json({
      success: true,
      message: `A 6-digit confirmation code has been dispatched to ${normalizedEmail}.`,
    });
  } catch (error) {
    console.error('Registration OTP Send error:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch email verification code. Please try again.' },
      { status: 500 }
    );
  }
}
