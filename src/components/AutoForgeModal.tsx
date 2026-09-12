'use client';

import React, { useState } from 'react';
import { Sparkles, Code, Dumbbell, GraduationCap, Heart, Check, X, ArrowRight, Shield } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

interface AutoForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestsForged: () => void;
}

interface RoutineTemplate {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  description: string;
  quests: {
    title: string;
    description: string;
    type: 'DAILY' | 'HABIT' | 'TODO' | 'BOSS';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    attribute: 'STR' | 'INT' | 'VIT' | 'AGI' | 'SPR';
  }[];
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'dev',
    name: 'Full-Stack Software Engineer',
    role: 'Code & Architecture Mastery',
    icon: Code,
    color: 'text-cyan-400',
    bg: 'border-cyan-500/30 bg-cyan-500/10',
    description: 'Designed for coders building deep work momentum, shipping clean features, and avoiding burnout.',
    quests: [
      {
        title: 'Deep Coding Block (90 Minutes Focus)',
        description: 'Zero Slack or social media notifications. Ship focused code or solve complex algorithms.',
        type: 'DAILY',
        difficulty: 'HARD',
        attribute: 'INT',
      },
      {
        title: 'Clear Technical Debt & Refactor PRs',
        description: 'Review pending pull requests and improve test coverage for 30 minutes.',
        type: 'DAILY',
        difficulty: 'MEDIUM',
        attribute: 'INT',
      },
      {
        title: 'Ergonomic Desk Stretch & 2L Water',
        description: 'Relieve wrist strain and neck tightness with 5 minutes of mobility drills.',
        type: 'HABIT',
        difficulty: 'EASY',
        attribute: 'VIT',
      },
      {
        title: 'Inbox Zero & Quick Discord Triage',
        description: 'Process all pending team messages and clear unread notifications efficiently.',
        type: 'DAILY',
        difficulty: 'EASY',
        attribute: 'AGI',
      },
      {
        title: 'Screen-Free Evening Disconnect',
        description: 'Step away from screens 45 minutes before sleep for optimal mental reset.',
        type: 'HABIT',
        difficulty: 'MEDIUM',
        attribute: 'SPR',
      },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness Titan & Athlete',
    role: 'Physical Discipline & Recovery',
    icon: Dumbbell,
    color: 'text-rose-400',
    bg: 'border-rose-500/30 bg-rose-500/10',
    description: 'Optimized for gym-goers, athletes, and anyone forging peak physical strength and vitality.',
    quests: [
      {
        title: 'Heavy Strength or Calisthenics Workout',
        description: 'Push hard in the gym or track with full progressive overload training.',
        type: 'DAILY',
        difficulty: 'HARD',
        attribute: 'STR',
      },
      {
        title: 'Post-Workout Protein & Clean Meal',
        description: 'Hit daily macro targets with wholesome, nourishing whole foods.',
        type: 'HABIT',
        difficulty: 'EASY',
        attribute: 'VIT',
      },
      {
        title: 'Mobility Drills & Foam Rolling (15m)',
        description: 'Keep joints healthy and reduce muscle soreness with targeted stretching.',
        type: 'HABIT',
        difficulty: 'EASY',
        attribute: 'STR',
      },
      {
        title: '10,000 Steps Daily Movement Goal',
        description: 'Take walking breaks between tasks to keep resting metabolism high.',
        type: 'DAILY',
        difficulty: 'MEDIUM',
        attribute: 'AGI',
      },
      {
        title: '8 Hours Quality Deep Sleep',
        description: 'Unplug and recover so your muscles and central nervous system can rebuild.',
        type: 'DAILY',
        difficulty: 'MEDIUM',
        attribute: 'VIT',
      },
    ],
  },
  {
    id: 'student',
    name: 'Academic Scholar & Learner',
    role: 'High-Retention Mastery',
    icon: GraduationCap,
    color: 'text-amber-400',
    bg: 'border-amber-500/30 bg-amber-500/10',
    description: 'Perfect for students, researchers, and bookworms looking to crush exams without cramming.',
    quests: [
      {
        title: 'Active Recall & Spaced Repetition (Flashcards)',
        description: 'Review key course flashcards or formulas using testing methods.',
        type: 'DAILY',
        difficulty: 'MEDIUM',
        attribute: 'INT',
      },
      {
        title: 'Read 20 Pages of Non-Fiction / Textbook',
        description: 'Expand your perspective with rigorous reading and note-taking.',
        type: 'DAILY',
        difficulty: 'MEDIUM',
        attribute: 'INT',
      },
      {
        title: 'Organize Lecture Notes & Clean Workspace',
        description: 'Synthesize lecture takeaways and prepare your study environment.',
        type: 'HABIT',
        difficulty: 'EASY',
        attribute: 'AGI',
      },
      {
        title: 'Call Parents or Connect with Study Group',
        description: 'Nurture social support and share encouragement with close peers.',
        type: 'HABIT',
        difficulty: 'EASY',
        attribute: 'SPR',
      },
      {
        title: '10-Minute Mindfulness or Breathwork',
        description: 'Center your mind before study blocks to eliminate test anxiety.',
        type: 'HABIT',
        difficulty: 'EASY',
        attribute: 'SPR',
      },
    ],
  },
];

export const AutoForgeModal: React.FC<AutoForgeModalProps> = ({
  isOpen,
  onClose,
  onQuestsForged,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('dev');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentTemplate = ROUTINE_TEMPLATES.find((t) => t.id === selectedPersona) || ROUTINE_TEMPLATES[0];

  const handleApplyTemplate = async () => {
    setLoading(true);
    setError('');
    try {
      // Forge all 5 quests via API
      for (const q of currentTemplate.quests) {
        await fetch('/api/quests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(q),
        });
      }

      soundFx.playLevelUp();
      onQuestsForged();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to auto-forge quests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 sm:text-lg">
              Auto-Forge Daily Routine
            </h3>
            <p className="text-xs text-slate-400">
              Instantly seed 5 balanced, goal-oriented quests tailored to your discipline archetype.
            </p>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {ROUTINE_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = tmpl.id === selectedPersona;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedPersona(tmpl.id)}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border transition active:scale-95 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10 ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-6 w-6 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{tmpl.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">{tmpl.role}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Preview */}
        <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{currentTemplate.name}</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              5 Balanced Quests
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {currentTemplate.description}
          </p>

          <div className="mt-3 space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {currentTemplate.quests.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800/80 px-3 py-2 text-xs"
              >
                <span className="text-slate-200 font-medium truncate flex-1 mr-2">{q.title}</span>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                    {q.attribute}
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                    {q.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyTemplate}
            disabled={loading}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-500/30 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
          >
            <span>{loading ? 'Forging Quests...' : 'Forge My Routine'}</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
