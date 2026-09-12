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

    // Read optional focus parameters from request body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const isHyperfocus = Boolean(body?.hyperfocus);

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

    // Parse unlocked skills for passive buffs
    let unlockedSkills: string[] = [];
    try {
      unlockedSkills = JSON.parse(character.unlockedSkills || '[]');
    } catch {
      unlockedSkills = [];
    }

    let xpMultiplier = 1.0;
    let goldMultiplier = 1.0;
    let bossDamageMultiplier = 1.0;
    let partyRaidMultiplier = 1.0;

    if (unlockedSkills.includes('s3_curiosity')) xpMultiplier += 0.10;
    if (unlockedSkills.includes('s2_deep_work') && isHyperfocus) xpMultiplier += 0.30;
    if (unlockedSkills.includes('m2_golden_aura')) goldMultiplier += 0.20;
    if (unlockedSkills.includes('w2_heavy_strike')) bossDamageMultiplier += 0.15;
    if (unlockedSkills.includes('m3_guild_beacon')) partyRaidMultiplier += 0.25;

    // 1. Calculate user streak
    const { streak: newStreak } = calculateStreak(character.lastActiveDate, character.streak);

    // 2. Calculate rewards with streak multiplier & skill buffs
    const validDifficulty = (quest.difficulty.toUpperCase() as DifficultyType) || 'MEDIUM';
    const baseRewards = calculateRewards(validDifficulty, newStreak);
    const bonusXp = isHyperfocus ? 20 : 0;
    const finalXp = Math.round((baseRewards.xp + bonusXp) * xpMultiplier);
    const finalGold = Math.round(baseRewards.gold * goldMultiplier);

    // 3. Process XP and non-linear leveling
    const xpResult = processXpGain(character.level, character.xp, finalXp);

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

    // Award skill points on level up
    const newSkillPoints = (character.skillPoints || 0) + (xpResult.leveledUp ? xpResult.levelsGained : 0);

    // 5. Update character in database
    const updatedCharacter = await prisma.character.update({
      where: { userId: user.id },
      data: {
        level: xpResult.newLevel,
        xp: xpResult.newXp,
        gold: character.gold + finalGold,
        streak: newStreak,
        lastActiveDate: today,
        currentHp: newHp,
        skillPoints: newSkillPoints,
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
        xpEarned: finalXp,
        goldEarned: finalGold,
        attribute,
        dateStr: today,
      },
    });

    // 8. Deal damage to active boss encounter
    let bossDamage = 0;
    let bossRemainingHp = 0;
    let bossSlain = false;
    let defeatedBossName = '';
    let nextBossName = '';
    let lootChest: {
      gold: number;
      xp: number;
      itemReward?: string;
      titleReward?: string;
    } | null = null;

    const activeBoss = await prisma.bossEncounter.findFirst({
      where: { isActive: true },
    });

    if (activeBoss) {
      const weaknessMultiplier = activeBoss.weakness === attribute ? 1.5 : 1.0;
      bossDamage = Math.round(baseRewards.baseDamage * weaknessMultiplier * bossDamageMultiplier);
      const calculatedHp = Math.max(0, activeBoss.currentHp - bossDamage);

      if (calculatedHp <= 0) {
        bossSlain = true;
        defeatedBossName = activeBoss.name;

        // Boss defeat loot chest
        lootChest = {
          gold: activeBoss.rewardGold,
          xp: activeBoss.rewardXp,
          titleReward: `Slayer of ${activeBoss.name.split(' ')[0]}`,
        };

        // Check if there is an unowned item to award as bonus loot
        const ownedItemIds = (
          await prisma.userItem.findMany({
            where: { userId: user.id },
            select: { itemId: true },
          })
        ).map((ui) => ui.itemId);

        const unownedItem = await prisma.item.findFirst({
          where: { id: { notIn: ownedItemIds } },
        });

        if (unownedItem) {
          await prisma.userItem.create({
            data: {
              userId: user.id,
              itemId: unownedItem.id,
              quantity: 1,
            },
          });
          lootChest.itemReward = unownedItem.name;
        }

        // Award character boss victory rewards & increment bossKills
        const postBossXpResult = processXpGain(
          updatedCharacter.level,
          updatedCharacter.xp,
          activeBoss.rewardXp
        );

        await prisma.character.update({
          where: { userId: user.id },
          data: {
            gold: updatedCharacter.gold + activeBoss.rewardGold,
            level: postBossXpResult.newLevel,
            xp: postBossXpResult.newXp,
            bossKills: (character.bossKills || 0) + 1,
          },
        });

        // Rotate to next boss
        const { BOSS_ROTATION } = await import('@/lib/seed-data');
        const currentIndex = activeBoss.bossIndex || 0;
        const nextIndex = (currentIndex + 1) % BOSS_ROTATION.length;
        const nextTier = (activeBoss.tier || 1) + 1;
        const nextTemplate = BOSS_ROTATION[nextIndex];
        const scaledHp = Math.round(nextTemplate.maxHp * Math.pow(1.15, nextTier - 1));

        const updatedBoss = await prisma.bossEncounter.update({
          where: { id: activeBoss.id },
          data: {
            name: nextTemplate.name,
            title: nextTemplate.title,
            description: nextTemplate.description,
            maxHp: scaledHp,
            currentHp: scaledHp,
            avatar: nextTemplate.avatar,
            weakness: nextTemplate.weakness,
            rewardGold: Math.round(nextTemplate.rewardGold * Math.pow(1.1, nextTier - 1)),
            rewardXp: Math.round(nextTemplate.rewardXp * Math.pow(1.1, nextTier - 1)),
            tier: nextTier,
            bossIndex: nextIndex,
          },
        });

        bossRemainingHp = updatedBoss.currentHp;
        nextBossName = updatedBoss.name;
      } else {
        const updatedBoss = await prisma.bossEncounter.update({
          where: { id: activeBoss.id },
          data: {
            currentHp: calculatedHp,
          },
        });

        bossRemainingHp = updatedBoss.currentHp;
      }
    }

    // 9. Co-Op Party Boss Raid synchronization
    let partyBossDamage = 0;
    let partyBossRemainingHp = 0;
    let partyBossSlain = false;

    const partyMember = await prisma.partyMember.findUnique({
      where: { userId: user.id },
      include: { party: true },
    });

    if (partyMember && partyMember.party) {
      partyBossDamage = Math.round(bossDamage * partyRaidMultiplier);
      const calculatedPartyHp = Math.max(0, partyMember.party.bossHp - partyBossDamage);

      if (calculatedPartyHp <= 0) {
        partyBossSlain = true;
        const nextMaxHp = Math.round(partyMember.party.bossMaxHp * 1.3);
        const nextBossNames = [
          'Abyssal Void Colossus',
          'Infernal Dread Leviathan',
          'Celestial Chrono-Drake',
          'Shadow Emperor Thanatos',
          'Cybernetic Omega Titan',
        ];
        const nextName = nextBossNames[Math.floor(Math.random() * nextBossNames.length)];

        await prisma.party.update({
          where: { id: partyMember.party.id },
          data: {
            bossTarget: nextName,
            bossHp: nextMaxHp,
            bossMaxHp: nextMaxHp,
          },
        });
        partyBossRemainingHp = nextMaxHp;

        await prisma.partyActivityLog.create({
          data: {
            partyId: partyMember.party.id,
            username: user.username,
            action: `struck the FATAL BLOW, vanquishing the Guild Boss! A new foe "${nextName}" has emerged!`,
            damage: partyBossDamage,
          },
        });
      } else {
        await prisma.party.update({
          where: { id: partyMember.party.id },
          data: {
            bossHp: calculatedPartyHp,
          },
        });
        partyBossRemainingHp = calculatedPartyHp;

        await prisma.partyActivityLog.create({
          data: {
            partyId: partyMember.party.id,
            username: user.username,
            action: `conquered "${quest.title}" and dealt ${partyBossDamage} damage to the Guild Boss!`,
            damage: partyBossDamage,
          },
        });
      }
    }

    // Refresh final character stats to return
    const finalCharacter = await prisma.character.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      action: 'completed',
      quest: updatedQuest,
      character: finalCharacter || updatedCharacter,
      rewards: {
        xp: finalXp,
        gold: finalGold,
        attribute,
        streak: newStreak,
        hyperfocusBonus: isHyperfocus ? 20 : 0,
      },
      progression: {
        leveledUp: xpResult.leveledUp,
        levelsGained: xpResult.levelsGained,
        newLevel: xpResult.newLevel,
      },
      boss: {
        damageDealt: bossDamage,
        remainingHp: bossRemainingHp,
        bossSlain,
        defeatedBossName,
        nextBossName,
        lootChest,
      },
      party: {
        inParty: Boolean(partyMember),
        damageDealt: partyBossDamage,
        remainingHp: partyBossRemainingHp,
        bossSlain: partyBossSlain,
      },
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    return NextResponse.json({ error: 'Failed to record quest victory' }, { status: 500 });
  }
}
