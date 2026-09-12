'use client';

import React from 'react';
import { Flame, Calendar, CheckCircle2 } from 'lucide-react';

interface CompletionLog {
  id: string;
  dateStr: string;
  xpEarned: number;
}

interface StreakHeatmapProps {
  currentStreak: number;
  logs: CompletionLog[];
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({
  currentStreak,
  logs,
}) => {
  // Count completions by dateStr
  const countByDate: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.dateStr) {
      countByDate[log.dateStr] = (countByDate[log.dateStr] || 0) + 1;
    }
  });

  // Generate last 28 days
  const days: { dateStr: string; dayLabel: string; count: number }[] = [];
  const now = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    days.push({
      dateStr,
      dayLabel,
      count: countByDate[dateStr] || 0,
    });
  }

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-slate-950 border-slate-800/80';
    if (count === 1) return 'bg-emerald-950 border-emerald-800/80 text-emerald-400';
    if (count === 2) return 'bg-emerald-800 border-emerald-600/80 text-emerald-200';
    return 'bg-emerald-600 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/50';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-orange-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Discipline Activity Matrix (28 Days)
          </h4>
        </div>
        <div className="flex items-center space-x-1 text-orange-400 text-xs font-bold">
          <Flame className="h-4 w-4 fill-orange-400/40 text-orange-400 animate-pulse" />
          <span>{currentStreak} Day Streak</span>
        </div>
      </div>

      {/* Grid of 28 days (4 rows x 7 cols) */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono transition-all hover:scale-105 cursor-pointer ${getIntensityColor(
              day.count
            )}`}
            title={`${day.dateStr}: ${day.count} quests fulfilled`}
          >
            <span className="opacity-60 text-[8px] leading-none">{day.dayLabel}</span>
            <span className="font-bold leading-tight">{day.count > 0 ? day.count : '·'}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>Less active</span>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-sm bg-slate-950 border border-slate-800" />
          <div className="h-2 w-2 rounded-sm bg-emerald-950 border border-emerald-800" />
          <div className="h-2 w-2 rounded-sm bg-emerald-800 border border-emerald-600" />
          <div className="h-2 w-2 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-400" />
        </div>
        <span>More active</span>
      </div>
    </div>
  );
};
