import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partyMember = await prisma.partyMember.findUnique({
      where: { userId: user.id },
      include: {
        party: {
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
            activities: {
              orderBy: { timestamp: 'desc' },
              take: 20,
            },
          },
        },
      },
    });

    if (!partyMember) {
      return NextResponse.json({ inParty: false });
    }

    return NextResponse.json({
      inParty: true,
      role: partyMember.role,
      party: partyMember.party,
    });
  } catch (error) {
    console.error('Failed to get party:', error);
    return NextResponse.json({ error: 'Failed to retrieve party' }, { status: 500 });
  }
}
