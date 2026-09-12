export type AvatarCategory = 'SUPERHERO' | 'CYBERPUNK' | 'FANTASY' | 'MYTHIC' | 'ANIME_RETRO';
export type AvatarRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type AvatarUnlockType = 'FREE' | 'LEVEL' | 'STREAK' | 'BOSS';

export interface GameAvatar {
  id: string;
  name: string;
  title: string;
  category: AvatarCategory;
  rarity: AvatarRarity;
  unlockType: AvatarUnlockType;
  unlockValue: number;
  unlockLabel: string;
  flavorText: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
}

export const GAME_AVATAR_CATEGORIES: { key: 'ALL' | AvatarCategory; label: string }[] = [
  { key: 'ALL', label: 'All Avatars' },
  { key: 'SUPERHERO', label: 'Superheroes' },
  { key: 'CYBERPUNK', label: 'Cyberpunk' },
  { key: 'FANTASY', label: 'Fantasy RPG' },
  { key: 'MYTHIC', label: 'Mythic & Gods' },
  { key: 'ANIME_RETRO', label: 'Anime & Retro' },
];

export const RARITY_CONFIG: Record<AvatarRarity, { label: string; border: string; bg: string; text: string }> = {
  COMMON: {
    label: 'Common',
    border: 'border-slate-500/40',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
  },
  RARE: {
    label: 'Rare',
    border: 'border-sky-500/50',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
  },
  EPIC: {
    label: 'Epic',
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
  LEGENDARY: {
    label: 'Legendary',
    border: 'border-amber-500/60',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
  },
  MYTHIC: {
    label: 'Mythic',
    border: 'border-rose-500/70',
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
  },
};

export const GAME_AVATARS: GameAvatar[] = [
  // ==========================================
  // SUPERHEROES
  // ==========================================
  {
    id: 'crimson-avenger',
    name: 'Crimson Avenger',
    title: 'The Scarlet Vanguard',
    category: 'SUPERHERO',
    rarity: 'COMMON',
    unlockType: 'FREE',
    unlockValue: 1,
    unlockLabel: 'Unlocked by Default',
    flavorText: 'An indomitable vigilante patrolling the neon metropolis with unbreakable willpower.',
    primaryColor: '#ef4444',
    accentColor: '#fca5a5',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-400',
  },
  {
    id: 'valkyrie-ascendant',
    name: 'Valkyrie Ascendant',
    title: 'Angel of the High Heavens',
    category: 'SUPERHERO',
    rarity: 'RARE',
    unlockType: 'LEVEL',
    unlockValue: 2,
    unlockLabel: 'Reach Level 2',
    flavorText: 'Lifts mortals above their struggles on wings forged of concentrated solar plasma.',
    primaryColor: '#f59e0b',
    accentColor: '#fde68a',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  {
    id: 'shadow-vigilante',
    name: 'Shadow Vigilante',
    title: 'Knight of the Dark Spire',
    category: 'SUPERHERO',
    rarity: 'EPIC',
    unlockType: 'LEVEL',
    unlockValue: 4,
    unlockLabel: 'Reach Level 4',
    flavorText: 'Strikes out from the obsidian abyss. Uses discipline and cold calculation to conquer chaos.',
    primaryColor: '#6366f1',
    accentColor: '#a5b4fc',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
    badgeText: 'text-indigo-400',
  },
  {
    id: 'solar-paragon',
    name: 'Solar Paragon',
    title: 'Champion of the Dawn',
    category: 'SUPERHERO',
    rarity: 'LEGENDARY',
    unlockType: 'LEVEL',
    unlockValue: 7,
    unlockLabel: 'Reach Level 7',
    flavorText: 'Harnesses raw thermonuclear stellar energy to defend humanity against insurmountable threats.',
    primaryColor: '#eab308',
    accentColor: '#fef08a',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    badgeBg: 'bg-yellow-500/10 border-yellow-500/30',
    badgeText: 'text-yellow-400',
  },

  // ==========================================
  // CYBERPUNK & TECH
  // ==========================================
  {
    id: 'cyber-ninja',
    name: 'Cyber Ninja',
    title: 'Ghost of Sector 7',
    category: 'CYBERPUNK',
    rarity: 'COMMON',
    unlockType: 'FREE',
    unlockValue: 1,
    unlockLabel: 'Unlocked by Default',
    flavorText: 'Armed with thermal katana blades and active optical camouflage for surgical focus.',
    primaryColor: '#06b6d4',
    accentColor: '#67e8f9',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-400',
  },
  {
    id: 'glitch-runner',
    name: 'Glitch Runner',
    title: 'Chrono-Shift Speedster',
    category: 'CYBERPUNK',
    rarity: 'RARE',
    unlockType: 'LEVEL',
    unlockValue: 3,
    unlockLabel: 'Reach Level 3',
    flavorText: 'Slips through anomalies in spacetime, turning delayed moments into lightning bursts of progress.',
    primaryColor: '#ec4899',
    accentColor: '#f472b6',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    badgeBg: 'bg-pink-500/10 border-pink-500/30',
    badgeText: 'text-pink-400',
  },
  {
    id: 'netrunner-ghost',
    name: 'Netrunner AI',
    title: 'The Cyber Architect',
    category: 'CYBERPUNK',
    rarity: 'EPIC',
    unlockType: 'STREAK',
    unlockValue: 3,
    unlockLabel: '3-Day Quest Streak',
    flavorText: 'An ascended cybernetic consciousness capable of rewriting mental pathways for hyperfocus.',
    primaryColor: '#10b981',
    accentColor: '#6ee7b7',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-400',
  },
  {
    id: 'mech-colossus',
    name: 'Mech Colossus',
    title: 'Heavy Siege Unit 01',
    category: 'CYBERPUNK',
    rarity: 'LEGENDARY',
    unlockType: 'BOSS',
    unlockValue: 1,
    unlockLabel: 'Defeat 1 World Boss',
    flavorText: 'A towering humanoid mechanized fortress built to pulverize monstrous procrastination.',
    primaryColor: '#3b82f6',
    accentColor: '#93c5fd',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-400',
  },

  // ==========================================
  // FANTASY RPG CLASSES
  // ==========================================
  {
    id: 'warrior',
    name: 'Iron Vanguard',
    title: 'Blade of the First Oath',
    category: 'FANTASY',
    rarity: 'COMMON',
    unlockType: 'FREE',
    unlockValue: 1,
    unlockLabel: 'Unlocked by Default',
    flavorText: 'A disciplined frontline warrior sworn to relentless habit formation and heavy physical mastery.',
    primaryColor: '#64748b',
    accentColor: '#cbd5e1',
    glowColor: 'rgba(100, 116, 139, 0.4)',
    badgeBg: 'bg-slate-500/10 border-slate-500/30',
    badgeText: 'text-slate-400',
  },
  {
    id: 'dragon-slayer',
    name: 'Dragon Slayer',
    title: 'Wyrm-Bane of the Peaks',
    category: 'FANTASY',
    rarity: 'RARE',
    unlockType: 'LEVEL',
    unlockValue: 3,
    unlockLabel: 'Reach Level 3',
    flavorText: 'Clad in elder wyrm scaleplate, immune to the burning fatigue of difficult tasks.',
    primaryColor: '#dc2626',
    accentColor: '#f87171',
    glowColor: 'rgba(220, 38, 38, 0.4)',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-400',
  },
  {
    id: 'arcane-sorcerer',
    name: 'Arcane Sorcerer',
    title: 'Weaver of Cosmic Runes',
    category: 'FANTASY',
    rarity: 'EPIC',
    unlockType: 'LEVEL',
    unlockValue: 5,
    unlockLabel: 'Reach Level 5',
    flavorText: 'Channels intellect and deep study into reality-bending spellcraft and wisdom.',
    primaryColor: '#8b5cf6',
    accentColor: '#c4b5fd',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-400',
  },
  {
    id: 'holy-paladin',
    name: 'Holy Paladin',
    title: 'Radiant Dawnkeeper',
    category: 'FANTASY',
    rarity: 'LEGENDARY',
    unlockType: 'STREAK',
    unlockValue: 5,
    unlockLabel: '5-Day Quest Streak',
    flavorText: 'Carries a sanctified silver shield that turns daily discipline into an unbreakable bastion.',
    primaryColor: '#f59e0b',
    accentColor: '#fde68a',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
  },

  // ==========================================
  // MYTHIC BEASTS & DEITIES
  // ==========================================
  {
    id: 'phoenix-empress',
    name: 'Phoenix Empress',
    title: 'The Eternal Rebirth',
    category: 'MYTHIC',
    rarity: 'EPIC',
    unlockType: 'LEVEL',
    unlockValue: 6,
    unlockLabel: 'Reach Level 6',
    flavorText: 'Rises stronger from missed habits and past mistakes, turning ashes into renewed glory.',
    primaryColor: '#f97316',
    accentColor: '#fdba74',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    badgeBg: 'bg-orange-500/10 border-orange-500/30',
    badgeText: 'text-orange-400',
  },
  {
    id: 'void-reaper',
    name: 'Void Reaper',
    title: 'Sovereign of the Nebula',
    category: 'MYTHIC',
    rarity: 'LEGENDARY',
    unlockType: 'LEVEL',
    unlockValue: 8,
    unlockLabel: 'Reach Level 8',
    flavorText: 'Controls the silent cosmic expanse between stars, eradicating distraction with single-minded void energy.',
    primaryColor: '#a855f7',
    accentColor: '#e9d5ff',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-400',
  },
  {
    id: 'celestial-griffin',
    name: 'Celestial Griffin',
    title: 'High Sovereign of the Peaks',
    category: 'MYTHIC',
    rarity: 'RARE',
    unlockType: 'LEVEL',
    unlockValue: 4,
    unlockLabel: 'Reach Level 4',
    flavorText: 'A noble mythological beast combining the keen eyesight of an eagle with the courage of a lion.',
    primaryColor: '#0ea5e9',
    accentColor: '#7dd3fc',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeText: 'text-sky-400',
  },
  {
    id: 'cosmic-titan',
    name: 'Cosmic Titan',
    title: 'The Galaxy Scribe',
    category: 'MYTHIC',
    rarity: 'MYTHIC',
    unlockType: 'LEVEL',
    unlockValue: 10,
    unlockLabel: 'Reach Level 10',
    flavorText: 'An ancient supreme godhead crowned by orbital rings and the blazing light of a thousand galaxies.',
    primaryColor: '#ec4899',
    accentColor: '#fb7185',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    badgeBg: 'bg-rose-500/20 border-rose-500/40',
    badgeText: 'text-rose-400',
  },

  // ==========================================
  // ANIME & RETRO GAMING LEGENDS
  // ==========================================
  {
    id: 'pixel-hero',
    name: 'Pixel Knight',
    title: 'Hero of the 8-Bit Quest',
    category: 'ANIME_RETRO',
    rarity: 'COMMON',
    unlockType: 'FREE',
    unlockValue: 1,
    unlockLabel: 'Unlocked by Default',
    flavorText: 'A nostalgic retro adventurer who knows that every epic victory begins with a single press of START.',
    primaryColor: '#22c55e',
    accentColor: '#86efac',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    badgeBg: 'bg-green-500/10 border-green-500/30',
    badgeText: 'text-green-400',
  },
  {
    id: 'kitsune-blade',
    name: 'Kitsune Blade',
    title: 'Spirit Fox of the Shinto Grove',
    category: 'ANIME_RETRO',
    rarity: 'RARE',
    unlockType: 'LEVEL',
    unlockValue: 3,
    unlockLabel: 'Reach Level 3',
    flavorText: 'Wields spectral blue spirit flames and agile fox cunning to dance around mental obstacles.',
    primaryColor: '#06b6d4',
    accentColor: '#a5f3fc',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-400',
  },
  {
    id: 'demon-hunter',
    name: 'Demon Hunter',
    title: 'Executioner of Calamity',
    category: 'ANIME_RETRO',
    rarity: 'EPIC',
    unlockType: 'BOSS',
    unlockValue: 2,
    unlockLabel: 'Defeat 2 World Bosses',
    flavorText: 'Bears a crimson oni mask and twin serrated blades tempered in the molten fires of perseverance.',
    primaryColor: '#e11d48',
    accentColor: '#fda4af',
    glowColor: 'rgba(225, 29, 72, 0.5)',
    badgeBg: 'bg-rose-500/10 border-rose-500/30',
    badgeText: 'text-rose-400',
  },
  {
    id: 'arcade-brawler',
    name: 'Arcade Brawler',
    title: 'Combo Breaker Master',
    category: 'ANIME_RETRO',
    rarity: 'LEGENDARY',
    unlockType: 'STREAK',
    unlockValue: 7,
    unlockLabel: '7-Day Quest Streak',
    flavorText: 'Never drops a combo. Chains daily habits into unstoppable fighting game juggernaut momentum.',
    primaryColor: '#f59e0b',
    accentColor: '#fde68a',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
  },
];

/**
 * Returns whether a given avatar is unlocked for a character
 */
export function isAvatarUnlocked(
  avatar: GameAvatar,
  character?: { level?: number; streak?: number; bossKills?: number } | null
): boolean {
  if (!character) return avatar.unlockType === 'FREE';

  switch (avatar.unlockType) {
    case 'FREE':
      return true;
    case 'LEVEL':
      return (character.level || 1) >= avatar.unlockValue;
    case 'STREAK':
      return (character.streak || 0) >= avatar.unlockValue;
    case 'BOSS':
      return (character.bossKills || 0) >= avatar.unlockValue;
    default:
      return true;
  }
}

/**
 * Find avatar by ID with fallback to starter
 */
export function getAvatarById(id?: string | null): GameAvatar {
  if (!id) return GAME_AVATARS[0];
  const found = GAME_AVATARS.find((a) => a.id.toLowerCase() === id.toLowerCase());
  return found || GAME_AVATARS[0];
}

/**
 * Frame tiers based on user level or prestige
 */
export type AvatarFrameTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'CYBER_PRISM';

export function getFrameTier(level: number = 1): AvatarFrameTier {
  if (level >= 10) return 'CYBER_PRISM';
  if (level >= 6) return 'DIAMOND';
  if (level >= 4) return 'GOLD';
  if (level >= 2) return 'SILVER';
  return 'BRONZE';
}
