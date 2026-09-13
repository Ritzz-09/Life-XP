'use client';

import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Sparkles,
  Zap,
  Flame,
  Award,
  Clock,
  Users,
  ChevronDown,
  ArrowRight,
  Target,
  Trophy,
  Heart,
  Dumbbell,
  BookOpen,
} from 'lucide-react';

interface LandingShowcaseProps {
  onStartFree: () => void;
  onDemoLogin: () => void;
}

export const LandingShowcase: React.FC<LandingShowcaseProps> = ({ onStartFree, onDemoLogin }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: Swords,
      title: 'Habit Quests & Streaks',
      description: 'Turn workouts, study sessions, and daily chores into quests. Earn XP, Gold, and unlock streak multipliers for consistent days.',
      badge: 'Core Engine',
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    },
    {
      icon: Flame,
      title: 'Real-Time Boss Raids',
      description: 'Procrastination visualized as an active world boss. Every quest completed strikes the boss. Miss daily habits, and it strikes back.',
      badge: 'Combat Mechanics',
      color: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/30',
    },
    {
      icon: Zap,
      title: 'Talent & Skill Trees',
      description: 'Distribute stat points across Strength, Intellect, Vitality, Agility, and Spirit. Unlock passive perks that reinforce your discipline.',
      badge: 'Progression',
      color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/30',
    },
    {
      icon: Clock,
      title: 'Hyperfocus Pomodoro Sprints',
      description: 'Built-in 25-minute deep work timer. Pair intense study or coding intervals with instant bonus XP upon completion.',
      badge: 'Productivity',
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
    },
    {
      icon: Award,
      title: 'Armory & Custom Rewards',
      description: 'Create your own real-life rewards (coffee, 1h gaming, cheat meal) and purchase them with gold earned from genuine discipline.',
      badge: 'Incentive Store',
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    },
    {
      icon: Users,
      title: 'Co-Op Guild Parties',
      description: 'Team up with friends using simple invite codes. Share habit logs, support each other’s streaks, and take down bosses together.',
      badge: 'Accountability',
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Habit Quests',
      description: 'Add your real goals—like "30 min gym", "Study algorithms", or "Drink 2L water"—with difficulty and stat tags.',
    },
    {
      step: '02',
      title: 'Complete Tasks & Strike Bosses',
      description: 'Check off quests to trigger tactile Web Audio chimes, celebratory confetti, XP boosts, and direct damage on the raid boss.',
    },
    {
      step: '03',
      title: 'Level Up & Claim Real Rewards',
      description: 'Unlock talent tree skills, upgrade armor, and spend earned gold on real-life treats you defined yourself.',
    },
  ];

  const faqs = [
    {
      q: 'How does Life-XP actually help with procrastination?',
      a: 'Most habit apps fail because real-world goals (like working out or studying) have delayed rewards—it takes months to see results. Life-XP introduces immediate feedback loops: every completed task immediately gives you XP, gold, audio cues, and boss damage, making discipline feel satisfying in real time.',
    },
    {
      q: 'Is Life-XP completely free?',
      a: 'Yes, 100% free and open-source. There are no paywalls, subscriptions, or intrusive ads. All features—quests, boss battles, skill trees, and party raids—are completely unlocked.',
    },
    {
      q: 'Can I install this on my smartphone?',
      a: 'Yes! Life-XP is built as a Progressive Web App (PWA). You can tap "Add to Home Screen" on iOS Safari or Android Chrome to use it just like a native mobile app with tactile navigation.',
    },
    {
      q: 'What is the custom reward system?',
      a: 'You can create your own real-life guilt-free rewards (like "1 hour of gaming" or "Specialty coffee") and set a gold price. You can only buy them once you earn enough gold by finishing your real-world tasks.',
    },
    {
      q: 'How does the boss battle work?',
      a: 'Every quest you complete deals damage to Chronicus the Procrastinator. Matching your task to the boss’s weakness (like doing an Intellect task when the boss is weak to Intellect) scores a 1.5x critical strike. Defeating the boss drops a loot chest!',
    },
  ];

  return (
    <div className="w-full text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Tech Zephyr 4.0 Hackathon Project</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Stop Procrastinating.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Turn Your Life Into an RPG.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Most habit trackers feel like boring spreadsheets. Life-XP turns your workouts, study sessions, and daily habits into a game—complete tasks, earn gold, level up your hero, and defeat bosses.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
            >
              <span>Start Playing Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onDemoLogin}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-slate-200 hover:border-amber-400 hover:text-white transition"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Try Demo Hero</span>
            </button>
          </div>

          {/* Genuine Project Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-slate-200">100% Free & Open Source</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>5 Core RPG Attributes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Flame className="h-4 w-4 text-red-400" />
              <span>Real-Time Boss Combat</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Zero Ads & Privacy First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section id="features" className="py-16 border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Game Mechanics</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">Built to Make Consistency Addictive</p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Replace boredom and friction with instant rewards, leveling fanfares, and clear progression ladders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br ${f.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-800 rounded-full px-2.5 py-0.5">
                        {f.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-400">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Boss Raid Showcase (Replaced fake testimonials with actual game combat showcase) */}
      <section className="py-16 border-t border-slate-900 bg-slate-900/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-500/30 bg-slate-900/90 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300 mb-4">
                  <Flame className="h-3.5 w-3.5 text-red-400" />
                  <span>The Anti-Procrastination Mechanic</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Meet Chronicus: The Procrastination Dragon
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  In Life-XP, resistance isn't just an internal struggle—it has a health bar. Every workout, study session, or chore deals active damage to the boss.
                </p>
                <div className="mt-5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-bold">⚡ Weakness Multiplier:</span>
                    <span>Matching task attributes deals 1.5x Critical Damage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 font-bold">⚠️ Dawn Penalty:</span>
                    <span>Missed daily habits deal damage back to your hero</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">🎁 Loot Chests:</span>
                    <span>Slaying the boss unlocks rare armory gear and gold</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-center">
                <div className="text-4xl mb-2">🐉</div>
                <h4 className="text-base font-black text-red-400">Chronicus the Procrastinator</h4>
                <p className="text-[11px] text-slate-400 mb-4">World Raid Boss · Weakness: Intellect</p>
                <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>HP: 1,300 / 2,000</span>
                  <span className="text-red-400 font-bold">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">The Habit Loop</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">How It Works in 3 Steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm"
              >
                <span className="font-mono text-4xl font-black text-slate-800 select-none block mb-2">
                  {s.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 border-t border-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Got Questions?</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Conversion Banner */}
      <section className="py-16 border-t border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Start Leveling Up Your Life</h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Build habits that actually stick through instant game rewards. Free to play, zero credit cards required.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onStartFree}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
              >
                Create Your Hero Account Free
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
