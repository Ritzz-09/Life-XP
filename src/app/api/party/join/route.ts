import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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
        { error: 'You are already in a party. Leave your current party before joining a new one.' },
        { status: 400 }
      );
    }

    const { inviteCode } = await req.json();
    if (!inviteCode) {
      return NextResponse.json({ error: 'Party invite code is required' }, { status: 400 });
    }

    const code = inviteCode.trim().toUpperCase();
    const party = await prisma.party.findUnique({
      where: { inviteCode: code },
      include: {
        members: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found with that invite code.' }, { status: 404 });
    }

    if (party.members.length >= 8) {
      return NextResponse.json({ error: 'This party has reached the maximum capacity of 8 adventurers.' }, { status: 400 });
    }

    // Add user as member
    await prisma.partyMember.create({
      data: {
        partyId: party.id,
        userId: user.id,
        role: 'MEMBER',
      },
    });

    // Log activity
    await prisma.partyActivityLog.create({
      data: {
        partyId: party.id,
        username: user.username,
        action: 'joined the party roster!',
        damage: 0,
      },
    });

    await prisma.character.update({
      where: { userId: user.id },
      data: { partyId: party.id },
    });

    // Fetch updated party
    const updatedParty = await prisma.party.findUnique({
      where: { id: party.id },
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
    });

    return NextResponse.json({
      success: true,
      party: updatedParty,
      role: 'MEMBER',
    });
  } catch (error) {
    console.error('Failed to join party:', error);
    return NextResponse.json({ error: 'Failed to join party' }, { status: 500 });
  }
}
