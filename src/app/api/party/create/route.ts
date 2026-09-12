import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

function generatePartyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingMember = await prisma.partyMember.findUnique({
      where: { userId: user.id },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already in a party. Leave your current party first.' },
        { status: 400 }
      );
    }

    const { name } = await req.json();
    const partyName = (name && name.trim()) || `${user.username}'s Vanguard`;

    // Generate unique code
    let code = generatePartyCode();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const existing = await prisma.party.findUnique({ where: { inviteCode: code } });
      if (!existing) {
        isUnique = true;
      } else {
        code = generatePartyCode();
        attempts++;
      }
    }

    const party = await prisma.party.create({
      data: {
        name: partyName,
        inviteCode: code,
        bossTarget: 'Void Harbinger Malakor',
        bossHp: 15000,
        bossMaxHp: 15000,
        members: {
          create: {
            userId: user.id,
            role: 'LEADER',
          },
        },
        activities: {
          create: {
            username: user.username,
            action: `founded the guild party "${partyName}"!`,
            damage: 0,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                characterTitle: true,
                character: {
                  select: {
                    level: true,
                    characterClass: true,
                    streak: true,
                  },
                },
              },
            },
          },
        },
        activities: true,
      },
    });

    // Update user character with partyId reference
    await prisma.character.update({
      where: { userId: user.id },
      data: { partyId: party.id },
    });

    return NextResponse.json({
      success: true,
      party,
      role: 'LEADER',
    });
  } catch (error) {
    console.error('Failed to create party:', error);
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 });
  }
}
