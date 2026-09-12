'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Shield, Swords, Flame, Award, Brain, Clock, BookOpen, Compass, Coins, Users, Zap, Check, Lock, ChevronRight } from 'lucide-react';
import { SkillNode, SKILL_TREE_DATA } from '@/lib/skills-data';

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillUnlocked?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Coins: <Coins className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
};

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  isOpen,
  onClose,
  onSkillUnlocked,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'WARRIOR' | 'SCHOLAR' | 'MYSTIC'>('WARRIOR');
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [skillPoints, setSkillPoints] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSkillState = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setUnlockedIds(data.unlockedSkillIds || []);
        setSkillPoints(data.skillPoints || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSkillState();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const handleUnlockSkill = async (skill: SkillNode) => {
    setUnlocking(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/skills/${skill.id}/unlock`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to unlock talent');
      } else {
        setSuccessMsg(data.message || 'Talent mastered!');
        setUnlockedIds(data.unlockedSkillIds);
        setSkillPoints(data.skillPoints);
        if (onSkillUnlocked) onSkillUnlocked();
      }
    } catch {
      setErrorMsg('Network error unlocking talent');
    } finally {
      setUnlocking(false);
    }
  };

  if (!isOpen) return null;

  const branchSkills = SKILL_TREE_DATA.filter((s) => s.branch === selectedBranch).sort(
    (a, b) => a.tier - b.tier
  );

  const activeSkill = selectedSkill || branchSkills[0];

  const branchTheme = {
    WARRIOR: {
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      accent: 'from-rose-600 to-amber-600',
      ring: 'ring-rose-500',
    },
    SCHOLAR: {
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      accent: 'from-blue-600 to-cyan-500',
      ring: 'ring-blue-500',
    },
    MYSTIC: {
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      accent: 'from-amber-500 to-emerald-500',
      ring: 'ring-amber-500',
    },
  }[selectedBranch];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Talent Tree & Masteries
                </h2>
                <p className="text-xs text-slate-400">
                  Spend skill points to unlock passive character perks and combat buffs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-300">Available:</span>
                <span className="text-sm font-extrabold text-amber-400">{skillPoints} SP</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Branch Switcher Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40">
            {(['WARRIOR', 'SCHOLAR', 'MYSTIC'] as const).map((branch) => {
              const isActive = selectedBranch === branch;
              const branchUnlockedCount = SKILL_TREE_DATA.filter(
                (s) => s.branch === branch && unlockedIds.includes(s.id)
              ).length;
              return (
                <button
                  key={branch}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setSelectedSkill(null);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-3 px-4 text-center text-sm font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                    isActive
                      ? 'border-amber-400 text-white bg-slate-800/50'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                  }`}
                >
                  <span>{branch === 'WARRIOR' ? '⚔️ Warrior' : branch === 'SCHOLAR' ? '📖 Scholar' : '✨ Mystic'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {branchUnlockedCount}/4
                  </span>
                </button>
              );
            })}
          </div>

          {/* Body content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1">
            {/* Visual Skill Path (Left / Top) */}
            <div className="md:col-span-7 flex flex-col justify-center items-center py-4 relative">
              <div className="w-full max-w-sm flex flex-col items-center gap-6 relative">
                {/* Connecting Vertical Track */}
                <div className="absolute top-6 bottom-6 w-1 bg-slate-800 rounded-full z-0" />

                {branchSkills.map((skill, index) => {
                  const isUnlocked = unlockedIds.includes(skill.id);
                  const isPrereqMet = !skill.prerequisiteId || unlockedIds.includes(skill.prerequisiteId);
                  const canUnlock = !isUnlocked && isPrereqMet && skillPoints >= 1;
                  const isSelected = activeSkill?.id === skill.id;

                  return (
                    <div
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={`relative z-10 w-full p-3.5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-md ${
                        isSelected
                          ? `ring-2 ${branchTheme.ring} ${branchTheme.bg} ${branchTheme.border}`
                          : 'bg-slate-800/70 border-slate-700/60 hover:border-slate-500'
                      } ${!isUnlocked && !canUnlock ? 'opacity-60 grayscale-[40%]' : ''}`}
                    >
                      {/* Node Icon Circle */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 transition ${
                          isUnlocked
                            ? `bg-gradient-to-br ${branchTheme.accent} text-white shadow-lg`
                            : canUnlock
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isUnlocked ? (
                          <Check className="w-6 h-6" />
                        ) : !isPrereqMet ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          ICON_MAP[skill.icon] || <Sparkles className="w-5 h-5" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white truncate">{skill.name}</h4>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            Tier {skill.tier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 truncate">{skill.perkSummary}</p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Skill Details & Unlock Panel (Right) */}
            <div className="md:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tier {activeSkill.tier} Mastery
                  </span>
                  {unlockedIds.includes(activeSkill.id) ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Mastered
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                      1 Skill Point
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mt-3">{activeSkill.name}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{activeSkill.description}</p>

                {/* Perk Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Stat & Perk Benefits
                  </span>
                  <p className="text-sm font-semibold text-emerald-400 mt-1">
                    {activeSkill.perkSummary}
                  </p>
                </div>

                {/* Prerequisites Check */}
                {activeSkill.prerequisiteId && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Prerequisite Requirement
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {unlockedIds.includes(activeSkill.prerequisiteId) ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="text-xs text-slate-300">
                        Requires:{' '}
                        <strong className="text-white">
                          {SKILL_TREE_DATA.find((s) => s.id === activeSkill.prerequisiteId)?.name}
                        </strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {errorMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300">
                    {successMsg}
                  </div>
                )}
              </div>

              {/* Unlock Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                {unlockedIds.includes(activeSkill.id) ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-700/50 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    Talent Active
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlockSkill(activeSkill)}
                    disabled={
                      unlocking ||
                      skillPoints < 1 ||
                      (!!activeSkill.prerequisiteId && !unlockedIds.includes(activeSkill.prerequisiteId))
                    }
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    {unlocking ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Unlock Talent (1 SP)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
