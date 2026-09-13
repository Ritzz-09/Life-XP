import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ensureSeedData } from '@/lib/ensure-seed';
import { STARTER_QUESTS } from '@/lib/seed-data';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`register:${clientIp}`, 4, 30 * 60 * 1000); // 4 registrations per 30 mins per IP

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
    const { username, email, password, avatar = 'warrior', gender = 'MALE' } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    // Input sanitization & validation for security pentest
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
      return NextResponse.json({ error: 'Username must be between 3 and 24 characters' }, { status: 400 });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, hyphens, and underscores' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters for account security' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A hero with this email already exists' }, { status: 409 });
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
