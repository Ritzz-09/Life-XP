import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  calculateRewards,
  calculateStreak,
  processXpGain,
  DifficultyType,
  AttributeType,
} from '@/lib/rpg-engine';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id },
    });

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found or access denied' }, { status: 404 });
    }

    const character = user.character;
    const today = new Date().toISOString().split('T')[0];

    // Check if uncompleting an already completed quest
    if (quest.isCompleted) {
      // Toggle back to active
      const updatedQuest = await prisma.quest.update({
        where: { id },
        data: {
          isCompleted: false,
          completedAt: null,
        },
      });

      return NextResponse.json({
        success: true,
        action: 'uncompleted',
        quest: updatedQuest,
        character,
      });
    }

    // 1. Calculate user streak
    const { streak: newStreak } = calculateStreak(character.lastActiveDate, character.streak);

    // 2. Calculate rewards with streak multiplier
    const validDifficulty = (quest.difficulty.toUpperCase() as DifficultyType) || 'MEDIUM';
    const rewards = calculateRewards(validDifficulty, newStreak);

    // 3. Process XP and non-linear leveling
    const xpResult = processXpGain(character.level, character.xp, rewards.xp);

    // 4. Attribute stat growth
    const attribute = (quest.attribute.toUpperCase() as AttributeType) || 'STR';
    const statUpdates: Record<string, number> = {};

    if (attribute === 'STR') statUpdates.strength = character.strength + 1;
    if (attribute === 'INT') statUpdates.intellect = character.intellect + 1;
    if (attribute === 'VIT') {
      statUpdates.vitality = character.vitality + 1;
      statUpdates.maxHp = character.maxHp + 5; // Vitality expands health pool
    }
    if (attribute === 'AGI') statUpdates.agility = character.agility + 1;
    if (attribute === 'SPR') statUpdates.spirit = character.spirit + 1;

    // Full HP recovery on Level Up
    const newHp = xpResult.leveledUp
      ? (statUpdates.maxHp || character.maxHp)
      : character.currentHp;

    // 5. Update character in database
    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        level: xpResult.newLevel,
        xp: xpResult.newXp,
        gold: character.gold + rewards.gold,
        streak: newStreak,
        lastActiveDate: today,
        currentHp: newHp,
        ...statUpdates,
      },
    });

    // 6. Update quest status & streak
    const updatedQuest = await prisma.quest.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        streak: quest.streak + 1,
      },
    });

    // 7. Log quest completion for activity heatmaps
    await prisma.questCompletionLog.create({
      data: {
        userId: user.id,
        questId: quest.id,
        questTitle: quest.title,
        xpEarned: rewards.xp,
        goldEarned: rewards.gold,
        attribute,
        dateStr: today,
      },
    });

    // 8. Deal damage to active boss encounter
    let bossDamage = 0;
    let bossRemainingHp = 0;
    const activeBoss = await prisma.bossEncounter.findFirst({
      where: { isActive: true },
    });

    if (activeBoss) {
      const weaknessMultiplier = activeBoss.weakness === attribute ? 1.5 : 1.0;
      bossDamage = Math.round(rewards.baseDamage * weaknessMultiplier);
      const calculatedHp = Math.max(0, activeBoss.currentHp - bossDamage);

      const updatedBoss = await prisma.bossEncounter.update({
        where: { id: activeBoss.id },
        data: {
          currentHp: calculatedHp <= 0 ? activeBoss.maxHp : calculatedHp, // Respawn or reset if slain
        },
      });

      bossRemainingHp = updatedBoss.currentHp;
    }

    return NextResponse.json({
      success: true,
      action: 'completed',
      quest: updatedQuest,
      character: updatedCharacter,
      rewards: {
        xp: rewards.xp,
        gold: rewards.gold,
        attribute,
        streak: newStreak,
      },
      progression: {
        leveledUp: xpResult.leveledUp,
        levelsGained: xpResult.levelsGained,
        newLevel: xpResult.newLevel,
      },
      boss: {
        damageDealt: bossDamage,
        remainingHp: bossRemainingHp,
      },
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    return NextResponse.json({ error: 'Failed to record quest victory' }, { status: 500 });
  }
}
