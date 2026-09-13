'use client';

import React, { useState, useEffect } from 'react';
import {
  Swords,
  Shield,
  ShoppingBag,
  Skull,
  Plus,
  Sparkles,
  X,
  GitBranch,
  Trophy,
  Users,
  Clock,
  Share2,
  Award,
  UserCog,
  Music,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  LogOut,
  Flame,
  Coins,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';
import { GamerAvatar } from './GamerAvatar';

interface MobileNavProps {
  activeTab: 'QUESTS' | 'HERO' | 'SHOP' | 'RAID';
  onChangeTab: (tab: 'QUESTS' | 'HERO' | 'SHOP' | 'RAID') => void;
  onOpenCreateQuest: () => void;
  onOpenAutoForge?: () => void;
  onOpenFocusTimer?: () => void;
  onOpenSkills?: () => void;
  onOpenAchievements?: () => void;
  onOpenParty?: () => void;
  onOpenShareHero?: () => void;
  onOpenAvatarVault?: () => void;
  onOpenEditProfile?: () => void;
  skillPoints?: number;
  readyAchievementsCount?: number;
  user?: {
    username: string;
    characterTitle?: string;
    avatar?: string;
  } | null;
  character?: {
    level: number;
    gold: number;
    streak: number;
    gender?: string;
    bossKills?: number;
  } | null;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onLogout?: () => void;
  isOpenHubExternal?: boolean;
  onCloseHubExternal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenCreateQuest,
  onOpenAutoForge,
  onOpenFocusTimer,
  onOpenSkills,
  onOpenAchievements,
  onOpenParty,
  onOpenShareHero,
  onOpenAvatarVault,
  onOpenEditProfile,
  skillPoints = 0,
  readyAchievementsCount = 0,
  user,
  character,
  theme = 'dark',
  onToggleTheme,
  onLogout,
  isOpenHubExternal = false,
  onCloseHubExternal,
}) => {
  const [hubOpen, setHubOpen] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);

  // Sync external open state
  useEffect(() => {
    if (isOpenHubExternal) {
      setHubOpen(true);
    }
  }, [isOpenHubExternal]);

  useEffect(() => {
    setSoundEnabled(soundFx.enabled);
    setVolume(soundFx.volume);
    setIsBgmOn(soundFx.isBgmPlaying());
  }, [hubOpen]);

  const handleCloseHub = () => {
    setHubOpen(false);
    if (onCloseHubExternal) onCloseHubExternal();
  };

  const handleToggleBgm = () => {
    const active = soundFx.toggleBgm();
    setIsBgmOn(active);
  };

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

  const totalBadges = skillPoints + readyAchievementsCount;

  return (
    <>
      {/* Mobile Bottom Dock Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-xl pb-safe shadow-2xl"
      >
        <div className="flex h-16 items-center justify-around px-1 relative">
          {/* Quests Tab */}
          <button
            onClick={() => {
              onChangeTab('QUESTS');
              soundFx.playEquip();
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
              activeTab === 'QUESTS' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className={`h-5 w-5 ${activeTab === 'QUESTS' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-1">Quests</span>
          </button>

          {/* Hero Tab */}
          <button
            onClick={() => {
              onChangeTab('HERO');
              soundFx.playEquip();
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
              activeTab === 'HERO' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className={`h-5 w-5 ${activeTab === 'HERO' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-1">Hero</span>
          </button>

          {/* Floating Centered Action Button with Quick Dial */}
          <div className="-mt-6 flex items-center justify-center">
            <button
              onClick={() => {
                setPlusMenuOpen(!plusMenuOpen);
                soundFx.playEquip();
              }}
              aria-label="Action Menu"
              className={`flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/40 ring-4 ring-slate-950 transition-transform active:scale-95 ${
                plusMenuOpen ? 'rotate-45' : ''
              }`}
            >
              <Plus className="h-6 w-6 stroke-[3]" />
            </button>
          </div>

          {/* Armory Shop Tab */}
          <button
            onClick={() => {
              onChangeTab('SHOP');
              soundFx.playEquip();
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
              activeTab === 'SHOP' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className={`h-5 w-5 ${activeTab === 'SHOP' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-1">Armory</span>
          </button>

          {/* Realm Hub & Modes Drawer Tab */}
          <button
            onClick={() => {
              setHubOpen(true);
              soundFx.playEquip();
            }}
            className="relative flex flex-col items-center justify-center w-14 py-1 text-slate-400 hover:text-amber-300 transition-colors"
          >
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-[10px] tracking-tight mt-1">Hub</span>
            {totalBadges > 0 && (
              <span className="absolute top-0.5 right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-[9px] animate-pulse">
                {totalBadges}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Quick Action Dial Popover Menu when (+) is pressed */}
      {plusMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setPlusMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm mx-4 mb-20 rounded-3xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl animate-slide-up-sheet backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center">
                <Zap className="mr-1.5 h-3.5 w-3.5" /> Quick Actions
              </span>
              <button
                onClick={() => setPlusMenuOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {/* Custom Quest */}
              <button
                onClick={() => {
                  setPlusMenuOpen(false);
                  onOpenCreateQuest();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 transition active:scale-95"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Swords className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-100">Forge Custom Quest</p>
                    <p className="text-[10px] text-slate-400">Dailies, habits, and tasks</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>

              {/* 1-Click Auto Forge */}
              {onOpenAutoForge && (
                <button
                  onClick={() => {
                    setPlusMenuOpen(false);
                    onOpenAutoForge();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition active:scale-95"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-cyan-300">1-Click Auto-Forge</p>
                      <p className="text-[10px] text-slate-400">Engineer, Athlete & Scholar routines</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              )}

              {/* Focus Sprint */}
              {onOpenFocusTimer && (
                <button
                  onClick={() => {
                    setPlusMenuOpen(false);
                    onOpenFocusTimer();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 transition active:scale-95"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-rose-300">Pomodoro Focus Sprint</p>
                      <p className="text-[10px] text-slate-400">25m deep work session (+20 bonus XP)</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Realm Hub Full Mobile Drawer Bottom Sheet */}
      {hubOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={handleCloseHub}
        >
          <div
            className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-[32px] border-t border-slate-700 bg-slate-900 shadow-2xl overflow-hidden animate-slide-up-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle Bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-slate-700" />
            </div>

            {/* Header: Hero Snapshot & Close Button */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                {user && character && (
                  <GamerAvatar
                    avatarId={user.avatar}
                    size="sm"
                    level={character.level}
                    showFrame={true}
                  />
                )}
                <div>
                  <h3 className="text-sm font-black text-white flex items-center">
                    {user?.username || 'Hero'}{' '}
                    <span className="ml-1.5 text-xs text-amber-400 font-normal">
                      • Lv. {character?.level || 1}
                    </span>
                  </h3>
                  <p className="text-[11px] text-cyan-400 font-medium">
                    {user?.characterTitle || 'Adventurer'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {character && (
                  <div className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold">
                    <span className="flex items-center text-orange-400">
                      <Flame className="mr-0.5 h-3 w-3 fill-orange-400/40" />
                      {character.streak}d
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="flex items-center text-amber-300">
                      <Coins className="mr-0.5 h-3 w-3 fill-amber-400/30" />
                      {character.gold}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleCloseHub}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content: Realm Modes Grid */}
            <div className="p-4 overflow-y-auto space-y-4 max-h-[calc(92vh-150px)]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                  RPG Systems & Expansions
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* World Boss Raid */}
                  <button
                    onClick={() => {
                      handleCloseHub();
                      onChangeTab('RAID');
                      soundFx.playEquip();
                    }}
                    className="flex flex-col text-left p-3 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 to-slate-950 hover:border-rose-400 transition active:scale-95"
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                        <Skull className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">Live</span>
                    </div>
                    <span className="text-xs font-bold text-slate-100">Boss Raid</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Epic boss combat</span>
                  </button>

                  {/* Talents & Masteries */}
                  {onOpenSkills && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenSkills();
                        soundFx.playEquip();
                      }}
                      className="relative flex flex-col text-left p-3 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-slate-950 hover:border-purple-400 transition active:scale-95"
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                          <GitBranch className="h-4 w-4" />
                        </div>
                        {skillPoints > 0 && (
                          <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-[10px] animate-pulse">
                            +{skillPoints} SP
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-100">Talent Tree</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Passive RPG masteries</span>
                    </button>
                  )}

                  {/* Trophy Hall */}
                  {onOpenAchievements && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenAchievements();
                        soundFx.playEquip();
                      }}
                      className="relative flex flex-col text-left p-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-slate-950 hover:border-amber-400 transition active:scale-95"
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                          <Trophy className="h-4 w-4" />
                        </div>
                        {readyAchievementsCount > 0 && (
                          <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] animate-pulse">
                            {readyAchievementsCount} Claim
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-100">Trophy Hall</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Milestones & gold rewards</span>
                    </button>
                  )}

                  {/* Guild Fellowship */}
                  {onOpenParty && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenParty();
                        soundFx.playEquip();
                      }}
                      className="flex flex-col text-left p-3 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-950 hover:border-indigo-400 transition active:scale-95"
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] text-indigo-400 font-bold">Co-Op</span>
                      </div>
                      <span className="text-xs font-bold text-slate-100">Guild Party</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Raid with friends</span>
                    </button>
                  )}

                  {/* Pomodoro Focus Sprint */}
                  {onOpenFocusTimer && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenFocusTimer();
                        soundFx.playEquip();
                      }}
                      className="flex flex-col text-left p-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-950 hover:border-emerald-400 transition active:scale-95"
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">+20 XP</span>
                      </div>
                      <span className="text-xs font-bold text-slate-100">Focus Sprint</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">25m deep work chamber</span>
                    </button>
                  )}

                  {/* Auto-Forge Daily Routine */}
                  {onOpenAutoForge && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenAutoForge();
                        soundFx.playEquip();
                      }}
                      className="flex flex-col text-left p-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-slate-950 hover:border-cyan-400 transition active:scale-95"
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] text-cyan-400 font-bold">1-Click</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-300">Auto-Forge</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Pre-built quest sets</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Character & Customization Tools */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Hero Customizer & Tools
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {onOpenShareHero && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenShareHero();
                        soundFx.playEquip();
                      }}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center hover:bg-slate-800/60 transition active:scale-95"
                    >
                      <Share2 className="h-4 w-4 text-purple-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-200">Share Card</span>
                    </button>
                  )}

                  {onOpenAvatarVault && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenAvatarVault();
                        soundFx.playEquip();
                      }}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center hover:bg-slate-800/60 transition active:scale-95"
                    >
                      <Award className="h-4 w-4 text-amber-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-200">Avatars</span>
                    </button>
                  )}

                  {onOpenEditProfile && (
                    <button
                      onClick={() => {
                        handleCloseHub();
                        onOpenEditProfile();
                        soundFx.playEquip();
                      }}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center hover:bg-slate-800/60 transition active:scale-95"
                    >
                      <UserCog className="h-4 w-4 text-cyan-400 mb-1" />
                      <span className="text-[11px] font-bold text-slate-200">Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Audio & Ambient Music Deck */}
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center">
                    <Music className={`mr-2 h-4 w-4 ${isBgmOn ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
                    Lo-Fi Focus Ambience
                  </span>
                  <button
                    onClick={handleToggleBgm}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isBgmOn
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isBgmOn ? 'Playing 🎵' : 'Play Music'}
                  </button>
                </div>

                <div className="flex items-center space-x-3 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={handleToggleSound}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {soundEnabled && volume > 0 ? (
                      <Volume2 className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundEnabled ? volume : 0}
                      onChange={handleVolumeChange}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 w-8 text-right">
                    {soundEnabled ? `${Math.round(volume * 100)}%` : '0%'}
                  </span>
                </div>
              </div>

              {/* System Footer Controls */}
              <div className="flex items-center justify-between pt-1">
                {onToggleTheme && (
                  <button
                    onClick={() => {
                      onToggleTheme();
                      soundFx.playEquip();
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white active:scale-95 transition"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-4 w-4 text-amber-400" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-cyan-400" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-950/30 border border-red-900/50 text-xs font-bold text-red-400 hover:bg-red-900/40 active:scale-95 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
