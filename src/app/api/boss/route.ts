import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureSeedData } from '@/lib/ensure-seed';

export async function GET() {
  try {
    await ensureSeedData();

    const boss = await prisma.bossEncounter.findFirst({
      where: { isActive: true },
    });

    if (!boss) {
      return NextResponse.json({ error: 'No active boss encounter found' }, { status: 404 });
    }

    // Also get the latest 5 completion strikes against the boss
    const recentStrikes = await prisma.questCompletionLog.findMany({
      orderBy: { completedAt: 'desc' },
      take: 6,
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      boss,
      recentStrikes,
    });
  } catch (error) {
    console.error('Error fetching boss:', error);
    return NextResponse.json({ error: 'Failed to summon raid boss status' }, { status: 500 });
  }
}
