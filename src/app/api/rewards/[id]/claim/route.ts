import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const reward = await prisma.customReward.findFirst({
      where: { id, userId: user.id },
    });

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    const character = user.character;
    if (character.gold < reward.cost) {
      return NextResponse.json(
        { error: `Insufficient gold. Requires ${reward.cost} Gold (you have ${character.gold}).` },
        { status: 400 }
      );
    }

    // Deduct gold
    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        gold: character.gold - reward.cost,
      },
    });

    // Increment timesClaimed
    const updatedReward = await prisma.customReward.update({
      where: { id: reward.id },
      data: {
        timesClaimed: reward.timesClaimed + 1,
      },
    });

    // Record log
    await prisma.rewardRedemptionLog.create({
      data: {
        userId: user.id,
        rewardTitle: reward.title,
        cost: reward.cost,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Claimed "${reward.title}" for ${reward.cost} Gold! Enjoy your real-world treat!`,
      reward: updatedReward,
      remainingGold: updatedCharacter.gold,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error claiming custom reward:', error);
    return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 });
  }
}
