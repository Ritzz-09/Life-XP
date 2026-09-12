'use client';

import React from 'react';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY';

export interface CharacterVisualProps {
  gender?: Gender | string;
  level: number;
  mode?: 'portrait' | 'full';
  className?: string;
  showAura?: boolean;
}

export function getEvolutionStage(level: number) {
  if (level >= 10) {
    return {
      stage: 4,
      title: 'Celestial Sovereign',
      tier: 'Mythic',
      color: '#f59e0b',
      auraColor: 'rgba(245, 158, 11, 0.4)',
      bgGradient: 'from-amber-600/30 via-yellow-500/20 to-purple-600/30',
      description: 'Transcended mortal limits. Wields starlight wings and divine cosmic armor.',
      nextLevel: null,
      minLevel: 10,
    };
  }
  if (level >= 6) {
    return {
      stage: 3,
      title: 'Arcane Champion',
      tier: 'Epic',
      color: '#8b5cf6',
      auraColor: 'rgba(139, 92, 246, 0.35)',
      bgGradient: 'from-purple-600/30 via-violet-500/20 to-indigo-600/30',
      description: 'Battle-hardened master adorned in gilded armor and elemental energy.',
      nextLevel: 10,
      minLevel: 6,
    };
  }
  if (level >= 3) {
    return {
      stage: 2,
      title: 'Iron Adept',
      tier: 'Rare',
      color: '#06b6d4',
      auraColor: 'rgba(6, 182, 212, 0.3)',
      bgGradient: 'from-cyan-600/25 via-blue-500/20 to-slate-800/40',
      description: 'Equipped with forged steel plating, sharpened steel, and focused aura.',
      nextLevel: 6,
      minLevel: 3,
    };
  }
  return {
    stage: 1,
    title: 'Novice Recruit',
    tier: 'Common',
    color: '#10b981',
    auraColor: 'rgba(16, 185, 129, 0.2)',
    bgGradient: 'from-emerald-600/20 via-teal-500/15 to-slate-900/50',
    description: 'A humble aspiring adventurer starting with training gear and raw discipline.',
    nextLevel: 3,
    minLevel: 1,
  };
}

