'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroCard } from '@/components/HeroCard';
import { QuestCard, QuestItem } from '@/components/QuestCard';
import { CreateQuestModal } from '@/components/CreateQuestModal';
import { LevelUpModal } from '@/components/LevelUpModal';
import { ShopView } from '@/components/ShopView';
import { BossCard } from '@/components/BossCard';
import { StreakHeatmap } from '@/components/StreakHeatmap';
import { MobileNav } from '@/components/MobileNav';
import { AuthView } from '@/components/AuthView';
import { CharacterInspectModal } from '@/components/CharacterInspectModal';
import { LootChestModal } from '@/components/LootChestModal';
import { DawnReportModal } from '@/components/DawnReportModal';
import { AvatarStackSelectorModal } from '@/components/AvatarStackSelectorModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { FocusTimerModal } from '@/components/FocusTimerModal';
import { SkillTreeModal } from '@/components/SkillTreeModal';
import { AchievementsModal } from '@/components/AchievementsModal';
import { PartyHub } from '@/components/PartyHub';
import { LifeRadarChart } from '@/components/LifeRadarChart';
import { AutoForgeModal } from '@/components/AutoForgeModal';
import { ShareHeroModal } from '@/components/ShareHeroModal';
import { QuestCompletionPopup, QuestCompletionNotice } from '@/components/QuestCompletionPopup';
import {
  Swords,
  Plus,
  Filter,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Flame,
  Search,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [character, setCharacter] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [quests, setQuests] = useState<QuestItem[]>([]);

  // Filters & State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'QUESTS' | 'HERO' | 'SHOP' | 'RAID'>('QUESTS');
  const [desktopView, setDesktopView] = useState<'BOARD' | 'SHOP'>('BOARD');
  const [questTypeFilter, setQuestTypeFilter] = useState('ALL');
  const [attributeFilter, setAttributeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize theme on client
  useEffect(() => {
    const saved = localStorage.getItem('liferpg_theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('liferpg_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Modals
  const [createQuestOpen, setCreateQuestOpen] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; level: number }>({
    isOpen: false,
    level: 1,
  });
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [avatarVaultOpen, setAvatarVaultOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [dawnReport, setDawnReport] = useState<{
    isOpen: boolean;
    missedCount: number;
    damageTaken: number;
    currentHp: number;
    maxHp: number;
  }>({
    isOpen: false,
    missedCount: 0,
    damageTaken: 0,
    currentHp: 100,
    maxHp: 100,
  });
  const [lootChestModal, setLootChestModal] = useState<{
    isOpen: boolean;
    defeatedBossName: string;
    nextBossName: string;
    lootChest: any;
  }>({
    isOpen: false,
    defeatedBossName: '',
    nextBossName: '',
    lootChest: null,
  });
  const [lastBossDamage, setLastBossDamage] = useState<{ damage: number; isCrit?: boolean; timestamp: number } | null>(null);

  // New Mega Feature Modals
  const [focusModal, setFocusModal] = useState<{ isOpen: boolean; quest: QuestItem | null }>({
    isOpen: false,
    quest: null,
  });
  const [skillTreeOpen, setSkillTreeOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [partyHubOpen, setPartyHubOpen] = useState(false);
  const [autoForgeOpen, setAutoForgeOpen] = useState(false);
  const [shareHeroOpen, setShareHeroOpen] = useState(false);
  const [mobileHubOpen, setMobileHubOpen] = useState(false);
  const [questCompletionNotice, setQuestCompletionNotice] = useState<QuestCompletionNotice | null>(null);
  const [readyAchievementsCount, setReadyAchievementsCount] = useState(0);

  const fetchAchievementsBadge = useCallback(async () => {
    try {
      const res = await fetch('/api/achievements');
      if (res.ok) {
        const data = await res.json();
        setReadyAchievementsCount(data.readyToClaimCount || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const checkDailyReset = useCallback(async () => {
    try {
      const res = await fetch('/api/quests/daily-reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.hasReport) {
        if (data.damageTaken > 0) {
          soundFx.playHurt();
        }
        setDawnReport({
          isOpen: true,
          missedCount: data.missedCount,
          damageTaken: data.damageTaken,
          currentHp: data.currentHp,
          maxHp: data.maxHp,
        });
      }
    } catch (err) {
      console.error('Error during daily reset check:', err);
    }
  }, []);

  const fetchSessionAndData = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setUser(data.user);
        setCharacter(data.character);
        setRecentLogs(data.recentLogs || []);

        // Fetch user's quests
        const questsRes = await fetch('/api/quests');
        const questsData = await questsRes.json();
        if (questsRes.ok) {
          setQuests(questsData.quests || []);
        }

        // Trigger daily reset & achievements check
        checkDailyReset();
        fetchAchievementsBadge();
      } else {
        setUser(null);
        setCharacter(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
      setCharacter(null);
    } finally {
      setLoading(false);
    }
  }, [checkDailyReset]);

  useEffect(() => {
    fetchSessionAndData();
  }, [fetchSessionAndData]);

  // Keyboard shortcut listener ('n' opens new quest when not typing in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setCreateQuestOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCharacter(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuestComplete = async (questId: string) => {
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        // Update quest list
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? data.quest : q))
        );
        // Update character stats & gold
        if (data.character) {
          setCharacter(data.character);
        }
        // Trigger Boss Damage Shake & Sound FX!
        if (data.boss?.damageDealt && data.boss.damageDealt > 0) {
          setLastBossDamage({
            damage: data.boss.damageDealt,
            isCrit: data.boss.isCrit,
            timestamp: Date.now(),
          });
          soundFx.playHit();
        }

        // Check for level up!
        if (data.progression?.leveledUp) {
          setLevelUpModal({
            isOpen: true,
            level: data.progression.newLevel,
          });
        }
        // Check for boss defeat / loot chest!
        if (data.boss?.bossSlain && data.boss.lootChest) {
          soundFx.playBossVictory();
          setLootChestModal({
            isOpen: true,
            defeatedBossName: data.boss.defeatedBossName || 'Raid Boss',
            nextBossName: data.boss.nextBossName || '',
            lootChest: data.boss.lootChest,
          });
        }

        // Pop-up celebratory message with quest name and XP earned!
        setQuestCompletionNotice({
          questTitle: data.quest?.title || 'Quest',
          xpEarned: data.rewards?.xp || data.quest?.xpReward || 50,
          goldEarned: data.rewards?.gold || data.quest?.goldReward || 25,
          bossDamage: data.boss?.damageDealt,
          isCrit: data.boss?.isCrit,
          attribute: data.quest?.attribute,
        });

        // Refresh logs
        fetchSessionAndData();
        return {
          leveledUp: data.progression?.leveledUp,
          newLevel: data.progression?.newLevel,
          xpGained: data.rewards?.xp,
          goldGained: data.rewards?.gold,
        };
      }
      return {};
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  const handleCompleteQuestWithFocus = async (questId: string, focusMinutes: number) => {
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hyperfocus: true, focusMinutes }),
      });
      const data = await res.json();
      if (res.ok) {
        soundFx.playQuestComplete();
        soundFx.playCoin();
        fetchSessionAndData();
        fetchAchievementsBadge();
        if (data.progression?.leveledUp) {
          setLevelUpModal({ isOpen: true, level: data.progression.newLevel });
        }
        if (data.boss?.bossSlain && data.boss.lootChest) {
          soundFx.playBossVictory();
          setLootChestModal({
            isOpen: true,
            defeatedBossName: data.boss.defeatedBossName || 'Raid Boss',
            nextBossName: data.boss.nextBossName || '',
            lootChest: data.boss.lootChest,
          });
        }

        // Pop-up celebratory message with quest name and XP earned!
        setQuestCompletionNotice({
          questTitle: data.quest?.title || 'Hyperfocus Sprint Quest',
          xpEarned: data.rewards?.xp || 70,
          goldEarned: data.rewards?.gold || 35,
          bossDamage: data.boss?.damageDealt,
          isCrit: data.boss?.isCrit,
          attribute: data.quest?.attribute,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuestDelete = async (questId: string) => {
    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setQuests((prev) => prev.filter((q) => q.id !== questId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14] text-slate-400">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 animate-spin flex items-center justify-center text-amber-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 animate-pulse">
            Connecting to Realm...
          </span>
        </div>
      </div>
    );
  }

  if (!user || !character) {
    return (
      <AuthView
        onSuccess={() => {
          fetchSessionAndData();
        }}
      />
    );
  }

  // Filtered Quests
  const filteredQuests = quests.filter((q) => {
    if (questTypeFilter !== 'ALL' && q.type !== questTypeFilter) return false;
    if (attributeFilter !== 'ALL' && q.attribute !== attributeFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchDesc = q.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const completedCount = quests.filter((q) => q.isCompleted).length;
  const pendingCount = quests.filter((q) => !q.isCompleted).length;

  return (
    <div className="min-h-screen cyber-bg-overlay pb-24 lg:pb-8 flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        user={user}
        character={character}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCreateQuest={() => setCreateQuestOpen(true)}
        onOpenInspect={() => setInspectModalOpen(true)}
        onOpenAvatarVault={() => setAvatarVaultOpen(true)}
        onOpenEditProfile={() => setEditProfileOpen(true)}
        onOpenSkills={() => setSkillTreeOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenParty={() => setPartyHubOpen(true)}
        onOpenFocusTimer={() => setFocusModal({ isOpen: true, quest: null })}
        onOpenAutoForge={() => setAutoForgeOpen(true)}
        onOpenMobileHub={() => setMobileHubOpen(true)}
        skillPoints={character.skillPoints || 0}
        readyAchievementsCount={readyAchievementsCount}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* DESKTOP LAYOUT (>= 1024px) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left Column: Hero Character Card & Streak Matrix */}
          <div className="lg:col-span-4 space-y-6">
            <HeroCard
              user={user}
              character={character}
              onOpenShop={() => setDesktopView(desktopView === 'SHOP' ? 'BOARD' : 'SHOP')}
              onOpenInspect={() => setInspectModalOpen(true)}
              onOpenAvatarVault={() => setAvatarVaultOpen(true)}
              onOpenEditProfile={() => setEditProfileOpen(true)}
              onShareHero={() => setShareHeroOpen(true)}
            />
            <StreakHeatmap
              currentStreak={character.streak}
              logs={recentLogs}
            />
          </div>

          {/* Center / Main Column: Quest Board or Armory Shop */}
          <div className="lg:col-span-5 space-y-4">
            {/* View Switcher Header on Desktop */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDesktopView('BOARD')}
                  className={`flex items-center space-x-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    desktopView === 'BOARD'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Swords className="h-4 w-4" />
                  <span>Quest Journal</span>
                  <span className="rounded-full bg-slate-900/60 px-1.5 py-0.2 text-[10px] text-amber-200">
                    {pendingCount}
                  </span>
                </button>

                <button
                  onClick={() => setDesktopView('SHOP')}
                  className={`flex items-center space-x-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    desktopView === 'SHOP'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Merchant Armory</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 hidden xl:inline">
                Press <kbd className="rounded border border-slate-700 bg-slate-900 px-1 py-0.5 text-slate-300 font-mono">N</kbd> for new quest
              </span>
            </div>

            {desktopView === 'BOARD' ? (
              <>
                {/* Search & Filter Toolbar */}
                <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-3 shadow-lg backdrop-blur-sm space-y-3">
                  {/* Search input + Active count indicator */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search active quests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 focus:outline-none transition"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setAutoForgeOpen(true)}
                      className="game-btn flex items-center space-x-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition shrink-0"
                      title="Auto-Forge 5 Daily Routine Quests"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden md:inline">Auto-Forge</span>
                    </button>
                    <button
                      onClick={() => setCreateQuestOpen(true)}
                      className="game-btn flex items-center space-x-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition shrink-0"
                      title="Create Quest (Shortcut: N)"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span className="hidden sm:inline">New Quest</span>
                    </button>
                  </div>

                  {/* Row 1: Quest Category Tabs */}
                  <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-800/60">
                    {[
                      { key: 'ALL', label: 'All Quests' },
                      { key: 'DAILY', label: 'Dailies' },
                      { key: 'HABIT', label: 'Habits' },
                      { key: 'TODO', label: 'To-Dos' },
                      { key: 'BOSS', label: 'Boss Raids' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setQuestTypeFilter(tab.key)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                          questTypeFilter === tab.key
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Row 2: RPG Attribute Filter Chips */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-800/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-1 shrink-0">
                      Attribute:
                    </span>
                    {[
                      { key: 'ALL', label: 'All Stats' },
                      { key: 'STR', label: 'STR' },
                      { key: 'INT', label: 'INT' },
                      { key: 'VIT', label: 'VIT' },
                      { key: 'AGI', label: 'AGI' },
                      { key: 'SPR', label: 'SPR' },
                    ].map((attr) => (
                      <button
                        key={attr.key}
                        onClick={() => setAttributeFilter(attr.key)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:scale-95 shrink-0 ${
                          attributeFilter === attr.key
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                            : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {attr.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quests List */}
                <div className="space-y-3 pt-1">
                  {filteredQuests.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center">
                      <Swords className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                      <p className="text-sm font-semibold text-slate-300">
                        No quests found in this category
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Forge a new objective to begin earning virtual power!
                      </p>
                      <button
                        onClick={() => setCreateQuestOpen(true)}
                        className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Forge First Quest</span>
                      </button>
                    </div>
                  ) : (
                    filteredQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleQuestComplete}
                        onDelete={handleQuestDelete}
                        onStartFocus={(q) => setFocusModal({ isOpen: true, quest: q })}
                      />
                    ))
                  )}
                </div>
              </>
            ) : (
              /* Armory View on Desktop */
              <ShopView
                playerGold={character.gold}
                onUpdateCharacter={fetchSessionAndData}
              />
            )}
          </div>

          {/* Right Column: World Boss Raid, Life Wheel Radar Chart & Armory Widget */}
          <div className="lg:col-span-3 space-y-6">
            <BossCard lastDamage={lastBossDamage} />

            {/* Hexagonal Life Wheel Balance Radar Chart */}
            <LifeRadarChart character={character} />

            {/* Quick Stats Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Today&apos;s Quest Progress
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500 font-medium">Completed</span>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {completedCount}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500 font-medium">Incomplete</span>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {pendingCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (< 1024px) */}
        <div className="block lg:hidden space-y-4">
          {activeTab === 'QUESTS' && (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search quests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                    />
                  </div>
                  <button
                    onClick={() => setAutoForgeOpen(true)}
                    className="game-btn flex items-center space-x-1 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-2 text-xs font-bold text-cyan-300 active:scale-95 transition shrink-0"
                    title="Auto-Forge"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCreateQuestOpen(true)}
                    className="game-btn flex items-center space-x-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition shrink-0"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>New</span>
                  </button>
                </div>

                {/* Mobile Row 1: Quest Categories */}
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { key: 'ALL', label: 'All' },
                    { key: 'DAILY', label: 'Dailies' },
                    { key: 'HABIT', label: 'Habits' },
                    { key: 'TODO', label: 'To-Dos' },
                    { key: 'BOSS', label: 'Boss Raids' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setQuestTypeFilter(tab.key)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                        questTypeFilter === tab.key
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Mobile Row 2: Stats Chips */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pt-1.5 border-t border-slate-800/50 pb-0.5 no-scrollbar">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 shrink-0">
                    Stat:
                  </span>
                  {['ALL', 'STR', 'INT', 'VIT', 'AGI', 'SPR'].map((attr) => (
                    <button
                      key={attr}
                      onClick={() => setAttributeFilter(attr)}
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition active:scale-95 shrink-0 ${
                        attributeFilter === attr
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                          : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                      }`}
                    >
                      {attr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quests List */}
              <div className="space-y-3">
                {filteredQuests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-800 py-12 text-center">
                    <p className="text-xs text-slate-400">No quests found.</p>
                  </div>
                ) : (
                  filteredQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={handleQuestComplete}
                      onDelete={handleQuestDelete}
                      onStartFocus={(q) => setFocusModal({ isOpen: true, quest: q })}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'HERO' && (
            <div className="space-y-4">
              <HeroCard
                user={user}
                character={character}
                onOpenShop={() => setActiveTab('SHOP')}
                onOpenInspect={() => setInspectModalOpen(true)}
                onOpenAvatarVault={() => setAvatarVaultOpen(true)}
                onOpenEditProfile={() => setEditProfileOpen(true)}
                onShareHero={() => setShareHeroOpen(true)}
              />
              <LifeRadarChart character={character} />
              <StreakHeatmap
                currentStreak={character.streak}
                logs={recentLogs}
              />
            </div>
          )}

          {activeTab === 'SHOP' && (
            <ShopView
              playerGold={character.gold}
              onUpdateCharacter={fetchSessionAndData}
            />
          )}

          {activeTab === 'RAID' && (
            <div className="space-y-4">
              <BossCard lastDamage={lastBossDamage} />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Dock Navigation */}
      <MobileNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenCreateQuest={() => setCreateQuestOpen(true)}
        onOpenAutoForge={() => setAutoForgeOpen(true)}
        onOpenFocusTimer={() => setFocusModal({ isOpen: true, quest: null })}
        onOpenSkills={() => setSkillTreeOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenParty={() => setPartyHubOpen(true)}
        onOpenShareHero={() => setShareHeroOpen(true)}
        onOpenAvatarVault={() => setAvatarVaultOpen(true)}
        onOpenEditProfile={() => setEditProfileOpen(true)}
        skillPoints={character?.skillPoints || 0}
        readyAchievementsCount={readyAchievementsCount}
        user={user}
        character={character}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        isOpenHubExternal={mobileHubOpen}
        onCloseHubExternal={() => setMobileHubOpen(false)}
      />

      {/* Auto-Forge Daily Routine Modal */}
      <AutoForgeModal
        isOpen={autoForgeOpen}
        onClose={() => setAutoForgeOpen(false)}
        onQuestsForged={fetchSessionAndData}
      />

      {/* Sharable Hero Collectible Card Modal */}
      {user && character && (
        <ShareHeroModal
          isOpen={shareHeroOpen}
          onClose={() => setShareHeroOpen(false)}
          user={user}
          character={character}
        />
      )}

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={createQuestOpen}
        onClose={() => setCreateQuestOpen(false)}
        onCreated={fetchSessionAndData}
      />

      {/* Celebratory Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpModal.isOpen}
        level={levelUpModal.level}
        onClose={() => setLevelUpModal({ isOpen: false, level: 1 })}
      />

      {/* Dynamic Character Inspect & Evolution Modal */}
      <CharacterInspectModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        user={user}
        character={character}
        onUpdateCharacter={fetchSessionAndData}
        onOpenAvatarVault={() => setAvatarVaultOpen(true)}
        onOpenEditProfile={() => setEditProfileOpen(true)}
      />

      {/* Game Avatar Vault / Profile Pic Stack Selector Modal */}
      <AvatarStackSelectorModal
        isOpen={avatarVaultOpen}
        onClose={() => setAvatarVaultOpen(false)}
        currentAvatarId={user?.avatar || 'crimson-avenger'}
        user={user}
        character={character}
        onAvatarEquipped={(newAvatarId) => {
          setUser((prev: any) => (prev ? { ...prev, avatar: newAvatarId } : prev));
          setAvatarVaultOpen(false);
        }}
      />

      {/* Edit Profile & Hero Archetype Modal */}
      {user && character && (
        <EditProfileModal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          user={user}
          character={character}
          onProfileUpdated={fetchSessionAndData}
          onOpenAvatarVault={() => setAvatarVaultOpen(true)}
        />
      )}

      {/* Dawn Report Modal (Daily reset & missed quest damage debrief) */}
      <DawnReportModal
        isOpen={dawnReport.isOpen}
        onClose={() => setDawnReport((prev) => ({ ...prev, isOpen: false }))}
        report={dawnReport}
      />

      {/* World Boss Defeat & Loot Chest Modal */}
      <LootChestModal
        isOpen={lootChestModal.isOpen}
        onClose={() => {
          setLootChestModal((prev) => ({ ...prev, isOpen: false }));
          fetchSessionAndData();
        }}
        defeatedBossName={lootChestModal.defeatedBossName}
        nextBossName={lootChestModal.nextBossName}
        lootChest={lootChestModal.lootChest || { gold: 0, xp: 0 }}
      />

      {/* Hyperfocus Pomodoro Chamber Modal */}
      <FocusTimerModal
        isOpen={focusModal.isOpen}
        onClose={() => setFocusModal({ isOpen: false, quest: null })}
        quest={focusModal.quest as any}
        onCompleteQuestWithBonus={handleCompleteQuestWithFocus}
      />

      {/* RPG Talent Tree & Masteries Modal */}
      <SkillTreeModal
        isOpen={skillTreeOpen}
        onClose={() => setSkillTreeOpen(false)}
        onSkillUnlocked={fetchSessionAndData}
      />

      {/* Trophy & Milestone Achievement Hall Modal */}
      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        onRewardClaimed={() => {
          fetchSessionAndData();
          fetchAchievementsBadge();
        }}
      />

      {/* Co-Op Guild Fellowship & World Boss Raid Modal */}
      <PartyHub
        isOpen={partyHubOpen}
        onClose={() => setPartyHubOpen(false)}
        onPartyUpdated={fetchSessionAndData}
      />

      {/* Celebratory Quest Completion Popup */}
      <QuestCompletionPopup
        notice={questCompletionNotice}
        onClose={() => setQuestCompletionNotice(null)}
      />
    </div>
  );
}
