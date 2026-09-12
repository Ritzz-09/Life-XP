'use client';

import React from 'react';
import { getAvatarById, getFrameTier, AvatarFrameTier } from '@/lib/avatar-data';

interface GamerAvatarProps {
  avatarId?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  level?: number;
  showFrame?: boolean;
  showLevelBadge?: boolean;
  showOnlineDot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GamerAvatar: React.FC<GamerAvatarProps> = ({
  avatarId = 'crimson-avenger',
  size = 'md',
  level = 1,
  showFrame = true,
  showLevelBadge = false,
  showOnlineDot = false,
  className = '',
  onClick,
}) => {
  const avatar = getAvatarById(avatarId);
  const frameTier: AvatarFrameTier = getFrameTier(level);

  // Size dimensions
  const sizeMap = {
    xs: { container: 'h-6 w-6', badge: 'text-[8px] px-1 -bottom-1 -right-1', dot: 'h-1.5 w-1.5' },
    sm: { container: 'h-8 w-8', badge: 'text-[9px] px-1 -bottom-1 -right-1', dot: 'h-2 w-2' },
    md: { container: 'h-10 w-10', badge: 'text-[10px] px-1.5 -bottom-1.5 -right-1.5', dot: 'h-2.5 w-2.5' },
    lg: { container: 'h-14 w-14', badge: 'text-[10px] px-1.5 -bottom-1.5 -right-1.5', dot: 'h-3 w-3' },
    xl: { container: 'h-18 w-18', badge: 'text-xs px-2 -bottom-2 -right-2', dot: 'h-3.5 w-3.5' },
    '2xl': { container: 'h-24 w-24', badge: 'text-xs px-2 -bottom-2 -right-2', dot: 'h-4 w-4' },
    hero: { container: 'h-32 w-32', badge: 'text-sm px-2.5 py-0.5 -bottom-2.5 -right-2.5', dot: 'h-5 w-5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Frame borders based on prestige tier
  const frameStyles: Record<AvatarFrameTier, string> = {
    BRONZE: 'ring-2 ring-amber-700/60 shadow-md shadow-amber-950/30',
    SILVER: 'ring-2 ring-sky-400/80 shadow-md shadow-sky-500/25',
    GOLD: 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/35 animate-pulse-subtle',
    DIAMOND: 'ring-2 ring-purple-400 shadow-xl shadow-purple-500/40 ring-offset-1 ring-offset-slate-950',
    CYBER_PRISM: 'ring-2 ring-rose-400 shadow-2xl shadow-rose-500/50 ring-offset-2 ring-offset-slate-950 animate-pulse',
  };

  // Dedicated SVG Vector Graphics for each Avatar
  const renderAvatarGraphics = () => {
    switch (avatar.id) {
      // --- SUPERHEROES ---
      case 'crimson-avenger':
        return (
          <g>
            <defs>
              <linearGradient id="ca-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
              <linearGradient id="ca-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="26" fill="url(#ca-bg)" />
            {/* Hero Cowl */}
            <path d="M28 26 C28 26, 50 18, 72 26 C75 48, 72 70, 50 82 C28 70, 25 48, 28 26 Z" fill="url(#ca-metal)" />
            {/* Forehead crest */}
            <path d="M50 20 L58 36 L50 32 L42 36 Z" fill="#fca5a5" />
            {/* Cyber eyes */}
            <path d="M35 44 L46 48 L37 51 Z" fill="#ffffff" filter="drop-shadow(0 0 4px #fca5a5)" />
            <path d="M65 44 L54 48 L63 51 Z" fill="#ffffff" filter="drop-shadow(0 0 4px #fca5a5)" />
            {/* Jaw guard */}
            <path d="M42 64 L50 68 L58 64 L50 72 Z" fill="#18181b" />
          </g>
        );

      case 'valkyrie-ascendant':
        return (
          <g>
            <defs>
              <linearGradient id="va-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="va-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="26" fill="url(#va-bg)" />
            {/* Valkyrie Wings */}
            <path d="M16 42 C14 26, 32 30, 42 42 C30 46, 20 54, 16 42 Z" fill="url(#va-gold)" />
            <path d="M84 42 C86 26, 68 30, 58 42 C70 46, 80 54, 84 42 Z" fill="url(#va-gold)" />
            {/* Headpiece */}
            <path d="M34 32 C34 32, 50 24, 66 32 C68 52, 64 68, 50 78 C36 68, 32 52, 34 32 Z" fill="#1e293b" />
            <path d="M50 26 L56 38 L50 35 L44 38 Z" fill="url(#va-gold)" />
            {/* Eyes */}
            <ellipse cx="43" cy="48" rx="5" ry="2" fill="#38bdf8" />
            <ellipse cx="57" cy="48" rx="5" ry="2" fill="#38bdf8" />
            {/* Golden circlet */}
            <path d="M36 40 Q50 44 64 40" stroke="url(#va-gold)" strokeWidth="2.5" fill="none" />
          </g>
        );

      case 'shadow-vigilante':
        return (
          <g>
            <defs>
              <linearGradient id="sv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="26" fill="url(#sv-bg)" />
            {/* Bat Cowl with Horns */}
            <path d="M26 16 L34 38 C40 36, 60 36, 66 38 L74 16 C76 46, 72 74, 50 82 C28 74, 24 46, 26 16 Z" fill="#0f172a" stroke="#4338ca" strokeWidth="1.5" />
            {/* Cyan Eye Slits */}
            <path d="M37 46 L46 48 L38 52 Z" fill="#22d3ee" filter="drop-shadow(0 0 6px #22d3ee)" />
            <path d="M63 46 L54 48 L62 52 Z" fill="#22d3ee" filter="drop-shadow(0 0 6px #22d3ee)" />
            {/* Tactical mouth plate */}
            <path d="M44 66 L50 64 L56 66 L50 72 Z" fill="#312e81" />
          </g>
        );

      case 'solar-paragon':
        return (
          <g>
            <defs>
              <radialGradient id="sp-sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" rx="26" fill="#1c1917" />
            {/* Solar Halo Rays */}
            <circle cx="50" cy="50" r="32" fill="url(#sp-sun)" opacity="0.3" filter="blur(4px)" />
            <path d="M50 14 L53 26 L47 26 Z M50 86 L53 74 L47 74 Z M14 50 L26 53 L26 47 Z M86 50 L74 53 L74 47 Z" fill="#facc15" />
            {/* Noble Gold Mask */}
            <path d="M32 30 C32 30, 50 22, 68 30 C72 50, 68 70, 50 80 C32 70, 28 50, 32 30 Z" fill="#ca8a04" />
            <circle cx="50" cy="40" r="5" fill="#fef08a" />
            {/* Pure Light Visor */}
            <path d="M36 48 Q50 54 64 48 L62 53 Q50 58 38 53 Z" fill="#ffffff" filter="drop-shadow(0 0 5px #fef08a)" />
          </g>
        );

      // --- CYBERPUNK & TECH ---
      case 'cyber-ninja':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#042f2e" />
            {/* Carbon Hood */}
            <path d="M26 24 C30 18, 70 18, 74 24 C78 50, 74 72, 50 82 C26 72, 22 50, 26 24 Z" fill="#0f172a" />
            {/* Neon Visor */}
            <path d="M28 42 Q50 48 72 42 L70 48 Q50 56 30 48 Z" fill="#06b6d4" filter="drop-shadow(0 0 6px #06b6d4)" />
            {/* Tech Rebreather Grid */}
            <rect x="42" y="60" width="16" height="3" rx="1.5" fill="#14b8a6" />
            <rect x="45" y="66" width="10" height="2.5" rx="1" fill="#14b8a6" />
            {/* Forehead Oni Mark */}
            <path d="M50 26 L54 32 L46 32 Z" fill="#06b6d4" />
          </g>
        );

      case 'glitch-runner':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#18181b" />
            {/* Chromatic Shifting Visor */}
            <rect x="22" y="38" width="56" height="14" rx="4" fill="#ec4899" filter="drop-shadow(2px 0 4px #06b6d4)" />
            <rect x="24" y="40" width="52" height="10" rx="3" fill="#f43f5e" />
            <line x1="26" y1="45" x2="74" y2="45" stroke="#ffffff" strokeWidth="2" strokeDasharray="6,3" />
            {/* Cyber audio headset */}
            <rect x="16" y="34" width="8" height="24" rx="3" fill="#3f3f46" />
            <rect x="76" y="34" width="8" height="24" rx="3" fill="#3f3f46" />
            {/* Tech collar */}
            <path d="M30 68 L50 78 L70 68 L64 82 L36 82 Z" fill="#27272a" />
          </g>
        );

      case 'netrunner-ghost':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#022c22" />
            {/* Matrix Digital Lines */}
            <circle cx="50" cy="48" r="28" fill="#064e3b" />
            <line x1="32" y1="48" x2="68" y2="48" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="50" y1="30" x2="50" y2="66" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
            {/* Bionic Optical Monocle */}
            <circle cx="42" cy="46" r="9" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
            <circle cx="42" cy="46" r="4" fill="#a7f3d0" filter="drop-shadow(0 0 5px #10b981)" />
            {/* Organic Eye */}
            <ellipse cx="60" cy="46" rx="6" ry="3" fill="#10b981" />
            {/* Face circuit traces */}
            <path d="M42 56 L42 66 L52 66" stroke="#34d399" strokeWidth="1.5" fill="none" />
            <path d="M60 52 L60 62 L54 66" stroke="#34d399" strokeWidth="1.5" fill="none" />
          </g>
        );

      case 'mech-colossus':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#0f172a" />
            {/* Heavy Armored Mech Head */}
            <path d="M26 30 L40 20 L60 20 L74 30 L70 64 L50 78 L30 64 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            {/* Triple Optics */}
            <circle cx="42" cy="42" r="4" fill="#60a5fa" filter="drop-shadow(0 0 4px #3b82f6)" />
            <circle cx="58" cy="42" r="4" fill="#60a5fa" filter="drop-shadow(0 0 4px #3b82f6)" />
            <circle cx="50" cy="34" r="3" fill="#93c5fd" />
            {/* Heavy Hydraulic Grill */}
            <rect x="38" y="56" width="24" height="4" rx="1" fill="#334155" />
            <rect x="42" y="63" width="16" height="3" rx="1" fill="#334155" />
          </g>
        );

      // --- FANTASY RPG ---
      case 'warrior':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#1e293b" />
            {/* Iron Greathelm */}
            <path d="M30 30 C30 20, 70 20, 70 30 L72 58 L50 78 L28 58 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Brass Cross Visor */}
            <rect x="32" y="44" width="36" height="6" rx="1.5" fill="#0f172a" />
            <rect x="47" y="32" width="6" height="32" rx="1.5" fill="#0f172a" />
            {/* Glimmering warrior eyes */}
            <circle cx="42" cy="47" r="1.5" fill="#f8fafc" />
            <circle cx="58" cy="47" r="1.5" fill="#f8fafc" />
          </g>
        );

      case 'dragon-slayer':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#450a0a" />
            {/* Curved Dragon Horns */}
            <path d="M26 34 C16 18, 30 10, 36 24" stroke="#f87171" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M74 34 C84 18, 70 10, 64 24" stroke="#f87171" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Scaleplate Sallet */}
            <path d="M32 26 C32 26, 50 18, 68 26 C72 48, 68 68, 50 78 C32 68, 28 48, 32 26 Z" fill="#991b1b" />
            {/* Burning Dragon Eyes */}
            <path d="M36 46 L46 48 L38 52 Z" fill="#fbbf24" filter="drop-shadow(0 0 5px #f59e0b)" />
            <path d="M64 46 L54 48 L62 52 Z" fill="#fbbf24" filter="drop-shadow(0 0 5px #f59e0b)" />
            {/* Fang Grille */}
            <path d="M42 64 L46 60 L50 64 L54 60 L58 64" stroke="#fecaca" strokeWidth="2" fill="none" />
          </g>
        );

      case 'arcane-sorcerer':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#2e1065" />
            {/* Deep Mystic Hood */}
            <path d="M24 24 C28 14, 72 14, 76 24 C80 54, 76 74, 50 84 C24 74, 20 54, 24 24 Z" fill="#4c1d95" />
            {/* Shrouded Face */}
            <path d="M34 36 C38 32, 62 32, 66 36 C68 54, 62 68, 50 74 C38 68, 32 54, 34 36 Z" fill="#09090b" />
            {/* Mystic Forehead Rune */}
            <circle cx="50" cy="38" r="3" fill="#c084fc" filter="drop-shadow(0 0 4px #a855f7)" />
            {/* Glowing Violet Orbs */}
            <circle cx="42" cy="50" r="3.5" fill="#e9d5ff" filter="drop-shadow(0 0 6px #c084fc)" />
            <circle cx="58" cy="50" r="3.5" fill="#e9d5ff" filter="drop-shadow(0 0 6px #c084fc)" />
          </g>
        );

