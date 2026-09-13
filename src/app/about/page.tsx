import React from 'react';
import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { Shield, Sparkles, Target, Flame, Heart, Compass } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Guild & Lore | Life-XP',
  description: 'Learn the story and philosophy behind Life-XP: turning real-life productivity and habit mastery into an epic RPG.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-bg-overlay">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="py-16 sm:py-24 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300 mb-6">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            <span>The Guild Manifesto</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Why We Slay Procrastination With{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Role-Playing Power
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Traditional habit apps feel like sterile spreadsheets. Life-XP was forged on a simple truth: humans are wired for adventure, leveling up, and collective victory.
          </p>
        </section>

        {/* Pillars Section */}
        <section className="py-12 border-t border-slate-900 bg-slate-900/40 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 text-center mb-10">
              Our Core Guild Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Micro-Habit Stacking</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Big transformations start with atomic daily actions. By rewarding every small victory with instant audio-visual dopamine, habits stick effortlessly.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 mb-4">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Externalized Resistance</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Procrastination isn't a character flaw—it's a raid boss. Visualizing resistance as Chronicus the Shadow Dragon gives you a tangible villain to conquer every single day.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Zero Exploitative Mechanics</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  No predatory microtransactions, no pay-to-win barriers, no attention-hijacking ads. Your progress is earned exclusively through your genuine discipline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 text-center px-4 max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white">Join 12,000+ Fellow Adventurers</h2>
          <p className="mt-2 text-xs text-slate-400">
            Begin with a single habit quest today and experience real-world leveling up.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition"
            >
              Embark Free
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
