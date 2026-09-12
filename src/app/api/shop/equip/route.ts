import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userItemId } = body;

    if (!userItemId) {
      return NextResponse.json({ error: 'User item ID is required' }, { status: 400 });
    }

    const userItem = await prisma.userItem.findFirst({
      where: { id: userItemId, userId: user.id },
      include: { item: true },
    });

    if (!userItem) {
      return NextResponse.json({ error: 'Item not found in inventory' }, { status: 404 });
    }

    const item = userItem.item;
    const isNowEquipped = !userItem.isEquipped;

    // If equipping, unequip any other item in the same category
    if (isNowEquipped) {
      const otherEquippedInCategory = await prisma.userItem.findMany({
        where: {
          userId: user.id,
          isEquipped: true,
          item: { category: item.category },
        },
      });

      for (const other of otherEquippedInCategory) {
        await prisma.userItem.update({
          where: { id: other.id },
          data: { isEquipped: false },
        });
      }
    }

    // Toggle this item's equipped status
    const updatedUserItem = await prisma.userItem.update({
      where: { id: userItem.id },
      data: { isEquipped: isNowEquipped },
      include: { item: true },
    });

    // Update character's equipped reference
    const characterUpdate: Record<string, string | null> = {};
    if (item.category === 'WEAPON') {
      characterUpdate.equippedWeaponId = isNowEquipped ? item.id : null;
    } else if (item.category === 'ARMOR') {
      characterUpdate.equippedArmorId = isNowEquipped ? item.id : null;
    } else if (item.category === 'BADGE') {
      characterUpdate.equippedBadgeId = isNowEquipped ? item.id : null;
    }

    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: characterUpdate,
    });

    return NextResponse.json({
      success: true,
      equipped: isNowEquipped,
      item: updatedUserItem,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error equipping item:', error);
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
  }
}
