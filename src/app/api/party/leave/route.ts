import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const membership = await prisma.partyMember.findUnique({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: 'You are not in any party' }, { status: 400 });
    }

    const partyId = membership.partyId;

    // Remove member
    await prisma.partyMember.delete({
      where: { userId: user.id },
    });

    await prisma.character.update({
      where: { userId: user.id },
      data: { partyId: null },
    });

    // Check remaining members
    const remainingMembers = await prisma.partyMember.findMany({
      where: { partyId },
      orderBy: { joinedAt: 'asc' },
    });

    if (remainingMembers.length === 0) {
      // Disband party
      await prisma.party.delete({
        where: { id: partyId },
      });
    } else {
      // If the leaving user was the leader, promote next member
      if (membership.role === 'LEADER') {
        await prisma.partyMember.update({
          where: { id: remainingMembers[0].id },
          data: { role: 'LEADER' },
        });
      }

      // Log leave
      await prisma.partyActivityLog.create({
        data: {
          partyId,
          username: user.username,
          action: 'departed from the fellowship.',
          damage: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully left the party',
    });
  } catch (error) {
    console.error('Failed to leave party:', error);
    return NextResponse.json({ error: 'Failed to leave party' }, { status: 500 });
  }
}
