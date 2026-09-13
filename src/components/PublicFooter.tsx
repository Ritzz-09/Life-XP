'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Shield, Sparkles, Heart, MessageSquare, Compass, HelpCircle, FileText, Lock } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand & Lore */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              The next-generation gamified habit RPG. Transform real-world exercise, study, and daily discipline into heroic stats, legendary gear, and epic boss victories.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Realm Servers 100% Operational</span>
            </div>
          </div>

          {/* Col 2: Product & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Adventures</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#features" className="hover:text-amber-400 transition">
                  Habit Quests
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-amber-400 transition">
                  Raid Boss Battles
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-amber-400 transition">
                  Skill Tree Evolution
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-amber-400 transition">
                  Focus Pomodoro
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-amber-400 transition">
                  Armory & Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Lore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Guild</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">
                  About Life-XP
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition">
                  Adventurer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Sanctuary</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="/.well-known/security.txt" className="hover:text-amber-400 transition">
                  Security Disclosure
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-amber-400 transition">
                  Sitemap XML
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-900 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Life-XP Realm. All rights reserved. Built for champions of self-mastery.</p>
          <div className="mt-4 flex items-center space-x-6 sm:mt-0">
            <Link href="/privacy" className="hover:text-slate-400 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition">
              Help Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
