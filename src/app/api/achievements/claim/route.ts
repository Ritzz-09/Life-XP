import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ACHIEVEMENTS_DATA } from '@/lib/achievements-data';
import { processXpGain } from '@/lib/rpg-engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { achievementId } = await req.json();
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
    if (!ach) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    const character = user.character;
    let unlockedAchievements: string[] = [];
    try {
      unlockedAchievements = JSON.parse(character.unlockedAchievements || '[]');
    } catch {
      unlockedAchievements = [];
    }

    if (unlockedAchievements.includes(achievementId)) {
      return NextResponse.json({ error: 'Achievement already claimed' }, { status: 400 });
    }

    // Award XP and Gold
    const xpResult = processXpGain(character.level, character.xp, ach.rewardXp);
    const newGold = character.gold + ach.rewardGold;
    const newUnlocked = [...unlockedAchievements, achievementId];

    // Check if new title unlocked
    if (ach.rewardTitle) {
      await prisma.user.update({
        where: { id: user.id },
        data: { characterTitle: ach.rewardTitle },
      });
    }

    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        gold: newGold,
        level: xpResult.newLevel,
        xp: xpResult.newXp,
        unlockedAchievements: JSON.stringify(newUnlocked),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Claimed ${ach.title}! +${ach.rewardXp} XP, +${ach.rewardGold} Gold!`,
      rewardXp: ach.rewardXp,
      rewardGold: ach.rewardGold,
      rewardTitle: ach.rewardTitle,
      leveledUp: xpResult.leveledUp,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Failed to claim achievement:', error);
    return NextResponse.json({ error: 'Failed to claim achievement' }, { status: 500 });
  }
}
