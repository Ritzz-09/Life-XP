'use client';

import React from 'react';
import {
  Shield,
  Heart,
  Zap,
  Dumbbell,
  Brain,
  Sparkles,
  Sword,
  Award,
  ChevronRight,
} from 'lucide-react';
import { getXpRequiredForNextLevel, ATTRIBUTE_METADATA } from '@/lib/rpg-engine';

interface HeroCardProps {
  user: {
    username: string;
    characterTitle?: string;
    avatar?: string;
  };
  character: {
    level: number;
    xp: number;
    currentHp: number;
    maxHp: number;
    currentMana: number;
    maxMana: number;
    strength: number;
    intellect: number;
    vitality: number;
    agility: number;
    spirit: number;
    equippedWeapon?: { name: string; rarity: string; statBonus: number; statType: string } | null;
    equippedArmor?: { name: string; rarity: string; statBonus: number; statType: string } | null;
    equippedBadge?: { name: string; rarity: string; statBonus: number; statType: string } | null;
  };
  onOpenShop?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  user,
  character,
  onOpenShop,
}) => {
  const nextLevelXp = getXpRequiredForNextLevel(character.level);
  const xpPercent = Math.min(100, Math.max(0, Math.round((character.xp / nextLevelXp) * 100)));
  const hpPercent = Math.min(100, Math.max(0, Math.round((character.currentHp / character.maxHp) * 100)));
  const manaPercent = Math.min(100, Math.max(0, Math.round((character.currentMana / character.maxMana) * 100)));

  const attributes = [
    { key: 'STR', label: 'Strength', val: character.strength, icon: Dumbbell, color: 'text-red-400', bg: 'bg-red-500' },
    { key: 'INT', label: 'Intellect', val: character.intellect, icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500' },
    { key: 'VIT', label: 'Vitality', val: character.vitality, icon: Heart, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { key: 'AGI', label: 'Agility', val: character.agility, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500' },
    { key: 'SPR', label: 'Spirit', val: character.spirit, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500' },
  ];

  const maxStatVal = Math.max(25, ...attributes.map((a) => a.val));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-sm">
      {/* Hero Header */}
      <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
        {/* Avatar with level badge */}
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-amber-950/80 border-2 border-amber-500/40 shadow-lg shadow-amber-500/10">
            <span className="text-2xl font-black text-amber-300">
              {user.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="absolute -bottom-2 -right-1 flex items-center justify-center rounded-md border border-amber-500/50 bg-amber-500 px-1.5 py-0.5 text-[10px] font-black text-slate-950 shadow">
            LVL {character.level}
          </span>
        </div>

        {/* Hero Identity */}
        <div className="flex-1 min-w-0">
          <h2 className="truncate text-base font-bold text-slate-100 sm:text-lg">
            {user.username}
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            {user.characterTitle || 'Realm Adventurer'}
          </p>
          <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-400">
            <span>Tier: {character.level >= 5 ? 'Veteran' : 'Apprentice'}</span>
            <span>•</span>
            <span className="text-emerald-400">Battle Ready</span>
          </div>
        </div>
      </div>

      {/* Vitals: HP, Mana, XP */}
      <div className="mt-4 space-y-3">
        {/* Health (HP) */}
        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center text-rose-400">
              <Heart className="mr-1 h-3.5 w-3.5 fill-rose-500/30" /> HP
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {character.currentHp} / {character.maxHp}
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Mana (MP) */}
        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center text-cyan-400">
              <Zap className="mr-1 h-3.5 w-3.5 fill-cyan-500/30" /> Focus / MP
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {character.currentMana} / {character.maxMana}
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>

        {/* Experience (XP) */}
        <div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center text-amber-300">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Experience (XP)
            </span>
            <span className="text-amber-200/90 font-mono text-[11px]">
              {character.xp} / {nextLevelXp} XP ({xpPercent}%)
            </span>
          </div>
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-950 border border-amber-900/40 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-700 shadow-sm shadow-amber-400/50"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-slate-500">
            Non-linear curve: ⌊100 × L^1.5⌋
          </p>
        </div>
      </div>

      {/* RPG Attributes Grid */}
      <div className="mt-5 border-t border-slate-800 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Hero Attributes
        </h3>
        <div className="space-y-2">
          {attributes.map((attr) => {
            const Icon = attr.icon;
            const barWidth = Math.min(100, Math.round((attr.val / maxStatVal) * 100));
            return (
              <div key={attr.key} className="group">
                <div className="flex items-center justify-between text-xs">
                  <span className={`flex items-center font-medium ${attr.color}`}>
                    <Icon className="mr-1.5 h-3.5 w-3.5" />
                    {attr.label}
                  </span>
                  <span className="font-bold text-slate-200 font-mono">
                    {attr.val} pts
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                  <div
                    className={`h-full rounded-full ${attr.bg} transition-all duration-500 group-hover:brightness-125`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Slots */}
      <div className="mt-5 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Equipped Gear
          </h3>
          {onOpenShop && (
            <button
              onClick={onOpenShop}
              className="flex items-center text-[11px] text-amber-400 hover:text-amber-300 transition"
            >
              <span>Armory</span>
              <ChevronRight className="h-3 w-3 ml-0.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Weapon */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-center">
            <Sword className="h-4 w-4 text-amber-400 mb-1" />
            <span className="text-[10px] font-medium text-slate-300 truncate w-full">
              {character.equippedWeapon ? character.equippedWeapon.name : 'No Weapon'}
            </span>
            <span className="text-[9px] text-slate-500">
              {character.equippedWeapon ? `+${character.equippedWeapon.statBonus} ${character.equippedWeapon.statType}` : 'Empty'}
            </span>
          </div>

          {/* Armor */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-center">
            <Shield className="h-4 w-4 text-emerald-400 mb-1" />
            <span className="text-[10px] font-medium text-slate-300 truncate w-full">
              {character.equippedArmor ? character.equippedArmor.name : 'No Armor'}
            </span>
            <span className="text-[9px] text-slate-500">
              {character.equippedArmor ? `+${character.equippedArmor.statBonus} ${character.equippedArmor.statType}` : 'Empty'}
            </span>
          </div>

          {/* Badge */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 p-2 text-center">
            <Award className="h-4 w-4 text-purple-400 mb-1" />
            <span className="text-[10px] font-medium text-slate-300 truncate w-full">
              {character.equippedBadge ? character.equippedBadge.name : 'No Badge'}
            </span>
            <span className="text-[9px] text-slate-500">
              {character.equippedBadge ? 'Active Flair' : 'Empty'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
