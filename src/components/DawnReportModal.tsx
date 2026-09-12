'use client';

import React from 'react';
import { Sun, Heart, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

interface DawnReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    missedCount: number;
    damageTaken: number;
    currentHp: number;
    maxHp: number;
  };
}

export const DawnReportModal: React.FC<DawnReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  const tookDamage = report.damageTaken > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-950 p-6 shadow-2xl overflow-hidden">
        {/* Ambient background glow */}
        <div
          className={`absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none ${
            tookDamage ? 'bg-rose-600/20' : 'bg-amber-500/20'
          }`}
        />

        {/* Dawn Emblem */}
        <div className="text-center mb-5">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xl ${
              tookDamage
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                : 'border-amber-500/50 bg-amber-500/10 text-amber-400'
            }`}
          >
            {tookDamage ? <ShieldAlert className="h-8 w-8" /> : <Sun className="h-8 w-8" />}
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-100">
            Dawn Breaks Over the Realm
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            A new day has arrived. Your daily quests have been refreshed.
          </p>
        </div>

        {/* Debrief Content */}
        {tookDamage ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>The Shadow of Procrastination Struck!</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You had <strong className="text-rose-300">{report.missedCount} uncompleted Daily Quest{report.missedCount > 1 ? 's' : ''}</strong> yesterday. The raid boss took advantage of your inaction and struck overnight!
            </p>
            <div className="flex items-center justify-between border-t border-rose-900/40 pt-2 text-xs">
              <span className="text-slate-400">Health Penalty:</span>
              <span className="font-black text-rose-400 flex items-center">
                <Heart className="h-3.5 w-3.5 mr-1 fill-rose-500/30" /> -{report.damageTaken} HP
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Vitality:</span>
              <span className="font-bold text-slate-200">
                {report.currentHp} / {report.maxHp} HP
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 text-center">
            <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>Flawless Discipline!</span>
            </div>
            <p className="text-xs text-slate-300">
              No daily quests were neglected yesterday. Your vitality remains protected and your spirit stands fortified!
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            soundFx.playCoin();
            onClose();
          }}
          className="mt-6 w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
        >
          <span>Begin Today&apos;s Quests</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
