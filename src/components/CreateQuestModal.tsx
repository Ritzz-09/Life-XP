'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Dumbbell,
  Brain,
  Heart,
  Zap,
  Sparkles,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { DIFFICULTY_CONFIG, DifficultyType, AttributeType, ATTRIBUTE_METADATA } from '@/lib/rpg-engine';
import { soundFx } from '@/lib/sound-fx';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('DAILY');
  const [difficulty, setDifficulty] = useState<DifficultyType>('MEDIUM');
  const [attribute, setAttribute] = useState<AttributeType>('STR');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a name for this quest');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          difficulty,
          attribute,
          dueDate: dueDate || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create quest');
      }

      soundFx.playCoin();
      // Reset form
      setTitle('');
      setDescription('');
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const attributes: { key: AttributeType; label: string; icon: React.ReactNode; eg: string }[] = [
    { key: 'STR', label: 'Strength', icon: <Dumbbell className="h-4 w-4" />, eg: 'Gym, pushups, chores' },
    { key: 'INT', label: 'Intellect', icon: <Brain className="h-4 w-4" />, eg: 'Coding, studying, reading' },
    { key: 'VIT', label: 'Vitality', icon: <Heart className="h-4 w-4" />, eg: 'Sleep 8h, 2L water, walk' },
    { key: 'AGI', label: 'Agility', icon: <Zap className="h-4 w-4" />, eg: 'Inbox zero, quick errands' },
    { key: 'SPR', label: 'Spirit', icon: <Sparkles className="h-4 w-4" />, eg: 'Meditation, journaling' },
  ];

  const difficulties: { key: DifficultyType; label: string; xp: number; gold: number }[] = [
    { key: 'TRIVIAL', label: 'Trivial', xp: 15, gold: 10 },
    { key: 'EASY', label: 'Easy', xp: 30, gold: 20 },
    { key: 'MEDIUM', label: 'Medium', xp: 60, gold: 40 },
    { key: 'HARD', label: 'Hard', xp: 120, gold: 80 },
    { key: 'EPIC', label: 'Epic / Boss', xp: 250, gold: 180 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forge-quest-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h3 id="forge-quest-title" className="text-lg font-bold text-slate-100">
                Forge a New Quest
              </h3>
              <p className="text-xs text-slate-400">
                Turn a real-world task into virtual XP and Gold
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Quest Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read 20 pages of clean architecture book"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add tactical notes or objective details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Quest Type & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
              >
                <option value="DAILY">Daily (Repeats Daily)</option>
                <option value="HABIT">Habit (Ongoing)</option>
                <option value="TODO">To-Do (One-time)</option>
                <option value="BOSS">Boss Bounty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Attribute Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Character Attribute
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {attributes.map((attr) => (
                <button
                  key={attr.key}
                  type="button"
                  onClick={() => setAttribute(attr.key)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${
                    attribute === attr.key
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  title={attr.eg}
                >
                  {attr.icon}
                  <span className="mt-1 text-[10px] font-bold">{attr.key}</span>
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {ATTRIBUTE_METADATA[attribute].description}
            </p>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Difficulty & Reward
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {difficulties.map((diff) => (
                <button
                  key={diff.key}
                  type="button"
                  onClick={() => setDifficulty(diff.key)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${
                    difficulty === diff.key
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-bold">{diff.label}</span>
                  <span className="text-[9px] text-amber-400 font-mono">+{diff.xp} XP</span>
                  <span className="text-[9px] text-yellow-300 font-mono">+{diff.gold} G</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end space-x-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Inscribing...</span>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Enlist Quest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
