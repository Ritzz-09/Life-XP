import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { processXpGain } from '@/lib/rpg-engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userItemId } = body;

    const userItem = await prisma.userItem.findFirst({
      where: { id: userItemId, userId: user.id },
      include: { item: true },
    });

    if (!userItem || userItem.quantity <= 0) {
      return NextResponse.json({ error: 'Item not available in your bag' }, { status: 400 });
    }

    const item = userItem.item;
    if (item.category !== 'CONSUMABLE') {
      return NextResponse.json({ error: 'This item cannot be consumed' }, { status: 400 });
    }

    const character = user.character;
    let message = '';
    const charUpdates: Record<string, number> = {};
    let leveledUp = false;

    if (item.statType === 'HP') {
      const restored = Math.min(character.maxHp, character.currentHp + item.statBonus);
      charUpdates.currentHp = restored;
      message = `Consumed ${item.name}! Restored ${item.statBonus} HP.`;
    } else if (item.statType === 'XP_BOOST') {
      const xpResult = processXpGain(character.level, character.xp, item.statBonus);
      charUpdates.level = xpResult.newLevel;
      charUpdates.xp = xpResult.newXp;
      leveledUp = xpResult.leveledUp;
      message = `Consumed ${item.name}! Gained ${item.statBonus} XP.`;
    }

    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: charUpdates,
    });

    // Deduct item quantity
    if (userItem.quantity > 1) {
      await prisma.userItem.update({
        where: { id: userItem.id },
        data: { quantity: userItem.quantity - 1 },
      });
    } else {
      await prisma.userItem.delete({
        where: { id: userItem.id },
      });
    }

    return NextResponse.json({
      success: true,
      message,
      character: updatedCharacter,
      leveledUp,
    });
  } catch (error) {
    console.error('Error using consumable:', error);
    return NextResponse.json({ error: 'Failed to use item' }, { status: 500 });
  }
}
