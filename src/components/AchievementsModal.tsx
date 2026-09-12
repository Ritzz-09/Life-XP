'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle, Award, Flame, Crown, Zap, ShieldAlert, Star, Swords, Skull, Shield, Medal, Coins, PiggyBank, Gem, BookOpen, Users, Compass, Sparkles } from 'lucide-react';
import { AchievementDefinition } from '@/lib/achievements-data';

interface AchievementWithStatus extends AchievementDefinition {
  currentProgress: number;
  status: 'LOCKED' | 'READY_TO_CLAIM' | 'CLAIMED';
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: () => void;
}

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  Award: <Award className="w-5 h-5 text-amber-400" />,
  Flame: <Flame className="w-5 h-5 text-orange-400" />,
  Crown: <Crown className="w-5 h-5 text-yellow-400" />,
  Trophy: <Trophy className="w-5 h-5 text-amber-300" />,
  Zap: <Zap className="w-5 h-5 text-yellow-300" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-indigo-400" />,
  Star: <Star className="w-5 h-5 text-amber-400" />,
  Swords: <Swords className="w-5 h-5 text-rose-400" />,
  Skull: <Skull className="w-5 h-5 text-purple-400" />,
  Shield: <Shield className="w-5 h-5 text-blue-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-cyan-400" />,
  Medal: <Medal className="w-5 h-5 text-emerald-400" />,
  Coins: <Coins className="w-5 h-5 text-yellow-400" />,
  PiggyBank: <PiggyBank className="w-5 h-5 text-pink-400" />,
  Gem: <Gem className="w-5 h-5 text-teal-400" />,
  BookOpen: <BookOpen className="w-5 h-5 text-blue-400" />,
  Users: <Users className="w-5 h-5 text-indigo-400" />,
  Compass: <Compass className="w-5 h-5 text-emerald-400" />,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements || []);
        setTotalClaimed(data.totalClaimed || 0);
        setReadyCount(data.readyToClaimCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAchievements();
      setClaimToast(null);
    }
  }, [isOpen]);

  const handleClaim = async (achievementId: string) => {
    try {
      setClaimingId(achievementId);
      const res = await fetch('/api/achievements/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementId }),
      });
      const data = await res.json();
      if (res.ok) {
        setClaimToast(data.message);
        await fetchAchievements();
        if (onRewardClaimed) onRewardClaimed();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaimingId(null);
    }
  };

  if (!isOpen) return null;

  const categories = ['ALL', 'QUESTS', 'STREAKS', 'BOSSES', 'LEVELS', 'WEALTH', 'MASTERY'];

  const filtered = achievements.filter((a) => {
    if (activeCategory === 'ALL') return true;
    return a.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-fade-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Trophy & Milestone Hall
                </h2>
                <p className="text-xs text-slate-400">
                  Track your historic RPG achievements, unlock prestigious titles & claim bounties
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
                Claimed: <strong className="text-amber-400">{totalClaimed} / {achievements.length}</strong>
              </div>
              {readyCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400 border border-emerald-500/40 animate-pulse">
                  {readyCount} Ready to Claim!
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Notice */}
          {claimToast && (
            <div className="bg-emerald-600/90 text-white text-xs font-bold py-2 px-4 text-center">
              🎉 {claimToast}
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-3 border-b border-slate-800 overflow-x-auto bg-slate-950/30">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Achievement List */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((ach) => {
              const percent = Math.min(100, Math.round((ach.currentProgress / ach.target) * 100));
              const isClaimed = ach.status === 'CLAIMED';
              const isReady = ach.status === 'READY_TO_CLAIM';

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    isClaimed
                      ? 'bg-slate-900/50 border-emerald-900/30 opacity-75'
                      : isReady
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/50 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                        isClaimed
                          ? 'bg-emerald-500/20 border-emerald-500/30'
                          : isReady
                          ? 'bg-amber-500/20 border-amber-500/40'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      {ICON_COMPONENTS[ach.icon] || <Trophy className="w-5 h-5 text-slate-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{ach.title}</h4>
                        {ach.rewardTitle && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Title: &quot;{ach.rewardTitle}&quot;
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ach.description}</p>
                    </div>
                  </div>

                  {/* Progress bar and Rewards / Claim Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">
                        Progress: <strong className="text-slate-200">{ach.currentProgress}</strong> / {ach.target}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{percent}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isClaimed
                            ? 'bg-emerald-500'
                            : isReady
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-amber-400 font-bold">+{ach.rewardGold} Gold</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-indigo-400 font-bold">+{ach.rewardXp} XP</span>
                      </div>

                      {isClaimed ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Claimed
                        </span>
                      ) : isReady ? (
                        <button
                          onClick={() => handleClaim(ach.id)}
                          disabled={claimingId === ach.id}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition active:scale-95"
                        >
                          {claimingId === ach.id ? 'Claiming...' : 'Claim Bounty!'}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Locked</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};
