import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DIFFICULTY_CONFIG, DifficultyType } from '@/lib/rpg-engine';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, type, difficulty, attribute, dueDate } = body;

    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id },
    });

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found or access denied' }, { status: 404 });
    }

    let xpReward = quest.xpReward;
    let goldReward = quest.goldReward;

    if (difficulty && difficulty.toUpperCase() in DIFFICULTY_CONFIG) {
      const validDiff = difficulty.toUpperCase() as DifficultyType;
      xpReward = DIFFICULTY_CONFIG[validDiff].xp;
      goldReward = DIFFICULTY_CONFIG[validDiff].gold;
    }

    const updated = await prisma.quest.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(type !== undefined && { type: type.toUpperCase() }),
        ...(difficulty !== undefined && { difficulty: difficulty.toUpperCase(), xpReward, goldReward }),
        ...(attribute !== undefined && { attribute: attribute.toUpperCase() }),
        ...(dueDate !== undefined && { dueDate }),
      },
    });

    return NextResponse.json({ success: true, quest: updated });
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json({ error: 'Failed to update quest' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id },
    });

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found or access denied' }, { status: 404 });
    }

    await prisma.quest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Quest deleted from journal' });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 });
  }
}
