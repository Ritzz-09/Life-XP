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
  BookOpen,
  Users,
  Coffee,
  CheckCircle2,
  Smile,
  Check,
  CheckSquare,
  GraduationCap,
} from 'lucide-react';
import { DIFFICULTY_CONFIG, DifficultyType, AttributeType, ATTRIBUTE_METADATA } from '@/lib/rpg-engine';
import { HUMAN_LIFE_ACTIVITY_PRESETS, LifeActivityPreset } from '@/lib/seed-data';
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
  const [modalTab, setModalTab] = useState<'PRESETS' | 'CUSTOM'>('PRESETS');
  const [selectedDomainIndex, setSelectedDomainIndex] = useState(0);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('DAILY');
  const [difficulty, setDifficulty] = useState<DifficultyType>('MEDIUM');
  const [attribute, setAttribute] = useState<AttributeType>('INT');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleQuickAdd = async (item: {
    title: string;
    description: string;
    type: string;
    difficulty: DifficultyType;
    attribute: AttributeType;
  }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          type: item.type,
          difficulty: item.difficulty,
          attribute: item.attribute,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create quest');

      soundFx.playCoin();
      setSuccessMsg(`Added "${item.title}" to your quests!`);
      setTimeout(() => setSuccessMsg(''), 2500);
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error adding preset');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizePreset = (item: {
    title: string;
    description: string;
    type: string;
    difficulty: DifficultyType;
    attribute: AttributeType;
  }) => {
    setTitle(item.title);
    setDescription(item.description);
    setType(item.type);
    setDifficulty(item.difficulty);
    setAttribute(item.attribute);
    setModalTab('CUSTOM');
  };

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
    { key: 'STR', label: 'Strength', icon: <Dumbbell className="h-4 w-4" />, eg: 'Gym, pushups, sports' },
    { key: 'INT', label: 'Intellect', icon: <Brain className="h-4 w-4" />, eg: 'Coding, studying, exams' },
    { key: 'VIT', label: 'Vitality', icon: <Heart className="h-4 w-4" />, eg: 'Sleep 8h, 2L water, nutrition' },
    { key: 'AGI', label: 'Agility', icon: <Zap className="h-4 w-4" />, eg: 'Clean room, inbox zero, errands' },
    { key: 'SPR', label: 'Spirit', icon: <Users className="h-4 w-4" />, eg: 'Friends, family, meditation' },
  ];

  const difficulties: { key: DifficultyType; label: string; xp: number; gold: number }[] = [
    { key: 'TRIVIAL', label: 'Trivial', xp: 15, gold: 10 },
    { key: 'EASY', label: 'Easy', xp: 30, gold: 20 },
    { key: 'MEDIUM', label: 'Medium', xp: 60, gold: 40 },
    { key: 'HARD', label: 'Hard', xp: 120, gold: 80 },
    { key: 'EPIC', label: 'Epic / Boss', xp: 250, gold: 180 },
  ];

  const currentDomain = HUMAN_LIFE_ACTIVITY_PRESETS[selectedDomainIndex] || HUMAN_LIFE_ACTIVITY_PRESETS[0];

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="h-4 w-4 text-blue-400" />;
      case 'Users': return <Users className="h-4 w-4 text-purple-400" />;
      case 'Dumbbell': return <Dumbbell className="h-4 w-4 text-red-400" />;
      case 'CheckSquare': return <CheckSquare className="h-4 w-4 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="h-4 w-4 text-purple-400" />;
      default: return <BookOpen className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forge-quest-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 id="forge-quest-title" className="text-base sm:text-lg font-bold text-slate-100">
                Forge Real-Life Quests
              </h3>
              <p className="text-xs text-slate-400">
                Turn studying, social bonds, health, and daily habits into RPG power
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection: Life Activity Presets vs Custom Form */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 pt-2">
          <button
            onClick={() => setModalTab('PRESETS')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              modalTab === 'PRESETS'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Human Life Activities (Presets)</span>
          </button>
          <button
            onClick={() => setModalTab('CUSTOM')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              modalTab === 'CUSTOM'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Custom Quest Builder</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-5 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 flex items-center space-x-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {modalTab === 'PRESETS' ? (
            /* PRESETS BROWSER */
            <div className="space-y-4">
              {/* Domain category chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {HUMAN_LIFE_ACTIVITY_PRESETS.map((domain, idx) => (
                  <button
                    key={domain.domain}
                    onClick={() => setSelectedDomainIndex(idx)}
                    className={`flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition ${
                      selectedDomainIndex === idx
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {getDomainIcon(domain.domainIcon)}
                    <span>{domain.domain}</span>
                  </button>
                ))}
              </div>

              {/* Items in selected domain */}
              <div className="space-y-2.5 pt-1">
                {currentDomain.items.map((item) => {
                  const attrInfo = ATTRIBUTE_METADATA[item.attribute];
                  return (
                    <div
                      key={item.title}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-slate-700 hover:bg-slate-950"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center rounded border px-1.5 py-0.2 text-[10px] font-bold ${attrInfo.bg}`}>
                            {attrInfo.name}
                          </span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-semibold text-slate-300 uppercase">
                            {item.type}
                          </span>
                          <span className="text-[10px] font-mono text-amber-400/90 font-semibold">
                            +{DIFFICULTY_CONFIG[item.difficulty].xp} XP • +{DIFFICULTY_CONFIG[item.difficulty].gold} Gold
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCustomizePreset(item)}
                          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition"
                        >
                          Customize
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleQuickAdd(item)}
                          className="flex items-center space-x-1 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Quick Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CUSTOM FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Quest Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study 45m for Exam, Dinner with Friends, Hit the Gym"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Description / Real-World Goal (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Add specific details or motivational criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Quest Type & Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Frequency / Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="DAILY">Daily (Repeats Every Day)</option>
                    <option value="HABIT">Habit (Ongoing Discipline)</option>
                    <option value="TODO">To-Do (One-Time Completion)</option>
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
                  Difficulty & Rewards
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
          )}
        </div>
      </div>
    </div>
  );
};
