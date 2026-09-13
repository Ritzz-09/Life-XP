import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ensureSeedData } from '@/lib/ensure-seed';
import { STARTER_QUESTS } from '@/lib/seed-data';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import { verifyOtp } from '@/lib/otp-manager';

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`register:${clientIp}`, 8, 30 * 60 * 1000); // 8 registrations per 30 mins per IP

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Registration limit reached for this network. Please wait ${rateCheck.resetInSeconds}s before attempting again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    const body = await req.json();
    const { username, email, password, avatar = 'warrior', gender = 'MALE', otpCode } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    if (!otpCode) {
      return NextResponse.json(
        { error: 'Email verification code is required. Please check your inbox.' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP code
    const otpValidation = verifyOtp(normalizedEmail, otpCode);
    if (!otpValidation.success) {
      return NextResponse.json(
        { error: otpValidation.error || 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A hero with this email already exists' }, { status: 409 });
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username: { equals: trimmedUsername } },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Hero Name is already claimed by another adventurer' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const today = new Date().toISOString().split('T')[0];
    const { DEFAULT_CUSTOM_REWARDS } = await import('@/lib/seed-data');

    // Create user along with character, starter quests, and custom rewards
    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        passwordHash,
        avatar,
        characterTitle: 'Novice Adventurer',
        character: {
          create: {
            level: 1,
            xp: 0,
            gender: ['MALE', 'FEMALE', 'NON_BINARY'].includes(gender) ? gender : 'MALE',
            currentHp: 100,
            maxHp: 100,
            currentMana: 50,
            maxMana: 50,
            gold: 100,
            streak: 1,
            lastActiveDate: today,
            strength: 10,
            intellect: 10,
            vitality: 10,
            agility: 10,
            spirit: 10,
          },
        },
        customRewards: {
          create: DEFAULT_CUSTOM_REWARDS.map((r) => ({
            title: r.title,
            description: r.description,
            cost: r.cost,
            icon: r.icon,
          })),
        },
        quests: {
          create: STARTER_QUESTS.map((q) => ({
            title: q.title,
            description: q.description,
            type: q.type,
            difficulty: q.difficulty,
            attribute: q.attribute,
            xpReward: q.xpReward,
            goldReward: q.goldReward,
          })),
        },
      },
      include: {
        character: true,
      },
    });

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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
