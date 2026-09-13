'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
}) => {
  const iconDimensions =
    size === 'sm'
      ? { w: 32, h: 32 }
      : size === 'lg'
      ? { w: 64, h: 64 }
      : { w: 42, h: 42 };

  const textSize =
    size === 'sm'
      ? 'text-base'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : 'text-lg sm:text-xl';

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Glowing SVG Brand Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
        >
          <defs>
            <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="shieldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="darkPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#060b13" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Aegis Diamond Shield */}
          <path
            d="M 50,8 L 84,24 C 84,60 50,88 50,92 C 50,88 16,60 16,24 Z"
            fill="url(#darkPlate)"
            stroke="url(#shieldGold)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Cyan Arc Rune */}
          <path
            d="M 50,18 L 76,30 C 76,58 50,78 50,80 C 50,78 24,58 24,30 Z"
            fill="none"
            stroke="url(#shieldCyan)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.8"
          />

          {/* Lightning / Energy Crystal Core */}
          <path
            d="M 54,24 L 38,50 L 51,50 L 46,72 L 64,44 L 51,44 Z"
            fill="url(#shieldGold)"
            filter="url(#logoGlow)"
          />

          {/* Center Energy Star Core */}
          <circle cx="50" cy="48" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant === 'full' && (
        <div className="flex items-center font-black tracking-wider leading-none">
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 font-extrabold ${textSize}`}
          >
            LIFE
          </span>
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 font-black ${textSize}`}
          >
            -XP
          </span>
          <span className="ml-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-cyan-300">
            RPG
          </span>
        </div>
      )}
    </div>
  );
};
