export type AttributeType = 'STR' | 'INT' | 'VIT' | 'AGI' | 'SPR';
export type DifficultyType = 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';
export type QuestType = 'HABIT' | 'DAILY' | 'TODO' | 'BOSS';

export interface RewardConfig {
  xp: number;
  gold: number;
  baseDamage: number;
}

export const DIFFICULTY_CONFIG: Record<DifficultyType, RewardConfig> = {
  TRIVIAL: { xp: 15, gold: 10, baseDamage: 15 },
  EASY: { xp: 30, gold: 20, baseDamage: 30 },
  MEDIUM: { xp: 60, gold: 40, baseDamage: 65 },
  HARD: { xp: 120, gold: 80, baseDamage: 130 },
  EPIC: { xp: 250, gold: 180, baseDamage: 280 },
};

export const ATTRIBUTE_METADATA: Record<
  AttributeType,
  { name: string; full: string; color: string; bg: string; icon: string; description: string }
> = {
  STR: {
    name: 'Strength',
    full: 'Strength (STR)',
    color: '#ef4444',
    bg: 'bg-red-500/10 border-red-500/30 text-red-400',
    icon: 'Dumbbell',
    description: 'Workouts, fitness, physical labor, and physical stamina',
  },
  INT: {
    name: 'Intellect',
    full: 'Intellect (INT)',
    color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    icon: 'Brain',
    description: 'Coding, studying, reading, and problem-solving',
  },
  VIT: {
    name: 'Vitality',
    full: 'Vitality (VIT)',
    color: '#10b981',
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    icon: 'Heart',
    description: 'Sleep, nutrition, hydration, and overall well-being',
  },
  AGI: {
    name: 'Agility',
    full: 'Agility (AGI)',
    color: '#f59e0b',
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    icon: 'Zap',
    description: 'Quick errands, rapid communication, and inbox-zero agility',
  },
  SPR: {
    name: 'Spirit',
    full: 'Spirit (SPR)',
    color: '#8b5cf6',
    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    icon: 'Sparkles',
    description: 'Meditation, mindfulness, social connection, and reflection',
  },
};

/**
 * Non-linear leveling curve:
 * XP required to advance from Level L to Level L + 1
 * Formula: floor(100 * (Level ^ 1.5))
 */
export function getXpRequiredForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(Math.max(1, level), 1.5));
}

/**
 * Calculates current level and leftover XP given accumulated total XP or applies level progression.
 */
export function processXpGain(
  currentLevel: number,
  currentXp: number,
  xpGained: number
): { newLevel: number; newXp: number; leveledUp: boolean; levelsGained: number } {
  let level = currentLevel;
  let xp = currentXp + xpGained;
  let leveledUp = false;
  let levelsGained = 0;

  while (true) {
    const required = getXpRequiredForNextLevel(level);
    if (xp >= required) {
      xp -= required;
      level += 1;
      leveledUp = true;
      levelsGained += 1;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    newXp: xp,
    leveledUp,
    levelsGained,
  };
}

/**
 * Calculates streak count based on last active date string YYYY-MM-DD
 */
export function calculateStreak(
  lastActiveDate: string,
  currentStreak: number
): { streak: number; isNewDay: boolean } {
  const today = new Date().toISOString().split('T')[0];

  if (!lastActiveDate) {
    return { streak: 1, isNewDay: true };
  }

  if (lastActiveDate === today) {
    return { streak: Math.max(1, currentStreak), isNewDay: false };
  }

  // Calculate difference in days
  const lastDate = new Date(lastActiveDate);
  const nowDate = new Date(today);
  const diffTime = nowDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return { streak: currentStreak + 1, isNewDay: true };
  } else if (diffDays > 1) {
    // Streak broken
    return { streak: 1, isNewDay: true };
  }

  return { streak: currentStreak, isNewDay: false };
}

/**
 * Streak multiplier: +5% reward per day up to +50% at 10 days
 */
export function getStreakMultiplier(streak: number): number {
  const bonus = Math.min(0.5, Math.max(0, (streak - 1) * 0.05));
  return 1 + bonus;
}

/**
 * Calculates final rewards for a quest completion taking into account streak multiplier
 */
export function calculateRewards(
  difficulty: DifficultyType,
  streak: number
): { xp: number; gold: number; baseDamage: number } {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.MEDIUM;
  const multiplier = getStreakMultiplier(streak);

  return {
    xp: Math.round(config.xp * multiplier),
    gold: Math.round(config.gold * multiplier),
    baseDamage: Math.round(config.baseDamage * multiplier),
  };
}
