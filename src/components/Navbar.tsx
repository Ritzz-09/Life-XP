'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
  Flame,
  Volume2,
  VolumeX,
  LogOut,
  Plus,
  Shield,
  Sparkles,
  Sun,
  Moon,
  Terminal,
} from 'lucide-react';
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
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCreateQuest: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  character,
  theme,
  onToggleTheme,
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400/40">
            <Terminal className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-black tracking-wider text-transparent bg-clip-text text-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-400'
                  : 'bg-gradient-to-r from-cyan-700 via-sky-700 to-slate-950'
              }`}>
                LIFE RPG
              </span>
              <span className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold sm:inline-block ${
                theme === 'dark'
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-cyan-600/30 bg-cyan-50 text-cyan-800'
              }`}>
                OSINT_v2.1
              </span>
            </div>
            {user && (
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {user.username} • <span className={`font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}>{user.characterTitle || 'Operative'}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Stats */}
        {user && character && (
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Streak Counter */}
            <div
              className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 shadow-inner ${
                theme === 'dark'
                  ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                  : 'border-orange-300 bg-orange-50 text-orange-700'
              }`}
              title={`${character.streak} Day Streak! +${Math.min(50, (character.streak - 1) * 5)}% bonus XP/Gold`}
            >
              <Flame className="h-4 w-4 animate-pulse text-orange-500 fill-orange-400/40" />
              <span className="font-bold text-xs sm:text-sm tracking-wide">{character.streak}d</span>
            </div>

            {/* Gold Counter */}
            <div
              className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 shadow-inner ${
                theme === 'dark'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-amber-300 bg-amber-50 text-amber-800'
              }`}
              title="Your Realm Gold. Spend it at the Merchant Shop!"
            >
              <Coins className="h-4 w-4 text-amber-500 fill-amber-400/30" />
              <span className="font-bold text-xs sm:text-sm tracking-wide">{character.gold}</span>
            </div>

            {/* Theme Switcher Button */}
            <button
              onClick={() => {
                onToggleTheme();
                soundFx.playEquip();
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-800 shadow-sm'
              }`}
              title={theme === 'dark' ? 'Switch to Clean Daylight Theme' : 'Switch to Cyberpunk Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-cyan-600" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 shadow-sm'
              }`}
              title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? (
                <Volume2 className={`h-4 w-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {/* Quick Add Quest Button (Desktop) */}
            <button
              onClick={onOpenCreateQuest}
              className="hidden sm:inline-flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-cyan-500/25 transition hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
