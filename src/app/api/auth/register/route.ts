import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ensureSeedData } from '@/lib/ensure-seed';
import { STARTER_QUESTS } from '@/lib/seed-data';

export async function POST(req: Request) {
  try {
    await ensureSeedData();

    const body = await req.json();
    const { username, email, password, avatar = 'warrior' } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A hero with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const today = new Date().toISOString().split('T')[0];

    // Create user along with character and starter quests
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
