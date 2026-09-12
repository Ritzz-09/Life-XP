'use client';

import React from 'react';
import { Compass, Sparkles, TrendingUp } from 'lucide-react';

export interface LifeRadarCharacter {
  strength?: number;
  intellect?: number;
  vitality?: number;
  agility?: number;
  spirit?: number;
}

interface LifeRadarChartProps {
  character: LifeRadarCharacter;
  className?: string;
}

interface AxisPoint {
  key: 'strength' | 'intellect' | 'vitality' | 'agility' | 'spirit';
  label: string;
  category: string;
  icon: string;
  angle: number; // in radians
  value: number;
}

export const LifeRadarChart: React.FC<LifeRadarChartProps> = ({ character, className = '' }) => {
  const size = 300;
  const center = size / 2;
  const radius = 105;

  const rawStats = {
    strength: character.strength || 10,
    intellect: character.intellect || 10,
    vitality: character.vitality || 10,
    agility: character.agility || 10,
    spirit: character.spirit || 10,
  };

  const values = Object.values(rawStats);
  const maxVal = Math.max(...values, 20);
  const minVal = Math.min(...values);

  // Balance score: ratio of min to max (100% = perfectly balanced life)
  const balanceScore = Math.round((minVal / maxVal) * 100);

  // Identify lowest attribute for actionable life recommendation
  let lowestStat: { key: string; label: string; action: string } = {
    key: 'strength',
    label: 'Strength (Fitness)',
    action: 'Schedule physical training or workout habits.',
  };

  if (rawStats.intellect <= rawStats.strength && rawStats.intellect <= rawStats.vitality && rawStats.intellect <= rawStats.agility && rawStats.intellect <= rawStats.spirit) {
    lowestStat = { key: 'intellect', label: 'Intellect (Learning)', action: 'Add deep work, reading or skill development tasks.' };
  } else if (rawStats.vitality <= rawStats.strength && rawStats.vitality <= rawStats.intellect && rawStats.vitality <= rawStats.agility && rawStats.vitality <= rawStats.spirit) {
    lowestStat = { key: 'vitality', label: 'Vitality (Health & Sleep)', action: 'Prioritize sleep hygiene, hydration and nutrition.' };
  } else if (rawStats.agility <= rawStats.strength && rawStats.agility <= rawStats.intellect && rawStats.agility <= rawStats.vitality && rawStats.agility <= rawStats.spirit) {
    lowestStat = { key: 'agility', label: 'Agility (Execution & Speed)', action: 'Tackle daily chores and quick response tasks.' };
  } else if (rawStats.spirit <= rawStats.strength && rawStats.spirit <= rawStats.intellect && rawStats.spirit <= rawStats.vitality && rawStats.spirit <= rawStats.agility) {
    lowestStat = { key: 'spirit', label: 'Spirit (Mindfulness)', action: 'Practice meditation, journaling or stress reduction.' };
  }

  // 5 Axes (pentagon)
  // Angle 0 at top (-PI / 2)
  const axes: AxisPoint[] = [
    { key: 'strength', label: 'STR', category: 'Physical', icon: '⚔️', angle: -Math.PI / 2, value: rawStats.strength },
    { key: 'intellect', label: 'INT', category: 'Mental', icon: '🧠', angle: -Math.PI / 2 + (2 * Math.PI) / 5, value: rawStats.intellect },
    { key: 'vitality', label: 'VIT', category: 'Health', icon: '🛡️', angle: -Math.PI / 2 + (4 * Math.PI) / 5, value: rawStats.vitality },
    { key: 'spirit', label: 'SPR', category: 'Soul', icon: '✨', angle: -Math.PI / 2 + (6 * Math.PI) / 5, value: rawStats.spirit },
    { key: 'agility', label: 'AGI', category: 'Speed', icon: '⚡', angle: -Math.PI / 2 + (8 * Math.PI) / 5, value: rawStats.agility },
  ];

  // Grid concentric rings (20%, 40%, 60%, 80%, 100%)
  const gridRings = [0.25, 0.5, 0.75, 1.0];

  // Calculate polygon points for a ring
  const getRingPoints = (scale: number) => {
    return axes
      .map((axis) => {
        const x = center + radius * scale * Math.cos(axis.angle);
        const y = center + radius * scale * Math.sin(axis.angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Calculate user radar polygon points
  const userPolygonPoints = axes
    .map((axis) => {
      // Normalize value to scale 0.2 to 1.0
      const norm = 0.25 + (axis.value / maxVal) * 0.75;
      const x = center + radius * norm * Math.cos(axis.angle);
      const y = center + radius * norm * Math.sin(axis.angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Life Wheel Balance
            </h3>
            <p className="text-[11px] text-slate-400">Holistic 5-Attribute Harmony</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-amber-400">{balanceScore}% Harmony</span>
          <p className="text-[10px] text-slate-400">Balance Index</p>
        </div>
      </div>

      {/* SVG Radar Chart */}
      <div className="flex justify-center my-3">
        <svg width={size} height={size} className="overflow-visible">
          {/* Radial Grid Rings */}
          {gridRings.map((scale, i) => (
            <polygon
              key={i}
              points={getRingPoints(scale)}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={scale === 1 ? 'none' : '3 3'}
              opacity={0.6}
            />
          ))}

          {/* Radial Spokes */}
          {axes.map((axis, i) => {
            const x2 = center + radius * Math.cos(axis.angle);
            const y2 = center + radius * Math.sin(axis.angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="#334155"
                strokeWidth="1"
                opacity={0.6}
              />
            );
          })}

          {/* User Data Polygon */}
          <polygon
            points={userPolygonPoints}
            fill="url(#radarGradient)"
            stroke="#6366f1"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-700"
          />

          {/* User Vertex Nodes */}
          {axes.map((axis, i) => {
            const norm = 0.25 + (axis.value / maxVal) * 0.75;
            const cx = center + radius * norm * Math.cos(axis.angle);
            const cy = center + radius * norm * Math.sin(axis.angle);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="4.5"
                fill="#f59e0b"
                stroke="#0f172a"
                strokeWidth="2"
              />
            );
          })}

          {/* Outer Labels */}
          {axes.map((axis, i) => {
            const labelRadius = radius + 25;
            const lx = center + labelRadius * Math.cos(axis.angle);
            const ly = center + labelRadius * Math.sin(axis.angle);
            return (
              <g key={i} transform={`translate(${lx}, ${ly})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-slate-300 text-[11px] font-bold"
                >
                  {axis.icon} {axis.label} ({axis.value})
                </text>
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Actionable Life Recommendation */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Growth Recommendation: {lowestStat.label}</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          {lowestStat.action} Completing quests with this attribute will restore optimal life balance.
        </p>
      </div>
    </div>
  );
};
