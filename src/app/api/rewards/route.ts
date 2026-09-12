import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DEFAULT_CUSTOM_REWARDS } from '@/lib/seed-data';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let customRewards = await prisma.customReward.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed default custom rewards if empty
    if (customRewards.length === 0) {
      await prisma.customReward.createMany({
        data: DEFAULT_CUSTOM_REWARDS.map((r) => ({
          userId: user.id,
          title: r.title,
          description: r.description,
          cost: r.cost,
          icon: r.icon,
        })),
      });

      customRewards = await prisma.customReward.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    const redemptions = await prisma.rewardRedemptionLog.findMany({
      where: { userId: user.id },
      orderBy: { redeemedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      rewards: customRewards,
      redemptions,
    });
  } catch (error) {
    console.error('Error fetching custom rewards:', error);
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description = '', cost = 50, icon = 'Gift' } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Reward title is required' }, { status: 400 });
    }

    const validCost = Math.max(5, parseInt(String(cost), 10) || 50);

    const reward = await prisma.customReward.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        cost: validCost,
        icon: icon || 'Gift',
      },
    });

    return NextResponse.json({
      success: true,
      reward,
    });
  } catch (error) {
    console.error('Error creating custom reward:', error);
    return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 });
  }
}
