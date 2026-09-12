'use client';

import React, { useState } from 'react';
import {
  Check,
  Flame,
  Sparkles,
  Coins,
  Trash2,
  Calendar,
  AlertCircle,
  Dumbbell,
  Brain,
  Heart,
  Zap,
  Swords,
} from 'lucide-react';
import { ATTRIBUTE_METADATA, AttributeType } from '@/lib/rpg-engine';
import { soundFx } from '@/lib/sound-fx';
import { fireQuestConfetti } from '@/lib/confetti';

export interface QuestItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  difficulty: string;
  attribute: string;
  xpReward: number;
  goldReward: number;
  isCompleted: boolean;
  streak: number;
  dueDate?: string | null;
}

interface QuestCardProps {
  quest: QuestItem;
  onComplete: (questId: string) => Promise<{ leveledUp?: boolean; newLevel?: number; xpGained?: number; goldGained?: number }>;
  onDelete: (questId: string) => void;
  onEdit?: (quest: QuestItem) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [rewardNotice, setRewardNotice] = useState<{ xp: number; gold: number } | null>(null);

  const attrKey = (quest.attribute.toUpperCase() in ATTRIBUTE_METADATA
    ? quest.attribute.toUpperCase()
    : 'STR') as AttributeType;
  const attrInfo = ATTRIBUTE_METADATA[attrKey];

  const getAttrIcon = (key: string) => {
    switch (key) {
      case 'INT': return <Brain className="h-3 w-3 mr-1" />;
      case 'VIT': return <Heart className="h-3 w-3 mr-1" />;
      case 'AGI': return <Zap className="h-3 w-3 mr-1" />;
      case 'SPR': return <Sparkles className="h-3 w-3 mr-1" />;
      default: return <Dumbbell className="h-3 w-3 mr-1" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case 'TRIVIAL': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'EASY': return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'MEDIUM': return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
      case 'HARD': return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      case 'EPIC': return 'bg-amber-950/60 text-amber-300 border-amber-800/60 ring-1 ring-amber-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (loading) return;

    // Get click coords for localized confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    setLoading(true);
    try {
      if (!quest.isCompleted) {
        soundFx.playQuestComplete();
        soundFx.playCoin();
        fireQuestConfetti(originX, originY);
        setJustCompleted(true);
      }

      const res = await onComplete(quest.id);

      if (res?.xpGained && res?.goldGained) {
        setRewardNotice({ xp: res.xpGained, gold: res.goldGained });
        setTimeout(() => setRewardNotice(null), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setJustCompleted(false), 600);
    }
  };

  return (
    <div
      className={`relative group rounded-xl border transition-all duration-200 p-4 ${
        quest.isCompleted
          ? 'border-slate-800/60 bg-slate-950/40 opacity-60'
          : 'border-slate-800 bg-slate-900/80 hover:border-slate-700/80 hover:bg-slate-900 shadow-md'
      } ${justCompleted ? 'ring-2 ring-emerald-400/80 scale-[1.01]' : ''}`}
    >
      {/* Floating reward pill after completion */}
      {rewardNotice && (
        <div className="absolute -top-3 right-4 z-20 flex items-center space-x-2 rounded-full border border-amber-500/50 bg-slate-900 px-3 py-0.5 text-xs font-bold text-amber-300 shadow-lg animate-bounce">
          <span className="text-amber-400">+{rewardNotice.xp} XP</span>
          <span>•</span>
          <span className="text-yellow-300">+{rewardNotice.gold} Gold</span>
        </div>
      )}

      <div className="flex items-start space-x-3.5">
        {/* Checkbox button */}
        <button
          onClick={handleToggle}
          disabled={loading}
          aria-label={quest.isCompleted ? `Mark ${quest.title} uncompleted` : `Complete ${quest.title}`}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            quest.isCompleted
              ? 'border-emerald-500 bg-emerald-500 text-slate-950'
              : 'border-slate-700 bg-slate-950/80 hover:border-amber-400 hover:bg-slate-900 text-transparent'
          } ${loading ? 'animate-pulse' : ''}`}
        >
          <Check className={`h-4 w-4 stroke-[3] transition-transform ${quest.isCompleted ? 'scale-100' : 'scale-0'}`} />
        </button>

        {/* Quest Information */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {/* Type badge */}
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
              {quest.type}
            </span>

            {/* Difficulty badge */}
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getDifficultyColor(
                quest.difficulty
              )}`}
            >
              {quest.difficulty}
            </span>

            {/* Attribute tag */}
            <span
              className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${attrInfo.bg}`}
              title={attrInfo.description}
            >
              {getAttrIcon(attrKey)}
              {attrInfo.name}
            </span>

            {/* Streak indicator if > 0 */}
            {quest.streak > 0 && (
              <span className="inline-flex items-center text-[11px] font-bold text-orange-400 ml-auto">
                <Flame className="h-3.5 w-3.5 mr-0.5 fill-orange-400/40 text-orange-400" />
                {quest.streak}
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className={`text-sm sm:text-base font-semibold transition-all ${
              quest.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {quest.title}
          </h4>

          {/* Description */}
          {quest.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {quest.description}
            </p>
          )}

          {/* Bottom metadata: XP, Gold, Due Date, Delete */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-2 text-xs">
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="flex items-center font-medium text-amber-300/90 font-mono text-[11px]">
                <Sparkles className="mr-1 h-3 w-3 text-amber-400" />
                +{quest.xpReward} XP
              </span>
              <span className="flex items-center font-medium text-yellow-300 font-mono text-[11px]">
                <Coins className="mr-1 h-3 w-3 text-yellow-400" />
                +{quest.goldReward} Gold
              </span>
              {quest.dueDate && (
                <span className="hidden sm:flex items-center text-slate-400 text-[11px]">
                  <Calendar className="mr-1 h-3 w-3" />
                  {quest.dueDate}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onDelete(quest.id)}
                aria-label={`Abandon quest ${quest.title}`}
                title="Abandon Quest"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded focus:opacity-100 focus:outline-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
