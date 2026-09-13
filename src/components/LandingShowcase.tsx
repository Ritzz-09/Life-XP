'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  CheckCircle2,
  Star,
  Target,
  Trophy,
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
      title: 'Real-Life Habit Quests',
      description: 'Turn workouts, study sessions, and daily chores into epic RPG quests. Earn XP, Gold, and build unbreakable streaks.',
      badge: 'Core Engine',
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    },
    {
      icon: Flame,
      title: 'Epic World Boss Battles',
      description: 'Slay procrastination! Every quest you complete deals real-time damage to terrifying world bosses like Chronicus.',
      badge: 'Raid Mechanics',
      color: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/30',
    },
    {
      icon: Zap,
      title: 'Talent & Skill Tree Evolution',
      description: 'Level up your hero across Strength, Intellect, Vitality, Agility, and Spirit. Unlock passive buffs that amplify your discipline.',
      badge: 'Progression',
      color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/30',
    },
    {
      icon: Clock,
      title: 'Hyperfocus Pomodoro Sprints',
      description: 'Deep work timer with ambient soundscapes. Power through 25-minute sprints to claim bonus quest rewards.',
      badge: 'Productivity',
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
    },
    {
      icon: Award,
      title: 'The Armory & Custom Rewards',
      description: 'Redeem hard-earned quest gold for epic avatar gear or real-life rewards like coffee, gaming time, and cheat meals.',
      badge: 'Economy',
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    },
    {
      icon: Users,
      title: 'Guild Parties & Co-Op Raids',
      description: 'Form accountability alliances with real friends. Share quest logs, cheer streaks, and slay raid bosses as a party.',
      badge: 'Community',
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Define Your Daily Quests',
      description: 'Set up your daily habits (exercise, coding, reading, water) with difficulty ratings and attribute affinities.',
    },
    {
      step: '02',
      title: 'Complete Tasks & Strike Bosses',
      description: 'Check off quests in real-time. Hear satisfying coin and victory fanfares as your hero gains XP and deals raid damage.',
    },
    {
      step: '03',
      title: 'Evolve into a Legendary Hero',
      description: 'Level up, unlock talent tree perks, equip rare armory gear, and watch your real-life productivity transform.',
    },
  ];

  const testimonials = [
    {
      quote: 'Life-XP completely cured my procrastination. Turning my workout routines into boss raid damage makes skipping the gym feel impossible.',
      author: 'Marcus Vance',
      role: 'Software Architect & Level 14 Paladin',
      rating: 5,
    },
    {
      quote: 'The talent tree and gold rewards system makes daily study habits feel like playing an addictive RPG, except my grades actually improved.',
      author: 'Elena Rostova',
      role: 'Medical Student & Level 11 Mage',
      rating: 5,
    },
    {
      quote: 'The co-op party system is pure genius. Our team holds each other accountable daily, and we take down weekly bosses together.',
      author: 'David Chen',
      role: 'Startup Founder & Level 19 Warrior',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'What is Life-XP and how does it work?',
      a: 'Life-XP is a gamified productivity web app that converts your real-world habits, study, fitness, and work goals into an RPG. Completing real tasks rewards your hero with XP, Gold, Streak bonuses, and attacks world bosses.',
    },
    {
      q: 'Is Life-XP free to play?',
      a: 'Yes! Life-XP is 100% free with full access to habit quests, level progression, boss raids, skill trees, and custom rewards. There are zero pay-to-win barriers or ad interruptions.',
    },
    {
      q: 'Does it work seamlessly on mobile phones and tablets?',
      a: 'Absolutely. Life-XP is fully responsive and installable as a Progressive Web App (PWA). You can pin it directly to your iOS or Android home screen with instant offline capability.',
    },
    {
      q: 'How does Email OTP Verification protect my account?',
      a: 'During registration, a secure 6-digit cryptographic confirmation code is sent to your email to verify authenticity, preventing spam accounts and ensuring your hero data stays safe.',
    },
    {
      q: 'Can I try it before creating an account?',
      a: 'Yes! Click "Instant Demo Hero" to immediately explore the realm with a pre-configured Level 3 hero, active quests, and inventory without registering.',
    },
    {
      q: 'What happens if I miss a daily habit quest?',
      a: 'World bosses counterattack during the Dawn Reset if daily quests are missed! Consistency shields your HP, maintaining your hard-earned streak and guild reputation.',
    },
  ];

  return (
    <div className="w-full text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>The Next-Gen Gamified Habit RPG</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Transform Your Daily Routine Into{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Legendary Virtual Power
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn fitness, study, and daily discipline into an epic quest. Slay procrastination bosses, unlock skill trees, and level up your real life with thousands of adventurers.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
            >
              <span>Start Your Quest Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onDemoLogin}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-slate-200 hover:border-amber-400 hover:text-white transition"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Instant Demo Hero</span>
            </button>
          </div>

          {/* Trust Social Proof Metrics */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-200">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="h-4 w-4 text-cyan-400" />
              <span><strong className="text-slate-200">12,000+</strong> Adventurers Active</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Zero Ads · 100% Free to Play</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section id="features" className="py-16 border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Epic Capabilities</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">Built for Champions of Self-Mastery</p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Every tool you need to replace procrastination with irresistible positive feedback loops.
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

      {/* How It Works */}
      <section id="how-it-works" className="py-16 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">The Habit Stacking Engine</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">How Life-XP Rewires Your Habits</p>
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

      {/* Social Proof / Testimonials */}
      <section className="py-16 border-t border-slate-900 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Guild Dispatches</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">Loved by High-Performance Adventurers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 italic mb-4">"{t.quote}"</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-amber-400/90">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 border-t border-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Need Clarity?</h2>
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
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Ready to Forge Your Legend?</h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join over 12,000 heroes turning mundane routines into unstoppable momentum. Free to play, zero credit cards required.
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