export const CharacterVisual: React.FC<CharacterVisualProps> = ({
  gender = 'MALE',
  level,
  mode = 'portrait',
  className = '',
  showAura = true,
}) => {
  const normGender: Gender =
    gender === 'FEMALE' ? 'FEMALE' : gender === 'NON_BINARY' ? 'NON_BINARY' : 'MALE';
  const stageInfo = getEvolutionStage(level);
  const stage = stageInfo.stage;

  // Visual color tokens based on stage
  const skinTone = normGender === 'FEMALE' ? '#fed7aa' : normGender === 'MALE' ? '#fcd34d' : '#fef08a';
  const hairColor =
    stage === 4
      ? '#ffffff' // Celestial white / starlight
      : stage === 3
      ? '#e2e8f0' // Silver platinum champion
      : stage === 2
      ? '#78350f' // Auburn chestnut
      : '#334155'; // Dark slate novice

  const armorPrimary =
    stage === 4
      ? '#fbbf24' // Celestial gold
      : stage === 3
      ? '#8b5cf6' // Arcane royal violet & gold
      : stage === 2
      ? '#64748b' // Forged steel
      : '#78716c'; // Rough hide / leather

  const armorSecondary =
    stage === 4
      ? '#60a5fa' // Celestial cyan light
      : stage === 3
      ? '#fbbf24' // Gold trim
      : stage === 2
      ? '#38bdf8' // Cyan crystal core
      : '#57534e'; // Brown straps

  if (mode === 'portrait') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl border transition-all duration-500 ${className}`}
        style={{
          borderColor: stageInfo.color,
          boxShadow: showAura ? `0 0 16px ${stageInfo.auraColor}` : 'none',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`bgGrad-${stage}-${normGender}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={stageInfo.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </radialGradient>
            <linearGradient id={`armorGrad-${stage}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={armorPrimary} />
              <stop offset="100%" stopColor={armorSecondary} />
            </linearGradient>
            <linearGradient id={`goldGlow`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="120" height="120" fill={`url(#bgGrad-${stage}-${normGender})`} />

          {/* Stage 4 Celestial Halo / Star Orbs */}
          {stage === 4 && (
            <g className="animate-spin-slow origin-center">
              <circle cx="60" cy="50" r="44" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
              <circle cx="60" cy="6" r="3" fill="#60a5fa" />
              <circle cx="60" cy="94" r="3" fill="#60a5fa" />
              <circle cx="16" cy="50" r="3" fill="#fde047" />
              <circle cx="104" cy="50" r="3" fill="#fde047" />
            </g>
          )}

          {/* Stage 3 Arcane Halo */}
          {stage === 3 && (
            <circle cx="60" cy="50" r="40" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7" />
          )}

          {/* Shoulders / Armor */}
          <path
            d={
              normGender === 'MALE'
                ? "M 20 120 C 22 88, 38 82, 60 82 C 82 82, 98 88, 100 120 Z"
                : normGender === 'FEMALE'
                ? "M 24 120 C 26 90, 40 84, 60 84 C 80 84, 94 90, 96 120 Z"
                : "M 22 120 C 24 89, 39 83, 60 83 C 81 83, 96 89, 98 120 Z"
            }
            fill={`url(#armorGrad-${stage})`}
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Chestplate core / emblem */}
          {stage >= 2 && (
            <polygon
              points="60,90 68,98 60,106 52,98"
              fill={stage === 4 ? "#60a5fa" : stage === 3 ? "#f59e0b" : "#38bdf8"}
              stroke="#0f172a"
              strokeWidth="1"
            />
          )}

          {/* Neck */}
          <rect x="54" y="68" width="12" height="18" fill={skinTone} rx="2" />

          {/* Head Base */}
          <ellipse
            cx="60"
            cy="54"
            rx={normGender === 'FEMALE' ? 18 : normGender === 'MALE' ? 20 : 19}
            ry={normGender === 'FEMALE' ? 22 : 23}
            fill={skinTone}
          />

          {/* Eyes */}
          <ellipse cx="53" cy="53" rx="2.5" ry="3" fill="#0f172a" />
          <ellipse cx="67" cy="53" rx="2.5" ry="3" fill="#0f172a" />
          <circle cx="54" cy="52" r="0.8" fill="#ffffff" />
          <circle cx="68" cy="52" r="0.8" fill="#ffffff" />

          {/* Eye glows for Stage 3 & 4 */}
          {stage >= 3 && (
            <>
              <circle cx="53" cy="53" r="1.5" fill={stage === 4 ? "#38bdf8" : "#c084fc"} opacity="0.9" />
              <circle cx="67" cy="53" r="1.5" fill={stage === 4 ? "#38bdf8" : "#c084fc"} opacity="0.9" />
            </>
          )}

          {/* Hair Styles based on Gender & Stage */}
          {normGender === 'MALE' && (
            <>
              {/* Short / Spiky / Heroic locks */}
              <path
                d="M 38 48 C 38 32, 50 28, 60 28 C 70 28, 82 32, 82 48 C 78 40, 68 36, 60 36 C 52 36, 42 40, 38 48 Z"
                fill={hairColor}
              />
              <polygon points="46,36 52,24 55,34" fill={hairColor} />
              <polygon points="54,34 60,22 66,34" fill={hairColor} />
              <polygon points="65,34 72,26 76,38" fill={hairColor} />
            </>
          )}

          {normGender === 'FEMALE' && (
            <>
              {/* Flowing locks / side braids */}
              <path
                d="M 36 50 C 36 30, 48 26, 60 26 C 72 26, 84 30, 84 50 C 82 66, 84 76, 86 84 C 80 80, 78 68, 78 52 C 70 42, 50 42, 42 52 C 42 68, 40 80, 34 84 C 36 76, 38 66, 36 50 Z"
                fill={hairColor}
              />
              {/* Ponytail or hair bun knot */}
              <circle cx="60" cy="22" r="7" fill={hairColor} />
            </>
          )}

          {normGender === 'NON_BINARY' && (
            <>
              {/* Sleek asymmetric side-swept locks */}
              <path
                d="M 37 49 C 37 28, 52 26, 62 26 C 76 26, 83 34, 83 48 C 74 38, 62 35, 54 36 C 46 38, 41 44, 37 49 Z"
                fill={hairColor}
              />
              <path
                d="M 37 48 C 35 62, 38 74, 40 80 C 36 72, 35 62, 36 52 Z"
                fill={hairColor}
              />
            </>
          )}

          {/* Headgear / Helmets per stage */}
          {stage === 2 && (
            // Iron circlet
            <path d="M 42 42 Q 60 38 78 42 L 78 45 Q 60 41 42 45 Z" fill="#94a3b8" stroke="#334155" strokeWidth="0.5" />
          )}

          {stage === 3 && (
            // Winged Arcane Diadem
            <g>
              <path d="M 40 42 Q 60 36 80 42 L 80 46 Q 60 40 40 46 Z" fill="url(#goldGlow)" />
              <polygon points="60,34 64,41 56,41" fill="#c084fc" />
              <polygon points="36,36 42,42 38,44" fill="url(#goldGlow)" />
              <polygon points="84,36 78,42 82,44" fill="url(#goldGlow)" />
            </g>
          )}

          {stage === 4 && (
            // Celestial Crown of Light
            <g>
              <path d="M 38 40 Q 60 34 82 40 L 82 45 Q 60 39 38 45 Z" fill="url(#goldGlow)" />
              <polygon points="60,26 65,38 55,38" fill="#fde047" stroke="#38bdf8" strokeWidth="1" />
              <polygon points="46,30 52,39 44,39" fill="url(#goldGlow)" />
              <polygon points="74,30 68,39 76,39" fill="url(#goldGlow)" />
              <circle cx="60" cy="33" r="2.5" fill="#38bdf8" />
            </g>
          )}

          {/* Stage Badge indicator */}
          <g transform="translate(4, 4)">
            <rect width="28" height="15" rx="4" fill="#020617" opacity="0.85" stroke={stageInfo.color} strokeWidth="1" />
            <text x="14" y="11" textAnchor="middle" fill={stageInfo.color} fontSize="9" fontWeight="900" fontFamily="sans-serif">
              STG {stage}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Full-body showcase mode for Hero Inspect modal
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-3xl border p-6 transition-all duration-500 overflow-hidden ${className}`}
      style={{
        borderColor: stageInfo.color,
        background: `radial-gradient(circle at 50% 30%, ${stageInfo.auraColor} 0%, rgba(15, 23, 42, 0.95) 75%)`,
        boxShadow: showAura ? `0 0 30px ${stageInfo.auraColor}` : 'none',
      }}
    >
      {/* Visual Canvas */}
      <div className="relative h-64 w-64 sm:h-72 sm:w-72">
        <svg
          viewBox="0 0 200 240"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`fullArmor-${stage}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={armorPrimary} />
              <stop offset="100%" stopColor={armorSecondary} />
            </linearGradient>
            <radialGradient id={`wingGlow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Stage 4 Celestial Starlight Wings */}
          {stage === 4 && (
            <g opacity="0.9" className="animate-pulse">
              {/* Left Wing */}
              <path
                d="M 100 90 C 70 40, 20 40, 10 70 C 5 85, 25 105, 50 115 C 30 125, 20 145, 30 160 C 45 170, 75 145, 100 130 Z"
                fill="url(#wingGlow)"
                stroke="#fde047"
                strokeWidth="1.5"
              />
              {/* Right Wing */}
              <path
                d="M 100 90 C 130 40, 180 40, 190 70 C 195 85, 175 105, 150 115 C 170 125, 180 145, 170 160 C 155 170, 125 145, 100 130 Z"
                fill="url(#wingGlow)"
                stroke="#fde047"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Stage 3 Cape */}
          {stage === 3 && (
            <path
              d="M 75 90 L 50 195 L 100 205 L 150 195 L 125 90 Z"
              fill="#581c87"
              stroke="#fbbf24"
              strokeWidth="1"
              opacity="0.85"
            />
          )}

          {/* Legs & Greaves */}
          <rect x="80" y="160" width="16" height="55" rx="4" fill={`url(#fullArmor-${stage})`} stroke="#0f172a" strokeWidth="1.5" />
          <rect x="104" y="160" width="16" height="55" rx="4" fill={`url(#fullArmor-${stage})`} stroke="#0f172a" strokeWidth="1.5" />
          {/* Boots */}
          <rect x="76" y="210" width="22" height="12" rx="3" fill="#1e293b" />
          <rect x="102" y="210" width="22" height="12" rx="3" fill="#1e293b" />

          {/* Torso & Armor */}
          <path
            d={
              normGender === 'MALE'
                ? "M 66 90 L 74 165 L 126 165 L 134 90 Z"
                : normGender === 'FEMALE'
                ? "M 70 92 L 76 165 L 124 165 L 130 92 Z"
                : "M 68 91 L 75 165 L 125 165 L 132 91 Z"
            }
            fill={`url(#fullArmor-${stage})`}
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Belt & Buckle */}
          <rect x="72" y="156" width="56" height="8" rx="2" fill="#0f172a" />
          <rect x="94" y="154" width="12" height="12" rx="2" fill={stage >= 3 ? '#f59e0b' : '#94a3b8'} />

          {/* Arms */}
          {/* Left Arm */}
          <path d="M 68 92 L 48 135 L 56 138 L 74 98 Z" fill={`url(#fullArmor-${stage})`} stroke="#1e293b" strokeWidth="1" />
          {/* Right Arm (Holding weapon) */}
          <path d="M 132 92 L 152 135 L 144 138 L 126 98 Z" fill={`url(#fullArmor-${stage})`} stroke="#1e293b" strokeWidth="1" />

          {/* Hands */}
          <circle cx="48" cy="138" r="6" fill={skinTone} />
          <circle cx="152" cy="138" r="6" fill={skinTone} />

          {/* Weapon */}
          {stage === 1 && (
            // Wooden Practice Blade
            <g transform="translate(150, 95) rotate(15)">
              <rect x="0" y="0" width="6" height="50" rx="2" fill="#78350f" />
              <rect x="-6" y="38" width="18" height="4" rx="1" fill="#451a03" />
              <rect x="1" y="42" width="4" height="12" rx="1" fill="#92400e" />
            </g>
          )}

          {stage === 2 && (
            // Forged Steel Longsword
            <g transform="translate(150, 85) rotate(15)">
              <polygon points="3,-5 7,50 -1,50" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
              <rect x="-8" y="50" width="22" height="5" rx="1" fill="#06b6d4" />
              <rect x="1" y="55" width="4" height="14" rx="1" fill="#0f172a" />
              <circle cx="3" cy="71" r="3" fill="#06b6d4" />
            </g>
          )}

          {stage === 3 && (
            // Flame Arcane Greatblade
            <g transform="translate(152, 70) rotate(15)">
              <polygon points="4,-15 10,65 -2,65" fill="#f59e0b" stroke="#dc2626" strokeWidth="1" />
              <path d="M 0 10 Q -6 25 0 45 Q 10 30 4 10 Z" fill="#ef4444" opacity="0.8" />
              <rect x="-10" y="65" width="28" height="6" rx="2" fill="#fbbf24" />
              <rect x="2" y="71" width="4" height="16" rx="1" fill="#4c1d95" />
              <circle cx="4" cy="89" r="4" fill="#fbbf24" />
            </g>
          )}

          {stage === 4 && (
            // Celestial Sovereign Starlight Blade
            <g transform="translate(152, 60) rotate(15)">
              <polygon points="5,-25 12,75 -2,75" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
              <path d="M 1 -10 Q -8 15 1 50 Q 15 25 5 -10 Z" fill="#38bdf8" opacity="0.7" />
              <rect x="-12" y="75" width="34" height="7" rx="2" fill="#fde047" stroke="#38bdf8" strokeWidth="1" />
              <rect x="3" y="82" width="4" height="18" rx="1" fill="#0369a1" />
              <circle cx="5" cy="103" r="5" fill="#fde047" stroke="#38bdf8" strokeWidth="1" />
            </g>
          )}

          {/* Shoulders / Pauldrons */}
          <circle cx="68" cy="95" r={stage >= 3 ? 14 : 10} fill={stage >= 3 ? 'url(#goldGlow)' : armorSecondary} stroke="#0f172a" strokeWidth="1" />
          <circle cx="132" cy="95" r={stage >= 3 ? 14 : 10} fill={stage >= 3 ? 'url(#goldGlow)' : armorSecondary} stroke="#0f172a" strokeWidth="1" />

          {/* Neck */}
          <rect x="94" y="70" width="12" height="18" rx="2" fill={skinTone} />

          {/* Head */}
          <ellipse cx="100" cy="56" rx={normGender === 'FEMALE' ? 18 : 20} ry={22} fill={skinTone} />

          {/* Eyes */}
          <ellipse cx="93" cy="55" rx="2.5" ry="3" fill="#0f172a" />
          <ellipse cx="107" cy="55" rx="2.5" ry="3" fill="#0f172a" />
          <circle cx="94" cy="54" r="0.8" fill="#ffffff" />
          <circle cx="108" cy="54" r="0.8" fill="#ffffff" />

          {stage >= 3 && (
            <>
              <circle cx="93" cy="55" r="1.5" fill={stage === 4 ? "#38bdf8" : "#c084fc"} />
              <circle cx="107" cy="55" r="1.5" fill={stage === 4 ? "#38bdf8" : "#c084fc"} />
            </>
          )}

          {/* Hair */}
          {normGender === 'MALE' && (
            <>
              <path
                d="M 78 50 C 78 34, 90 30, 100 30 C 110 30, 122 34, 122 50 C 118 42, 108 38, 100 38 C 92 38, 82 42, 78 50 Z"
                fill={hairColor}
              />
              <polygon points="86,38 92,26 95,36" fill={hairColor} />
              <polygon points="94,36 100,24 106,36" fill={hairColor} />
              <polygon points="105,36 112,28 116,40" fill={hairColor} />
            </>
          )}

          {normGender === 'FEMALE' && (
            <>
              <path
                d="M 76 52 C 76 32, 88 28, 100 28 C 112 28, 124 32, 124 52 C 122 68, 124 78, 126 86 C 120 82, 118 70, 118 54 C 110 44, 90 44, 82 54 C 82 70, 80 82, 74 86 C 76 78, 78 68, 76 52 Z"
                fill={hairColor}
              />
              <circle cx="100" cy="24" r="7" fill={hairColor} />
            </>
          )}

          {normGender === 'NON_BINARY' && (
            <>
              <path
                d="M 77 51 C 77 30, 92 28, 102 28 C 116 28, 123 36, 123 50 C 114 40, 102 37, 94 38 C 86 40, 81 46, 77 51 Z"
                fill={hairColor}
              />
              <path d="M 77 50 C 75 64, 78 76, 80 82 C 76 74, 75 64, 76 54 Z" fill={hairColor} />
            </>
          )}

          {/* Helmets & Crowns */}
          {stage === 2 && (
            <path d="M 82 44 Q 100 40 118 44 L 118 47 Q 100 43 82 47 Z" fill="#94a3b8" stroke="#334155" strokeWidth="0.5" />
          )}

          {stage === 3 && (
            <g>
              <path d="M 80 44 Q 100 38 120 44 L 120 48 Q 100 42 80 48 Z" fill="url(#goldGlow)" />
              <polygon points="100,36 104,43 96,43" fill="#c084fc" />
              <polygon points="76,38 82,44 78,46" fill="url(#goldGlow)" />
              <polygon points="124,38 118,44 122,46" fill="url(#goldGlow)" />
            </g>
          )}

          {stage === 4 && (
            <g>
              <path d="M 78 42 Q 100 36 122 42 L 122 47 Q 100 41 78 47 Z" fill="url(#goldGlow)" />
              <polygon points="100,26 106,40 94,40" fill="#fde047" stroke="#38bdf8" strokeWidth="1" />
              <polygon points="86,32 92,41 84,41" fill="url(#goldGlow)" />
              <polygon points="114,32 108,41 116,41" fill="url(#goldGlow)" />
              <circle cx="100" cy="35" r="3" fill="#38bdf8" />
            </g>
          )}
        </svg>
      </div>

      {/* Stage Title and Evolution Tag */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span
            className="rounded-lg px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow"
            style={{ backgroundColor: stageInfo.color }}
          >
            Stage {stage} • {stageInfo.tier}
          </span>
          <span className="text-xs font-bold text-slate-400 capitalize">
            {normGender.toLowerCase()} hero
          </span>
        </div>
        <h3 className="mt-2 text-xl font-black text-slate-100 sm:text-2xl">
          {stageInfo.title}
        </h3>
        <p className="mt-1 text-xs text-slate-300 max-w-xs mx-auto">
          {stageInfo.description}
        </p>

        {stageInfo.nextLevel ? (
          <div className="mt-3 text-[11px] font-semibold text-amber-400">
            Next Evolution unlocks at <span className="font-black text-amber-300">Level {stageInfo.nextLevel}</span>
          </div>
        ) : (
          <div className="mt-3 text-[11px] font-black tracking-wider uppercase text-yellow-400">
            ✦ Maximum Ascension Reached ✦
          </div>
        )}
      </div>
    </div>
  );
};
