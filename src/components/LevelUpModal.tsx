'use client';

import React, { useEffect } from 'react';
import { Sparkles, Trophy, Flame, ArrowUpCircle, X } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';
import { fireLevelUpConfetti } from '@/lib/confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  level,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFx.playLevelUp();
      fireLevelUpConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 text-center shadow-2xl shadow-amber-500/30">
        {/* Glow halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xl shadow-amber-500/40 ring-4 ring-amber-400/50">
          <Trophy className="h-12 w-12 text-slate-950" />
        </div>

        <div className="mt-12">
          <div className="inline-flex items-center space-x-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ascension Milestone</span>
          </div>

          <h2 id="levelup-title" className="mt-3 text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
            LEVEL UP!
          </h2>

          <div className="my-4 flex items-center justify-center space-x-2">
            <span className="text-4xl font-extrabold text-amber-400 font-mono">
              LEVEL {level}
            </span>
          </div>

          <p className="text-sm text-slate-300">
            Your real-world discipline has forged you into a more formidable adventurer!
          </p>

          {/* Perks list */}
          <div className="my-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ArrowUpCircle className="h-4 w-4 shrink-0" />
              <span>Health Pool Fully Restored to 100%</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-400">
              <Flame className="h-4 w-4 shrink-0" />
              <span>Higher Base Multipliers on Daily Quests</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Advanced Gear Unlocked at the Merchant</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 py-3 text-sm font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition"
          >
            Claim Glory & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