      case 'holy-paladin':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#451a03" />
            {/* Silver Plate with Gold Inlay */}
            <path d="M30 26 C30 18, 70 18, 70 26 C74 52, 68 70, 50 80 C32 70, 26 52, 30 26 Z" fill="#e2e8f0" stroke="#f59e0b" strokeWidth="2" />
            {/* Sunburst Crest */}
            <path d="M50 20 L55 30 L50 28 L45 30 Z" fill="#f59e0b" />
            {/* Holy Sapphire Slits */}
            <ellipse cx="43" cy="46" rx="5" ry="2" fill="#0284c7" filter="drop-shadow(0 0 4px #38bdf8)" />
            <ellipse cx="57" cy="46" rx="5" ry="2" fill="#0284c7" filter="drop-shadow(0 0 4px #38bdf8)" />
            {/* Cross on cheek guard */}
            <path d="M47 62 H53 M50 59 V65" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      // --- MYTHIC BEASTS & GODS ---
      case 'phoenix-empress':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#431407" />
            {/* Crown of Feathers */}
            <path d="M50 14 L55 30 L45 30 Z" fill="#f97316" />
            <path d="M36 20 L44 32 L38 34 Z" fill="#ea580c" />
            <path d="M64 20 L56 32 L62 34 Z" fill="#ea580c" />
            {/* Regal Mask */}
            <path d="M32 34 C32 34, 50 28, 68 34 C70 52, 66 68, 50 78 C34 68, 30 52, 32 34 Z" fill="#7c2d12" />
            {/* Solar Amber Eyes */}
            <ellipse cx="42" cy="48" rx="5" ry="2" fill="#fef08a" filter="drop-shadow(0 0 5px #fbbf24)" />
            <ellipse cx="58" cy="48" rx="5" ry="2" fill="#fef08a" filter="drop-shadow(0 0 5px #fbbf24)" />
            {/* Phoenix Beak */}
            <path d="M47 56 L53 56 L50 66 Z" fill="#f97316" />
          </g>
        );

      case 'void-reaper':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#0f051d" />
            {/* Horned Shadow Mask */}
            <path d="M22 18 C28 26, 32 34, 34 38 C42 34, 58 34, 66 38 C68 34, 72 26, 78 18 C78 50, 72 74, 50 84 C28 74, 22 50, 22 18 Z" fill="#1e1035" stroke="#a855f7" strokeWidth="1.5" />
            {/* Nebula Fog Slits */}
            <path d="M36 48 Q44 50 48 46" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0 0 6px #d8b4fe)" />
            <path d="M64 48 Q56 50 52 46" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0 0 6px #d8b4fe)" />
            {/* Starlight Constellation */}
            <circle cx="50" cy="30" r="2" fill="#ffffff" />
            <circle cx="44" cy="66" r="1.5" fill="#ffffff" />
            <circle cx="56" cy="66" r="1.5" fill="#ffffff" />
          </g>
        );

      case 'celestial-griffin':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#082f49" />
            {/* Griffin Plumed Helm */}
            <path d="M30 30 C30 20, 70 20, 70 30 C74 50, 70 70, 50 80 C30 70, 26 50, 30 30 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Sharp Griffin Crest */}
            <path d="M50 16 L54 28 L46 28 Z" fill="#e0f2fe" />
            {/* Piercing Emerald Eyes */}
            <ellipse cx="42" cy="46" rx="5" ry="2" fill="#34d399" filter="drop-shadow(0 0 5px #10b981)" />
            <ellipse cx="58" cy="46" rx="5" ry="2" fill="#34d399" filter="drop-shadow(0 0 5px #10b981)" />
            {/* Golden Beak Guard */}
            <path d="M46 54 L54 54 L50 68 Z" fill="#facc15" />
          </g>
        );

      case 'cosmic-titan':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#1f1128" />
            {/* Cosmic Orbital Ring */}
            <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="#f472b6" strokeWidth="2.5" transform="rotate(-25 50 50)" filter="drop-shadow(0 0 6px #f43f5e)" />
            {/* Stellar God Face */}
            <circle cx="50" cy="48" r="24" fill="#831843" stroke="#fda4af" strokeWidth="1.5" />
            {/* Third Eye */}
            <circle cx="50" cy="36" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px #f43f5e)" />
            {/* Twin Starlight Gaze */}
            <circle cx="43" cy="48" r="3" fill="#ffffff" filter="drop-shadow(0 0 5px #f472b6)" />
            <circle cx="57" cy="48" r="3" fill="#ffffff" filter="drop-shadow(0 0 5px #f472b6)" />
          </g>
        );

      // --- ANIME & RETRO GAMING ---
      case 'pixel-hero':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#052e16" />
            {/* 8-Bit Pixel Blocks Helmet */}
            <rect x="30" y="24" width="40" height="10" fill="#22c55e" />
            <rect x="24" y="34" width="52" height="24" fill="#16a34a" />
            <rect x="32" y="58" width="36" height="16" fill="#15803d" />
            {/* 8-Bit Pixel Eyes */}
            <rect x="36" y="42" width="8" height="6" fill="#ffffff" />
            <rect x="56" y="42" width="8" height="6" fill="#ffffff" />
            {/* Pixel Nose & Mouth */}
            <rect x="46" y="50" width="8" height="4" fill="#052e16" />
            <rect x="42" y="64" width="16" height="4" fill="#facc15" />
          </g>
        );

      case 'kitsune-blade':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#042f2e" />
            {/* Fox Ears */}
            <polygon points="26,38 34,14 44,32" fill="#e2e8f0" stroke="#f43f5e" strokeWidth="2" />
            <polygon points="74,38 66,14 56,32" fill="#e2e8f0" stroke="#f43f5e" strokeWidth="2" />
            {/* Kitsune Mask */}
            <path d="M28 36 C28 36, 50 30, 72 36 C76 56, 68 74, 50 82 C32 74, 24 56, 28 36 Z" fill="#f8fafc" />
            {/* Red Shinto Markings */}
            <path d="M34 46 Q40 40 44 48" stroke="#e11d48" strokeWidth="2.5" fill="none" />
            <path d="M66 46 Q60 40 56 48" stroke="#e11d48" strokeWidth="2.5" fill="none" />
            {/* Fox Slit Eyes */}
            <path d="M38 52 Q44 50 46 54" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            <path d="M62 52 Q56 50 54 54" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            {/* Small black fox nose */}
            <polygon points="48,64 52,64 50,67" fill="#0f172a" />
          </g>
        );

      case 'demon-hunter':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#3f0713" />
            {/* Oni Horns */}
            <path d="M30 30 C20 12, 34 8, 38 22" fill="#be123c" stroke="#fda4af" strokeWidth="1" />
            <path d="M70 30 C80 12, 66 8, 62 22" fill="#be123c" stroke="#fda4af" strokeWidth="1" />
            {/* Oni Mask */}
            <path d="M28 28 C28 28, 50 22, 72 28 C76 50, 72 72, 50 82 C28 72, 24 50, 28 28 Z" fill="#881337" />
            {/* Piercing Demon Eyes */}
            <circle cx="40" cy="46" r="4.5" fill="#fef08a" filter="drop-shadow(0 0 5px #facc15)" />
            <circle cx="60" cy="46" r="4.5" fill="#fef08a" filter="drop-shadow(0 0 5px #facc15)" />
            {/* Fangs */}
            <polygon points="42,66 45,58 48,66" fill="#f8fafc" />
            <polygon points="52,66 55,58 58,66" fill="#f8fafc" />
          </g>
        );

      case 'arcade-brawler':
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#292524" />
            {/* Fighting Headband */}
            <rect x="22" y="32" width="56" height="10" rx="2" fill="#dc2626" />
            <path d="M22 36 L12 44 L16 52 L22 42 Z" fill="#b91c1c" />
            {/* Determined Anime Face */}
            <path d="M30 40 C30 40, 50 36, 70 40 C72 58, 68 72, 50 80 C32 72, 28 58, 30 40 Z" fill="#d97706" />
            {/* Fierce Eyes */}
            <path d="M38 48 L46 51 L40 54 Z" fill="#ffffff" />
            <circle cx="43" cy="51" r="1.5" fill="#0f172a" />
            <path d="M62 48 L54 51 L60 54 Z" fill="#ffffff" />
            <circle cx="57" cy="51" r="1.5" fill="#0f172a" />
            {/* Gritted teeth */}
            <rect x="44" y="66" width="12" height="4" rx="1" fill="#fef3c7" stroke="#78350f" strokeWidth="1" />
          </g>
        );

      default:
        // Default fallback (Crimson Avenger style)
        return (
          <g>
            <rect width="100" height="100" rx="26" fill="#1e293b" />
            <path d="M30 26 C30 18, 70 18, 70 26 C74 52, 68 70, 50 80 C32 70, 26 52, 30 26 Z" fill="#475569" />
            <ellipse cx="43" cy="46" rx="5" ry="2" fill="#38bdf8" />
            <ellipse cx="57" cy="46" rx="5" ry="2" fill="#38bdf8" />
          </g>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${currentSize.container} ${
        onClick ? 'cursor-pointer transition-transform hover:scale-105 active:scale-95' : ''
      } ${className}`}
      title={`${avatar.name} - ${avatar.title}`}
    >
      {/* Dynamic Gamer Frame Ring */}
      <div
        className={`w-full h-full rounded-2xl overflow-hidden transition-all duration-300 ${
          showFrame ? frameStyles[frameTier] : ''
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {renderAvatarGraphics()}
        </svg>
      </div>

      {/* Online / Battle-Ready Dot Indicator */}
      {showOnlineDot && (
        <span
          className={`absolute top-0 right-0 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-sm ${currentSize.dot}`}
          title="Battle Ready"
        />
      )}

      {/* Level / Prestige Badge Overlay */}
      {showLevelBadge && (
        <span
          className={`absolute flex items-center justify-center rounded-md border font-black shadow-md ${
            frameTier === 'CYBER_PRISM'
              ? 'border-rose-400 bg-rose-500 text-white'
              : frameTier === 'DIAMOND'
              ? 'border-purple-400 bg-purple-600 text-white'
              : frameTier === 'GOLD'
              ? 'border-amber-400 bg-amber-500 text-slate-950'
              : frameTier === 'SILVER'
              ? 'border-sky-400 bg-sky-600 text-white'
              : 'border-slate-600 bg-slate-800 text-slate-200'
          } ${currentSize.badge}`}
        >
          L{level}
        </span>
      )}
    </div>
  );
};
