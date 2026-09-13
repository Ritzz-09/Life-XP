'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { HelpCircle, ChevronDown, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'GAMEPLAY' | 'TECHNICAL' | 'COMMUNITY'>('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'GAMEPLAY',
      q: 'How do habit quests convert into EXP and Gold?',
      a: 'Every quest is assigned a difficulty level (Trivial, Easy, Medium, Hard). Completing higher difficulty quests rewards significantly more XP and Gold. Maintaining a continuous daily streak applies a streak multiplier to all rewards!',
    },
    {
      category: 'GAMEPLAY',
      q: 'How does the World Boss fight work?',
      a: 'A fearsome world boss (such as Chronicus or Lord Procrastor) is active in the realm. Every time you complete a quest, you deal physical or magical damage to the boss based on your strength and intellect attributes. When the boss falls, you claim a legendary Loot Chest!',
    },
    {
      category: 'GAMEPLAY',
      q: 'What are custom rewards in the Armory?',
      a: 'You can create your own real-life rewards (e.g. 1 hour of video games, favorite specialty coffee, weekend movie) and set a gold price. When you accumulate enough gold through real productivity, you redeem it guilt-free!',
    },
    {
      category: 'TECHNICAL',
      q: 'Can I install Life-XP as a mobile app on my phone?',
      a: 'Yes! Life-XP is a fully functional Progressive Web App (PWA). On iOS Safari, tap the Share button and select "Add to Home Screen". On Android Chrome, tap the menu and select "Install App".',
    },
    {
      category: 'TECHNICAL',
      q: 'How is my account data secured?',
      a: 'All passwords are salted and hashed with bcrypt. Email OTP 2FA protects your login and registration. We do not sell data or inject advertising tracking scripts.',
    },
    {
      category: 'COMMUNITY',
      q: 'Can I play with friends in a Guild Party?',
      a: 'Yes! Use the Party Hub to create or join a party using an invite code. Party members share a collective raid boss fight and can cheer each other\'s streaks in the real-time party activity log.',
    },
    {
      category: 'COMMUNITY',
      q: 'How do I submit feedback or feature requests?',
      a: 'Visit our Contact page or join the community Discord. We ship weekly community-voted features and game balancing adjustments.',
    },
  ];

  const filtered = faqs.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-bg-overlay">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:py-20 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-bold text-cyan-300 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Find immediate answers on mechanics, account security, and leveling your real-world discipline.
          </p>

          {/* Search Input */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search questions (e.g. boss, mobile, gold)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none shadow-inner"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {(['ALL', 'GAMEPLAY', 'TECHNICAL', 'COMMUNITY'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
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
            })
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-500">
              No matching questions found for "{search}". Try another term or contact support!
            </div>
          )}
        </div>

        {/* Support Help Card */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <h3 className="text-sm font-bold text-white">Still have questions?</h3>
          <p className="mt-1 text-xs text-slate-400">
            Our guild support council is always ready to assist your journey.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            Contact Support & Dispatch Query
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
