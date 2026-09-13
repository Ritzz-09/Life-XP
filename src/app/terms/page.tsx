import React from 'react';
import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { Scroll, Shield, Award, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Life-XP',
  description: 'Life-XP Terms of Service and Adventurer Guild Code of Conduct.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-bg-overlay">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:py-20 w-full">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300 mb-4">
            <Scroll className="h-3.5 w-3.5 text-amber-400" />
            <span>Guild Code of Conduct</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Last updated: September 13, 2026 · The Guild Covenant
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed backdrop-blur-xl">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing the Life-XP realm (website, PWA, or related subdomains), you agree to be bound by these Terms of Service. If you disagree with any portion of this covenant, your access to guild services is voluntarily relinquished.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Award className="h-5 w-5 text-cyan-400" />
              <span>2. Guild Fair Play & Community Respect</span>
            </h2>
            <p>
              Life-XP is built to foster supportive personal development. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>Use automated scripts or bots to manipulate boss raid damage or leaderboard rankings.</li>
              <li>Harass, intimidate, or post offensive content within Party Hub chat and activity logs.</li>
              <li>Attempt to reverse-engineer or compromise server infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-purple-400" />
              <span>3. Account Ownership & Security</span>
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account password and the OTP verification codes dispatched to your email address. Life-XP cannot be held liable for any loss arising from unauthorized credentials sharing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white">
              4. Contact and Dispute Resolution
            </h2>
            <p>
              Questions regarding these Terms should be dispatched to <span className="text-amber-400 font-mono">support@life-xp.game</span>. Any disputes will be resolved amicably through good-faith dialogue.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
