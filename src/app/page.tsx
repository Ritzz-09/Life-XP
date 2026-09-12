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
  const [activeTab, setActiveTab] = useState<'QUESTS' | 'HERO' | 'SHOP' | 'RAID'>('QUESTS');
  const [desktopView, setDesktopView] = useState<'BOARD' | 'SHOP'>('BOARD');
  const [questTypeFilter, setQuestTypeFilter] = useState('ALL');
  const [attributeFilter, setAttributeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [createQuestOpen, setCreateQuestOpen] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; level: number }>({
    isOpen: false,
    level: 1,
  });

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
      } else {
        setUser(null);
        setCharacter(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
        // Check for level up!
        if (data.progression?.leveledUp) {
          setLevelUpModal({
            isOpen: true,
            level: data.progression.newLevel,
          });
        }
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
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-20 lg:pb-8 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        user={user}
        character={character}
        onOpenCreateQuest={() => setCreateQuestOpen(true)}
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
                {/* Search & Filter Bar */}
                <div className="space-y-3">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search active quests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Quest Type Filter Tabs */}
                  <div className="flex items-center space-x-1 overflow-x-auto pb-1">
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
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition ${
                          questTypeFilter === tab.key
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Attribute Filter Chips */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Attribute:
                    </span>
                    {['ALL', 'STR', 'INT', 'VIT', 'AGI', 'SPR'].map((attr) => (
                      <button
                        key={attr}
                        onClick={() => setAttributeFilter(attr)}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                          attributeFilter === attr
                            ? 'bg-slate-100 text-slate-950 shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {attr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quests List */}
                <div className="space-y-3 pt-2">
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

          {/* Right Column: World Boss Raid & Armory Widget */}
          <div className="lg:col-span-3 space-y-6">
            <BossCard />

            {/* Quick Stats Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Discipline Ledger
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500 font-medium">Fulfilled</span>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {completedCount}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500 font-medium">Pending</span>
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
              {/* Search & Filter Bar */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search quests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                  {['ALL', 'DAILY', 'HABIT', 'TODO', 'BOSS'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setQuestTypeFilter(tab)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold whitespace-nowrap transition ${
                        questTypeFilter === tab
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Stat:
                  </span>
                  {['ALL', 'STR', 'INT', 'VIT', 'AGI', 'SPR'].map((attr) => (
                    <button
                      key={attr}
                      onClick={() => setAttributeFilter(attr)}
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                        attributeFilter === attr
                          ? 'bg-slate-100 text-slate-950'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
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
              />
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
              <BossCard />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Dock Navigation */}
      <MobileNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenCreateQuest={() => setCreateQuestOpen(true)}
      />

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
    </div>
  );
}
