import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ACHIEVEMENTS_DATA } from '@/lib/achievements-data';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.character) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const character = user.character;
    let unlockedAchievements: string[] = [];
    try {
      unlockedAchievements = JSON.parse(character.unlockedAchievements || '[]');
    } catch {
      unlockedAchievements = [];
    }

    let unlockedSkills: string[] = [];
    try {
      unlockedSkills = JSON.parse(character.unlockedSkills || '[]');
    } catch {
      unlockedSkills = [];
    }

    // Aggregate statistics
    const totalCompletions = await prisma.questCompletionLog.count({
      where: { userId: user.id },
    });

    const partyMembership = await prisma.partyMember.findUnique({
      where: { userId: user.id },
    });

    // Check branch counts for mastery
    const warriorSkillsCount = unlockedSkills.filter((s) => s.startsWith('w')).length;
    const scholarSkillsCount = unlockedSkills.filter((s) => s.startsWith('s')).length;
    const mysticSkillsCount = unlockedSkills.filter((s) => s.startsWith('m')).length;
    const maxBranchSkills = Math.max(warriorSkillsCount, scholarSkillsCount, mysticSkillsCount);

    const hasTier4 = unlockedSkills.some((s) => s.includes('4'));
    const minAttribute = Math.min(
      character.strength,
      character.intellect,
      character.vitality,
      character.agility,
      character.spirit
    );

    const achievementsWithStatus = ACHIEVEMENTS_DATA.map((ach) => {
      let currentProgress = 0;

      switch (ach.id) {
        // Quests
        case 'quest_first_step':
        case 'quest_ten':
        case 'quest_twenty_five':
        case 'quest_fifty':
        case 'quest_hundred':
          currentProgress = totalCompletions;
          break;

        // Streaks
        case 'streak_3':
        case 'streak_7':
        case 'streak_14':
        case 'streak_30':
          currentProgress = character.streak;
          break;

        // Bosses
        case 'boss_first_kill':
        case 'boss_three_kills':
        case 'boss_five_kills':
        case 'boss_ten_kills':
          currentProgress = character.bossKills || 0;
          break;

        // Levels
        case 'level_5':
        case 'level_10':
        case 'level_20':
        case 'level_30':
          currentProgress = character.level;
          break;

        // Wealth
        case 'gold_250':
        case 'gold_1000':
        case 'gold_5000':
          currentProgress = character.gold;
          break;

        // Mastery
        case 'skill_first_unlock':
          currentProgress = unlockedSkills.length;
          break;
        case 'skill_branch_specialist':
          currentProgress = maxBranchSkills;
          break;
        case 'skill_tier4_unlock':
          currentProgress = hasTier4 ? 1 : 0;
          break;
        case 'party_join':
          currentProgress = partyMembership ? 1 : 0;
          break;
        case 'all_attributes_15':
          currentProgress = minAttribute;
          break;
        default:
          currentProgress = 0;
      }

      const isClaimed = unlockedAchievements.includes(ach.id);
      const isComplete = currentProgress >= ach.target;
      const status = isClaimed ? 'CLAIMED' : isComplete ? 'READY_TO_CLAIM' : 'LOCKED';

      return {
        ...ach,
        currentProgress: Math.min(currentProgress, ach.target),
        status,
      };
    });

    const totalClaimed = achievementsWithStatus.filter((a) => a.status === 'CLAIMED').length;
    const readyToClaimCount = achievementsWithStatus.filter((a) => a.status === 'READY_TO_CLAIM').length;

    return NextResponse.json({
      achievements: achievementsWithStatus,
      totalClaimed,
      readyToClaimCount,
      totalAvailable: ACHIEVEMENTS_DATA.length,
    });
  } catch (error) {
    console.error('Failed to get achievements:', error);
    return NextResponse.json({ error: 'Failed to retrieve achievements' }, { status: 500 });
  }
}
