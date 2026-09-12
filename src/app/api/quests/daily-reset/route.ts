import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const character = user.character;
    const today = new Date().toISOString().split('T')[0];

    // If already active today, no daily reset needed
    if (character.lastActiveDate === today) {
      return NextResponse.json({ hasReport: false });
    }

    // Check for missed daily quests from previous days
    const incompleteDailies = await prisma.quest.findMany({
      where: {
        userId: user.id,
        type: 'DAILY',
        isCompleted: false,
      },
    });

    const missedCount = incompleteDailies.length;
    let damageTaken = 0;
    let newHp = character.currentHp;

    // Only apply penalty if the user had previous activity
    if (character.lastActiveDate && missedCount > 0) {
      damageTaken = missedCount * 15; // 15 HP per missed daily
      newHp = Math.max(1, character.currentHp - damageTaken);
    }

    // Reset daily and habit quests for the new day
    await prisma.quest.updateMany({
      where: {
        userId: user.id,
        type: { in: ['DAILY', 'HABIT'] },
      },
      data: {
        isCompleted: false,
        completedAt: null,
      },
    });

    // Update character's last active date and HP
    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        lastActiveDate: today,
        currentHp: newHp,
      },
    });

    return NextResponse.json({
      hasReport: true,
      missedCount,
      damageTaken,
      currentHp: newHp,
      maxHp: character.maxHp,
      lastActiveDate: character.lastActiveDate,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error in daily reset check:', error);
    return NextResponse.json({ error: 'Failed to process daily reset' }, { status: 500 });
  }
}
