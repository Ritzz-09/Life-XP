export interface SkillNode {
  id: string;
  name: string;
  branch: 'WARRIOR' | 'SCHOLAR' | 'MYSTIC';
  tier: number;
  description: string;
  perkSummary: string;
  prerequisiteId?: string;
  statBonus?: {
    strength?: number;
    intellect?: number;
    vitality?: number;
    agility?: number;
    spirit?: number;
    maxHp?: number;
    maxMana?: number;
  };
  icon: string;
}

export const SKILL_TREE_DATA: SkillNode[] = [
  // --- WARRIOR BRANCH ---
  {
    id: 'w1_iron_body',
    name: 'Iron Body',
    branch: 'WARRIOR',
    tier: 1,
    description: 'Forge an indomitable physical shell through rigorous daily discipline.',
    perkSummary: '+3 Vitality, +25 Max HP',
    statBonus: { vitality: 3, maxHp: 25 },
    icon: 'Shield',
  },
  {
    id: 'w2_heavy_strike',
    name: 'Heavy Strike',
    branch: 'WARRIOR',
    tier: 2,
    prerequisiteId: 'w1_iron_body',
    description: 'Channel your will into every completed task, crushing procrastination and foes alike.',
    perkSummary: '+3 Strength, +15% Boss Raid Damage',
    statBonus: { strength: 3 },
    icon: 'Swords',
  },
  {
    id: 'w3_unstoppable_momentum',
    name: 'Unstoppable Momentum',
    branch: 'WARRIOR',
    tier: 3,
    prerequisiteId: 'w2_heavy_strike',
    description: 'Momentum sustains your journey; your resolve cannot easily be broken.',
    perkSummary: '+5 Strength, +2 Vitality, Streak Loss Protection',
    statBonus: { strength: 5, vitality: 2, maxHp: 30 },
    icon: 'Flame',
  },
  {
    id: 'w4_titan_resolve',
    name: 'Titan Resolve',
    branch: 'WARRIOR',
    tier: 4,
    prerequisiteId: 'w3_unstoppable_momentum',
    description: 'Become a living monolith of physical and mental fortitude.',
    perkSummary: '+10 Strength, +5 Vitality, +50 Max HP, Crimson Hero Aura',
    statBonus: { strength: 10, vitality: 5, maxHp: 50 },
    icon: 'Award',
  },

  // --- SCHOLAR BRANCH ---
  {
    id: 's1_sharp_mind',
    name: 'Sharp Mind',
    branch: 'SCHOLAR',
    tier: 1,
    description: 'Hone analytical precision and mental clarity through deliberate learning.',
    perkSummary: '+3 Intellect, +20 Max Mana',
    statBonus: { intellect: 3, maxMana: 20 },
    icon: 'Brain',
  },
  {
    id: 's2_deep_work',
    name: 'Deep Work Mastery',
    branch: 'SCHOLAR',
    tier: 2,
    prerequisiteId: 's1_sharp_mind',
    description: 'Enter hyperfocus states effortlessly during Pomodoro focus sessions.',
    perkSummary: '+3 Intellect, +30% Focus Session XP',
    statBonus: { intellect: 3 },
    icon: 'Clock',
  },
  {
    id: 's3_curiosity',
    name: 'Insatiable Curiosity',
    branch: 'SCHOLAR',
    tier: 3,
    prerequisiteId: 's2_deep_work',
    description: 'Every completed objective uncovers deeper systemic knowledge.',
    perkSummary: '+5 Intellect, +10% XP on All Quests',
    statBonus: { intellect: 5, maxMana: 30 },
    icon: 'BookOpen',
  },
  {
    id: 's4_archmage_insight',
    name: 'Archmage Insight',
    branch: 'SCHOLAR',
    tier: 4,
    prerequisiteId: 's3_curiosity',
    description: 'Understand the fundamental architecture of habits and goals.',
    perkSummary: '+10 Intellect, +5 Spirit, +50 Max Mana, Azure Hero Aura',
    statBonus: { intellect: 10, spirit: 5, maxMana: 50 },
    icon: 'Sparkles',
  },

  // --- MYSTIC BRANCH ---
  {
    id: 'm1_inner_calm',
    name: 'Inner Calm',
    branch: 'MYSTIC',
    tier: 1,
    description: 'Cultivate balance between physical exertion and mental serenity.',
    perkSummary: '+2 Spirit, +2 Agility, +15 Max Mana',
    statBonus: { spirit: 2, agility: 2, maxMana: 15 },
    icon: 'Compass',
  },
  {
    id: 'm2_golden_aura',
    name: 'Midas Fortune',
    branch: 'MYSTIC',
    tier: 2,
    prerequisiteId: 'm1_inner_calm',
    description: 'Harmonious action attracts abundance in gold rewards.',
    perkSummary: '+3 Spirit, +20% Quest Gold Rewards',
    statBonus: { spirit: 3 },
    icon: 'Coins',
  },
  {
    id: 'm3_guild_beacon',
    name: 'Guild Beacon',
    branch: 'MYSTIC',
    tier: 3,
    prerequisiteId: 'm2_golden_aura',
    description: 'Inspire companions with an uplifting spiritual resonance.',
    perkSummary: '+4 Spirit, +4 Agility, +25% Party Boss Raid Damage',
    statBonus: { spirit: 4, agility: 4 },
    icon: 'Users',
  },
  {
    id: 'm4_transcendence',
    name: 'Cosmic Transcendence',
    branch: 'MYSTIC',
    tier: 4,
    prerequisiteId: 'm3_guild_beacon',
    description: 'Achieve total synergy across mind, body, and spirit.',
    perkSummary: '+5 All Attributes, +100 Max HP/Mana, Golden Celestial Glow',
    statBonus: {
      strength: 5,
      intellect: 5,
      vitality: 5,
      agility: 5,
      spirit: 5,
      maxHp: 100,
      maxMana: 100,
    },
    icon: 'Zap',
  },
];
