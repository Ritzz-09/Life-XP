'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, ShieldAlert, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 cyber-bg-overlay relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        {/* 404 Hologram Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 ring-4 ring-cyan-500/10 animate-pulse">
            <Compass className="h-10 w-10 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              Anomaly 404 • Void Breach
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
              Lost in the Nether Void
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              The coordinates you are seeking have collapsed into the ethereal abyss. Re-calibrate your compass and return to the realm sanctuary.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
            >
              <Home className="h-4 w-4 stroke-[2.5]" />
              <span>Return to Sanctuary</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
