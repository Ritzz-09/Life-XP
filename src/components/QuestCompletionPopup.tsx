'use client';

import React, { useEffect } from 'react';
import { Sparkles, Trophy, X, Zap, Coins, CheckCircle2, Flame, Swords } from 'lucide-react';
import { fireQuestConfetti } from '@/lib/confetti';
import { soundFx } from '@/lib/sound-fx';

export interface QuestCompletionNotice {
  questTitle: string;
  xpEarned: number;
  goldEarned?: number;
  bossDamage?: number;
  attribute?: string;
  isCrit?: boolean;
}

interface QuestCompletionPopupProps {
  notice: QuestCompletionNotice | null;
  onClose: () => void;
}

export const QuestCompletionPopup: React.FC<QuestCompletionPopupProps> = ({
  notice,
  onClose,
}) => {
  useEffect(() => {
    if (notice) {
      // Fire celebratory confetti & audio
      fireQuestConfetti(0.5, 0.3);
      soundFx.playQuestComplete();

      // Auto dismiss after 4.5s
      const timer = setTimeout(() => {
        onClose();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [notice, onClose]);

  if (!notice) return null;

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      className="fixed inset-x-0 top-4 z-50 flex items-start justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div
        className="pointer-events-auto relative w-full max-w-md rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-5 shadow-2xl shadow-amber-500/30 backdrop-blur-2xl ring-4 ring-amber-500/20 interactive-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Dismiss completion message"
          className="absolute right-3.5 top-3.5 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          {/* Trophy Crest Badge */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/40 ring-2 ring-yellow-200">
            <Trophy className="h-6 w-6 stroke-[2.5]" />
          </div>

          <div className="flex-1 pr-4">
            {/* Title: Congratulations */}
            <div className="flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                Congratulations!
              </h4>
            </div>

            {/* Quest Name */}
            <p className="mt-1 text-xs sm:text-sm font-bold text-slate-100 line-clamp-2">
              {notice.questTitle}
            </p>

            <p className="text-[11px] font-medium text-emerald-400 flex items-center mt-0.5">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Quest Conquered
            </p>

            {/* Reward Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* XP Badge */}
              <div className="flex items-center space-x-1 rounded-xl bg-cyan-500/20 border border-cyan-400/50 px-2.5 py-1 text-xs font-black text-cyan-300 shadow-sm">
                <Zap className="h-3.5 w-3.5 fill-cyan-400/50" />
                <span>+{notice.xpEarned} XP</span>
              </div>

              {/* Gold Badge */}
              {notice.goldEarned !== undefined && notice.goldEarned > 0 && (
                <div className="flex items-center space-x-1 rounded-xl bg-amber-500/20 border border-amber-400/50 px-2.5 py-1 text-xs font-black text-amber-300 shadow-sm">
                  <Coins className="h-3.5 w-3.5 fill-amber-400/50" />
                  <span>+{notice.goldEarned} Gold</span>
                </div>
              )}

              {/* Boss Raid Strike Badge */}
              {notice.bossDamage !== undefined && notice.bossDamage > 0 && (
                <div className="flex items-center space-x-1 rounded-xl bg-rose-500/20 border border-rose-400/50 px-2.5 py-1 text-xs font-black text-rose-300 shadow-sm">
                  <Swords className="h-3.5 w-3.5 text-rose-400" />
                  <span>
                    {notice.isCrit ? '💥 CRIT ' : ''}-{notice.bossDamage} Boss DMG
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar for Auto-dismiss */}
        <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 animate-progress-dismiss" />
        </div>
      </div>
    </div>
  );
};
