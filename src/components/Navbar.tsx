'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Flame, Volume2, VolumeX, LogOut, Plus, Shield, Sparkles } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

interface NavbarProps {
  user: {
    username: string;
    characterTitle?: string;
    avatar?: string;
  } | null;
  character: {
    gold: number;
    streak: number;
    level: number;
  } | null;
  onOpenCreateQuest: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  character,
  onOpenCreateQuest,
  onLogout,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(soundFx.enabled);
  }, []);

  const handleToggleSound = () => {
    const next = soundFx.toggleSound();
    setSoundEnabled(next);
    if (next) soundFx.playCoin();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
            <Shield className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-lg">
                LIFE RPG
              </span>
              <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 sm:inline-block">
                SEASON 1
              </span>
            </div>
            {user && (
              <p className="text-xs text-slate-400">
                {user.username} • <span className="text-amber-400/90">{user.characterTitle || 'Adventurer'}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Stats */}
        {user && character && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-orange-400 shadow-inner"
              title={`${character.streak} Day Streak! +${Math.min(50, (character.streak - 1) * 5)}% bonus XP/Gold`}
            >
              <Flame className="h-4 w-4 animate-pulse text-orange-400 fill-orange-400/40" />
              <span className="font-bold text-xs sm:text-sm tracking-wide">{character.streak}d</span>
            </div>

            {/* Gold Counter */}
            <div
              className="flex items-center space-x-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300 shadow-inner"
              title="Your Realm Gold. Spend it at the Merchant Shop!"
            >
              <Coins className="h-4 w-4 text-amber-400 fill-amber-400/30" />
              <span className="font-bold text-xs sm:text-sm tracking-wide">{character.gold}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition hover:border-slate-700 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-amber-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>

            {/* Quick Add Quest Button (Desktop) */}
            <button
              onClick={onOpenCreateQuest}
              className="hidden sm:inline-flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-amber-500/25 transition hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Plus className="h-4 w-4" />
              <span>Forge Quest</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition hover:border-red-900/50 hover:bg-red-950/30 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/50"
              title="Leave Realm (Logout)"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
