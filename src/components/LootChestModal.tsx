'use client';

import React, { useState } from 'react';
import { Sparkles, Coins, Award, Shield, ArrowRight, PackageOpen, Crown } from 'lucide-react';
import { fireLevelUpConfetti } from '@/lib/confetti';
import { soundFx } from '@/lib/sound-fx';

interface LootChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defeatedBossName: string;
  nextBossName: string;
  lootChest: {
    gold: number;
    xp: number;
    itemReward?: string;
    titleReward?: string;
  };
}

export const LootChestModal: React.FC<LootChestModalProps> = ({
  isOpen,
  onClose,
  defeatedBossName,
  nextBossName,
  lootChest,
}) => {
  const [opened, setOpened] = useState(false);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    if (opened) return;
    setOpened(true);
    soundFx.playChestOpen();
    fireLevelUpConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-500/60 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Ambient Gold Halo */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl pointer-events-none" />

        {/* Victory Header */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-amber-300 mb-3">
          <Crown className="h-4 w-4" />
          <span>Raid Boss Vanquished!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          {defeatedBossName} Falls!
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Your unwavering consistency shattered the realm&apos;s procrastination beast.
        </p>

        {/* Chest Illustration */}
        <div className="my-6 flex flex-col items-center justify-center">
          {!opened ? (
            <div
              onClick={handleOpenChest}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              {/* Closed Treasure Chest */}
              <div className="relative h-32 w-36 sm:h-36 sm:w-40 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 90"
                  className="h-full w-full drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] transition group-hover:rotate-1"
                >
                  <defs>
                    <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#92400e" />
                      <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>
                    <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Base */}
                  <rect x="15" y="38" width="70" height="42" rx="4" fill="url(#chestWood)" stroke="#1e293b" strokeWidth="2" />
                  {/* Lid */}
                  <path d="M 12 38 Q 50 15 88 38 Z" fill="url(#chestWood)" stroke="#1e293b" strokeWidth="2" />
                  {/* Metal Bands */}
                  <rect x="25" y="38" width="8" height="42" fill="url(#chestGold)" />
                  <rect x="67" y="38" width="8" height="42" fill="url(#chestGold)" />
                  <path d="M 25 38 Q 30 20 33 38 Z" fill="url(#chestGold)" />
                  <path d="M 67 38 Q 70 20 75 38 Z" fill="url(#chestGold)" />
                  {/* Lock Keyhole */}
                  <rect x="44" y="36" width="12" height="14" rx="2" fill="url(#chestGold)" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="50" cy="42" r="2" fill="#0f172a" />
                  <polygon points="49,43 51,43 51.5,47 48.5,47" fill="#0f172a" />
                </svg>
              </div>
              <button
                type="button"
                className="mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/30 group-hover:brightness-110 transition"
              >
                ✦ Click to Unlock Spoils ✦
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-bounce-short">
              {/* Opened Chest with Glowing Core */}
              <div className="relative h-32 w-36 sm:h-36 sm:w-40 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 90"
                  className="h-full w-full drop-shadow-[0_0_35px_rgba(245,158,11,0.8)]"
                >
                  <defs>
                    <linearGradient id="chestWoodOpen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#92400e" />
                      <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>
                    <linearGradient id="chestGoldOpen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <radialGradient id="treasureGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                    </radialGradient>
                  </defs>
                  {/* Radiating Light */}
                  <circle cx="50" cy="40" r="28" fill="url(#treasureGlow)" />
                  {/* Base */}
                  <rect x="15" y="42" width="70" height="38" rx="4" fill="url(#chestWoodOpen)" stroke="#1e293b" strokeWidth="2" />
                  {/* Open Lid turned backwards */}
                  <path d="M 12 42 Q 50 2 88 42 Z" fill="url(#chestWoodOpen)" stroke="#1e293b" strokeWidth="2" transform="translate(0, -20)" />
                  {/* Gold bands */}
                  <rect x="25" y="42" width="8" height="38" fill="url(#chestGoldOpen)" />
                  <rect x="67" y="42" width="8" height="38" fill="url(#chestGoldOpen)" />
                  {/* Gold coins spilling */}
                  <circle cx="45" cy="44" r="5" fill="#fde047" stroke="#d97706" strokeWidth="1" />
                  <circle cx="54" cy="42" r="6" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
                  <circle cx="62" cy="45" r="5" fill="#fde047" stroke="#d97706" strokeWidth="1" />
                  <circle cx="38" cy="46" r="4" fill="#fde047" stroke="#d97706" strokeWidth="1" />
                </svg>
              </div>

              {/* Rewards List */}
              <div className="mt-4 w-full space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-center space-x-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-black text-amber-300">
                      +{lootChest.gold} Gold
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 rounded-xl border border-purple-500/40 bg-purple-500/10 p-3">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-black text-purple-300">
                      +{lootChest.xp} XP
                    </span>
                  </div>
                </div>

                {lootChest.itemReward && (
                  <div className="flex items-center justify-center space-x-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-2.5 text-xs text-cyan-300 font-bold">
                    <PackageOpen className="h-4 w-4" />
                    <span>Loot Drop: {lootChest.itemReward} (Added to Bag)</span>
                  </div>
                )}

                {lootChest.titleReward && (
                  <div className="flex items-center justify-center space-x-2 rounded-xl border border-amber-500/40 bg-amber-950/20 p-2 text-xs text-amber-300">
                    <Award className="h-4 w-4" />
                    <span>Title Earned: &ldquo;{lootChest.titleReward}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Next Boss Alert */}
        {nextBossName && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
            <span className="font-bold text-amber-400">Next Threat Emerges:</span> A stronger adversary,{' '}
            <strong className="text-slate-100">{nextBossName}</strong>, has awakened to challenge your discipline!
          </div>
        )}

        {/* Close / Proceed */}
        <button
          onClick={onClose}
          className="mt-5 w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
        >
          <span>{opened ? 'Claim Spoils & Continue' : 'Dismiss'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
