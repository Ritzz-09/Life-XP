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
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found in armory' }, { status: 404 });
    }

    if (user.character.gold < item.cost) {
      return NextResponse.json(
        { error: `Insufficient gold! You need ${item.cost} gold, but have ${user.character.gold}.` },
        { status: 400 }
      );
    }

    // Deduct gold
    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        gold: user.character.gold - item.cost,
      },
    });

    // Check if user already owns this item
    const existingUserItem = await prisma.userItem.findUnique({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: item.id,
        },
      },
    });

    let userItem;
    if (existingUserItem) {
      userItem = await prisma.userItem.update({
        where: { id: existingUserItem.id },
        data: {
          quantity: existingUserItem.quantity + 1,
        },
        include: { item: true },
      });
    } else {
      userItem = await prisma.userItem.create({
        data: {
          userId: user.id,
          itemId: item.id,
          quantity: 1,
          isEquipped: false,
        },
        include: { item: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Purchased ${item.name}!`,
      item: userItem,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error purchasing item:', error);
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
}
