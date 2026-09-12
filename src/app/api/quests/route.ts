import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DIFFICULTY_CONFIG, DifficultyType } from '@/lib/rpg-engine';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quests = await prisma.quest.findMany({
      where: { userId: user.id },
      orderBy: [
        { isCompleted: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json({ error: 'Failed to load quests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description = '',
      type = 'TODO',
      difficulty = 'MEDIUM',
      attribute = 'STR',
      dueDate = null,
    } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Quest title is required' }, { status: 400 });
    }

    const validDifficulty = (difficulty.toUpperCase() in DIFFICULTY_CONFIG
      ? difficulty.toUpperCase()
      : 'MEDIUM') as DifficultyType;

    const rewardConfig = DIFFICULTY_CONFIG[validDifficulty];

    const quest = await prisma.quest.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        type: type.toUpperCase(),
        difficulty: validDifficulty,
        attribute: attribute.toUpperCase(),
        xpReward: rewardConfig.xp,
        goldReward: rewardConfig.gold,
        dueDate: dueDate || null,
      },
    });

    return NextResponse.json({ success: true, quest }, { status: 201 });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json({ error: 'Failed to forge quest' }, { status: 500 });
  }
}
