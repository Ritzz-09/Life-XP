'use client';

import React, { useState, useEffect } from 'react';
import { Skull, Flame, ShieldAlert, Swords, Heart, Sparkles, Brain } from 'lucide-react';
import { ATTRIBUTE_METADATA, AttributeType } from '@/lib/rpg-engine';
import { GamerAvatar } from './GamerAvatar';

interface BossEncounter {
  id: string;
  name: string;
  title: string;
  description: string;
  maxHp: number;
  currentHp: number;
  weakness: string;
  rewardGold: number;
  rewardXp: number;
  tier?: number;
}

interface StrikeLog {
  id: string;
  questTitle: string;
  xpEarned: number;
  attribute: string;
  completedAt: string;
  user?: {
    username: string;
    avatar?: string;
  };
}

export const BossCard: React.FC = () => {
  const [boss, setBoss] = useState<BossEncounter | null>(null);
  const [recentStrikes, setRecentStrikes] = useState<StrikeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoss = async () => {
    try {
      const res = await fetch('/api/boss');
      const data = await res.json();
      if (res.ok && data.boss) {
        setBoss(data.boss);
        setRecentStrikes(data.recentStrikes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoss();
    const interval = setInterval(fetchBoss, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !boss) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center text-xs text-slate-500 animate-pulse">
        Summoning the Realm Raid Boss...
      </div>
    );
  }

  const hpPercent = Math.min(100, Math.max(0, Math.round((boss.currentHp / boss.maxHp) * 100)));
  const weaknessKey = (boss.weakness.toUpperCase() in ATTRIBUTE_METADATA
    ? boss.weakness.toUpperCase()
    : 'INT') as AttributeType;
  const weaknessMeta = ATTRIBUTE_METADATA[weaknessKey];

  return (
    <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-b from-slate-900 via-rose-950/25 to-slate-900 p-5 shadow-xl backdrop-blur-sm relative overflow-hidden ambient-glow-rose interactive-card">
      {/* Background ambient red glow */}
      <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-rose-900/40 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950/80 border border-rose-600/40 px-2.5 py-0.5 rounded-full shadow-sm">
            <Skull className="h-3 w-3 mr-1 text-rose-400" /> Raid Boss • Tier {boss.tier || 1}
          </span>

          {/* Weakness Indicator */}
          <div
            className={`flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-bold ${weaknessMeta.bg} shadow-sm`}
            title={`Complete ${weaknessMeta.name} quests to deal 1.5x damage!`}
          >
            <Brain className="mr-1 h-3 w-3" />
            <span>Weakness: {weaknessMeta.name}</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-100 sm:text-lg tracking-tight">
            {boss.name}
          </h3>
          <p className="text-xs text-rose-300/80 italic font-medium">
            "{boss.title}"
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
        {boss.description}
      </p>

      {/* Boss Health Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-semibold">
          <span className="flex items-center text-rose-400">
            <Heart className="mr-1.5 h-4 w-4 fill-rose-500/30" /> Boss Life Force
          </span>
          <span className="font-mono text-xs text-rose-200">
            {boss.currentHp} / {boss.maxHp} HP ({hpPercent}%)
          </span>
        </div>
        <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-950 border border-rose-900/60 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-700 via-rose-500 to-red-400 transition-all duration-700 shadow-md shadow-rose-500/50"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Raid Rewards */}
      <div className="mt-3 flex items-center justify-between text-[11px] rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-slate-400">
        <span>Bounty Pool upon defeat:</span>
        <div className="flex items-center space-x-2 font-mono font-bold">
          <span className="text-yellow-400">+{boss.rewardGold} Gold</span>
          <span>•</span>
          <span className="text-amber-400">+{boss.rewardXp} XP</span>
        </div>
      </div>

      {/* Recent Combat Log */}
      {recentStrikes.length > 0 && (
        <div className="mt-4 border-t border-slate-800/80 pt-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center">
            <Swords className="h-3 w-3 mr-1 text-amber-400" /> Recent Strikes Against Boss
          </span>
          <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto">
            {recentStrikes.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between text-[11px] rounded bg-slate-950/40 px-2 py-1 text-slate-400 border border-slate-800/40"
              >
                <div className="flex items-center space-x-1.5 truncate max-w-[180px]">
                  <GamerAvatar avatarId={s.user?.avatar} size="xs" showFrame={false} />
                  <span className="truncate text-slate-300">
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">{s.user?.username || 'Hero'}</span> completed &ldquo;{s.questTitle}&rdquo;
                  </span>
                </div>
                <span className="font-mono text-[10px] text-rose-400 font-semibold shrink-0 ml-1">
                  Hit for DMG!
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
