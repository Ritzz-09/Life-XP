'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Trophy,
  Users,
  Clock,
  GitBranch,
  Swords,
  Music,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';
import { CharacterVisual } from './CharacterVisual';
import { GamerAvatar } from './GamerAvatar';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  user: {
    id?: string;
    username: string;
    characterTitle?: string;
    avatar?: string;
  } | null;
  character: {
    gold: number;
    streak: number;
    level: number;
    gender?: string;
    bossKills?: number;
  } | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCreateQuest: () => void;
  onOpenInspect?: () => void;
  onOpenAvatarVault?: () => void;
  onOpenEditProfile?: () => void;
  onOpenSkills?: () => void;
  onOpenAchievements?: () => void;
  onOpenParty?: () => void;
  onOpenFocusTimer?: () => void;
  onOpenAutoForge?: () => void;
  onOpenMobileHub?: () => void;
  skillPoints?: number;
  readyAchievementsCount?: number;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  character,
  theme,
  onToggleTheme,
  onOpenCreateQuest,
  onOpenInspect,
  onOpenAvatarVault,
  onOpenEditProfile,
  onOpenSkills,
  onOpenAchievements,
  onOpenParty,
  onOpenFocusTimer,
  onOpenAutoForge,
  onOpenMobileHub,
  skillPoints = 0,
  readyAchievementsCount = 0,
  onLogout,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSoundEnabled(soundFx.enabled);
    setVolume(soundFx.volume);

    const handleClickOutside = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSound = () => {
    const next = soundFx.toggleSound();
    setSoundEnabled(next);
    if (next) soundFx.playCoin();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundFx.setVolume(val);
    if (!soundEnabled && val > 0) {
      soundFx.setMuted(false);
      setSoundEnabled(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          {user && character ? (
            <div
              onClick={onOpenAvatarVault || onOpenInspect}
              className="cursor-pointer transition hover:scale-105 active:scale-95"
              title="Game Avatar Vault — Click to change Profile Picture"
            >
              <GamerAvatar
                avatarId={user.avatar}
                size="md"
                level={character.level}
                showFrame={true}
                showOnlineDot={true}
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400/40">
              <Terminal className="h-5 w-5 text-slate-950" />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <BrandLogo size="sm" />
              <span
                className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase sm:inline-block ${
                  theme === 'dark'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-amber-600/20 bg-amber-50 text-amber-800'
                }`}
              >
                Season 1
              </span>
            </div>
            {user && (
              <button
                onClick={onOpenEditProfile || onOpenInspect}
                className="text-left group flex items-center space-x-1"
                title="Click to Edit Hero Profile"
              >
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-900'} transition`}>
                  {user.username} •{' '}
                  <span
                    className={`font-semibold ${
                      theme === 'dark' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-700'
                    }`}
                  >
                    {user.characterTitle || 'Adventurer'}
                  </span>
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Center: Clean Game Mode Tabs */}
        {user && character && (
          <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/90 border border-slate-800/80 p-1 shadow-inner">
            {onOpenSkills && (
              <button
                onClick={onOpenSkills}
                className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
                title="Talent Tree & Masteries"
              >
                <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                <span>Talents</span>
                {skillPoints > 0 && (
                  <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    {skillPoints}
                  </span>
                )}
              </button>
            )}

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
                title="Trophy Hall & Milestones"
              >
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>Trophies</span>
                {readyAchievementsCount > 0 && (
                  <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] animate-pulse">
                    {readyAchievementsCount}
                  </span>
                )}
              </button>
            )}

            {onOpenParty && (
              <button
                onClick={onOpenParty}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
                title="Co-Op Guild Fellowship"
              >
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span>Guild Party</span>
              </button>
            )}

            {onOpenFocusTimer && (
              <button
                onClick={onOpenFocusTimer}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
                title="Pomodoro Focus Sprint (+20 XP Bonus)"
              >
                <Clock className="h-3.5 w-3.5 text-rose-400" />
                <span>Focus Sprint</span>
              </button>
            )}

            {onOpenAutoForge && (
              <button
                onClick={onOpenAutoForge}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
                title="1-Click Auto-Forge Daily Routine"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Auto-Forge</span>
              </button>
            )}
          </nav>
        )}

        {/* Right: Currency Counters, Actions & System Utilities */}
        {user && character && (
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Mobile Hub Trigger Pill with Badge */}
            {onOpenMobileHub && (
              <button
                onClick={onOpenMobileHub}
                className="relative md:hidden flex items-center space-x-1 rounded-xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition active:scale-95"
                title="Open Realm Expansions & Hub"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden xs:inline">Hub</span>
                {(skillPoints > 0 || readyAchievementsCount > 0) && (
                  <span className="flex h-3.5 min-w-[14px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-[9px] animate-pulse">
                    {skillPoints + readyAchievementsCount}
                  </span>
                )}
              </button>
            )}

            {/* Streak & Gold Counters Pill */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl bg-slate-900/80 border border-slate-800/80 px-2 sm:px-2.5 py-1 text-xs">
              <div
                className="flex items-center space-x-1 text-orange-400 font-bold"
                title={`${character.streak} Day Streak!`}
              >
                <Flame className="h-3.5 w-3.5 fill-orange-400/40 text-orange-500 animate-pulse" />
                <span>{character.streak}d</span>
              </div>
              <span className="text-slate-700">|</span>
              <div
                className="flex items-center space-x-1 text-amber-300 font-bold"
                title="Gold Balance"
              >
                <Coins className="h-3.5 w-3.5 fill-amber-400/30 text-amber-400" />
                <span>{character.gold}</span>
              </div>
            </div>

            {/* Quick Create Quest Button (Desktop/Tablet) */}
            <button
              onClick={onOpenCreateQuest}
              className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>New Quest</span>
            </button>

            {/* Utility Cluster: Audio, Theme, Logout */}
            <div className="flex items-center space-x-1 pl-1 border-l border-slate-800/80 shrink-0">
              {/* Audio Settings (Desktop/Tablet) */}
              <div className="hidden sm:block relative" ref={volumeRef}>
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                    theme === 'dark'
                      ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                  title="Audio Settings"
                >
                  {soundEnabled && volume > 0 ? (
                    <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {showVolumeSlider && (
                  <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-2xl backdrop-blur-md animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Volume</span>
                      <span>{soundEnabled ? `${Math.round(volume * 100)}%` : 'Muted'}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundEnabled ? volume : 0}
                      onChange={handleVolumeChange}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <button
                      onClick={handleToggleSound}
                      className="mt-2.5 w-full rounded-lg border border-slate-800 bg-slate-900/80 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 transition"
                    >
                      {soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
                    </button>
                  </div>
                )}
              </div>

              {/* Ambient Lo-Fi Focus Music Toggle (Desktop/Tablet) */}
              <button
                onClick={() => {
                  const active = soundFx.toggleBgm();
                  setIsBgmOn(active);
                }}
                className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                  isBgmOn
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300 ring-1 ring-purple-400 shadow-sm'
                    : theme === 'dark'
                    ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-purple-300'
                    : 'border-slate-300 bg-white text-slate-700 hover:text-purple-600'
                }`}
                title={isBgmOn ? 'Stop Ambient Focus Music' : 'Play Ambient Lo-Fi Focus Music'}
              >
                <Music className={`h-3.5 w-3.5 ${isBgmOn ? 'text-purple-400 animate-pulse' : ''}`} />
              </button>

              {/* Theme Toggle (Desktop/Tablet) */}
              <button
                onClick={() => {
                  onToggleTheme();
                  soundFx.playEquip();
                }}
                className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-cyan-600" />
                )}
              </button>

              {/* Logout (Visible on all screens including mobile) */}
              <button
                onClick={onLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-900/40 bg-red-950/20 text-red-400 hover:border-red-800 hover:bg-red-900/40 transition active:scale-95 shrink-0"
                title="Sign Out / Logout"
              >
                <LogOut className="h-3.5 w-3.5 text-red-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
