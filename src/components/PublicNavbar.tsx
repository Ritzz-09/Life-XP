'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Menu, X, Sparkles, LogIn, UserPlus, Shield } from 'lucide-react';

interface PublicNavbarProps {
  onOpenAuth?: (tab: 'LOGIN' | 'REGISTER') => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'LOGIN' | 'REGISTER') => {
    setMobileMenuOpen(false);
    if (onOpenAuth) {
      onOpenAuth(tab);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <BrandLogo size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <Link href="/#features" className="hover:text-amber-400 transition">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-amber-400 transition">
            How It Works
          </Link>
          <Link href="/about" className="hover:text-amber-400 transition">
            Guild Lore
          </Link>
          <Link href="/faq" className="hover:text-amber-400 transition">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-amber-400 transition">
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {onOpenAuth ? (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth('LOGIN')}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-bold text-slate-200 hover:border-amber-400/60 hover:text-white transition"
              >
                <LogIn className="h-3.5 w-3.5 text-slate-400" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('REGISTER')}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join Free</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-bold text-slate-200 hover:border-amber-400/60 hover:text-white transition"
              >
                <LogIn className="h-3.5 w-3.5 text-slate-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join Free</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center space-x-2">
          {onOpenAuth ? (
            <button
              type="button"
              onClick={() => onOpenAuth('REGISTER')}
              className="rounded-lg bg-amber-500 px-2.5 py-1.5 text-[11px] font-black text-slate-950 shadow"
            >
              Join Free
            </button>
          ) : (
            <Link
              href="/register"
              className="rounded-lg bg-amber-500 px-2.5 py-1.5 text-[11px] font-black text-slate-950 shadow"
            >
              Join Free
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 py-2 text-sm font-semibold text-slate-300">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition"
            >
              Features & Quests
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition"
            >
              Guild Lore & About
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition"
            >
              Frequently Asked Questions
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-3 rounded-lg hover:bg-slate-900 hover:text-amber-400 transition"
            >
              Contact & Support
            </Link>
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
            {onOpenAuth ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('LOGIN')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-center text-xs font-bold text-slate-200"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('REGISTER')}
                  className="w-full rounded-xl bg-amber-500 py-2.5 text-center text-xs font-black text-slate-950"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-center text-xs font-bold text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-xl bg-amber-500 py-2.5 text-center text-xs font-black text-slate-950"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
