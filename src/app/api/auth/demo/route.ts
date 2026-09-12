import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ensureSeedData } from '@/lib/ensure-seed';
import { STARTER_QUESTS } from '@/lib/seed-data';

export async function POST() {
  try {
    await ensureSeedData();

    const demoEmail = 'hero@liferpg.realm';
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
      include: { character: true },
    });

    const today = new Date().toISOString().split('T')[0];

    if (!user) {
      const passwordHash = await hashPassword('hero123456');
      user = await prisma.user.create({
        data: {
          username: 'Kaelen Shadowblade',
          email: demoEmail,
          passwordHash,
          avatar: 'warrior',
          characterTitle: 'Vanguard Pathfinder',
          character: {
            create: {
              level: 3,
              xp: 140,
              currentHp: 85,
              maxHp: 125,
              currentMana: 45,
              maxMana: 60,
              gold: 240,
              streak: 4,
              lastActiveDate: today,
              strength: 18,
              intellect: 15,
              vitality: 16,
              agility: 14,
              spirit: 12,
            },
          },
          quests: {
            create: STARTER_QUESTS.map((q, idx) => ({
              title: q.title,
              description: q.description,
              type: q.type,
              difficulty: q.difficulty,
              attribute: q.attribute,
              xpReward: q.xpReward,
              goldReward: q.goldReward,
              isCompleted: idx === 0,
              completedAt: idx === 0 ? new Date() : null,
              streak: idx === 0 ? 3 : 0,
            })),
          },
        },
        include: {
          character: true,
        },
      });

      // Grant a starter weapon in inventory
      const sword = await prisma.item.findFirst({ where: { name: 'Novice Training Blade' } });
      if (sword) {
        await prisma.userItem.create({
          data: {
            userId: user.id,
            itemId: sword.id,
            isEquipped: true,
            quantity: 1,
          },
        });
        await prisma.character.update({
          where: { userId: user.id },
          data: { equippedWeaponId: sword.id },
        });
      }
    } else {
      // Ensure all starter quests exist for the existing demo hero
      for (const q of STARTER_QUESTS) {
        const hasQuest = await prisma.quest.findFirst({
          where: { userId: user.id, title: q.title },
        });
        if (!hasQuest) {
          await prisma.quest.create({
            data: {
              userId: user.id,
              title: q.title,
              description: q.description,
              type: q.type,
              difficulty: q.difficulty,
              attribute: q.attribute,
              xpReward: q.xpReward,
              goldReward: q.goldReward,
            },
          });
        }
      }
    }

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
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Demo auth error:', error);
    return NextResponse.json({ error: 'Failed to enter realm as demo adventurer' }, { status: 500 });
  }
}
