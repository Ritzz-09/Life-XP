import React from 'react';
import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { Lock, ShieldCheck, EyeOff, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Life-XP',
  description: 'Life-XP values your privacy. Learn how we safeguard your adventurer data with encryption and zero third-party ads.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-bg-overlay">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:py-20 w-full">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-300 mb-4">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Data Sanctuary Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Last updated: September 13, 2026 · Effective across all Life-XP realms
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed backdrop-blur-xl">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <span>1. Our Core Privacy Commitment</span>
            </h2>
            <p>
              At Life-XP, your personal discipline and self-mastery journey are private. We operate with a strict **Zero-Surveillance** ethos: we do not sell your personal data, we do not inject invasive advertising beacons, and we never share your quest titles with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Database className="h-5 w-5 text-cyan-400" />
              <span>2. Information We Collect</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li><strong>Account Credentials:</strong> Hero name, email address, and cryptographically hashed passwords (salted with bcrypt).</li>
              <li><strong>Gameplay Progress:</strong> Quests created/completed, XP, gold, level progression, inventory items, and streak counts.</li>
              <li><strong>Authentication Artifacts:</strong> Cryptographically signed HTTP-only session cookies and ephemeral 5-minute OTP tokens.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <EyeOff className="h-5 w-5 text-rose-400" />
              <span>3. How We Safeguard Your Information</span>
            </h2>
            <p>
              All communication between your browser and our servers is secured over TLS/HTTPS with modern cipher suites. Authentication tokens are stored inside HttpOnly, SameSite cookies to protect against Cross-Site Scripting (XSS).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white">
              4. Your Rights (GDPR & CCPA Compliant)
            </h2>
            <p>
              You maintain total ownership over your data. At any time, you can request an export of your quest history or invoke the "Right to be Forgotten" by contacting our Data Protection Officer at <span className="text-amber-400 font-mono">support@life-xp.game</span>. All account data will be permanently wiped within 7 days.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
