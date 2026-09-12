import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeedData } from '@/lib/ensure-seed';

export async function GET() {
  try {
    await ensureSeedData();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.item.findMany({
      orderBy: [
        { category: 'asc' },
        { cost: 'asc' },
      ],
    });

    const inventory = await prisma.userItem.findMany({
      where: { userId: user.id },
      include: {
        item: true,
      },
      orderBy: {
        acquiredAt: 'desc',
      },
    });

    return NextResponse.json({
      items,
      inventory,
      gold: user.character?.gold || 0,
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json({ error: 'Failed to open merchant shop' }, { status: 500 });
  }
}
