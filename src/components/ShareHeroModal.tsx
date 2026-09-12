'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, Trophy, Flame, Swords, Share2, Copy, Check, X, Download } from 'lucide-react';
import { GamerAvatar } from './GamerAvatar';
import { soundFx } from '@/lib/sound-fx';

interface ShareHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    characterTitle?: string;
    avatar?: string;
  };
  character: {
    level: number;
    streak: number;
    bossKills?: number;
    gold: number;
    strength: number;
    intellect: number;
    vitality: number;
    agility: number;
    spirit: number;
  };
}

export const ShareHeroModal: React.FC<ShareHeroModalProps> = ({
  isOpen,
  onClose,
  user,
  character,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `⚔️ Level ${character.level} Hero in Life RPG!\n🔥 ${character.streak}-Day Discipline Streak\n🐉 ${character.bossKills || 0} Bosses Slain\nStats: STR ${character.strength} | INT ${character.intellect} | VIT ${character.vitality} | AGI ${character.agility} | SPR ${character.spirit}\n\nLevel up your real life at: https://life-rpg.realm`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    soundFx.playCoin();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-purple-500/30 bg-slate-900/95 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-purple-400 mb-4">
          <Share2 className="h-4 w-4" />
          <span>Hero Collectible Card</span>
        </div>

        {/* Card Canvas Mockup */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 shadow-xl relative overflow-hidden">
          {/* Subtle gold aura */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              SEASON 1 • REALM HERO
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              LVL {character.level}
            </span>
          </div>

          {/* Hero Avatar & Identity */}
          <div className="my-4 flex items-center space-x-4">
            <GamerAvatar
              avatarId={user.avatar}
              size="lg"
              level={character.level}
              showFrame={true}
              showLevelBadge={true}
            />
            <div>
              <h3 className="text-lg font-black text-slate-100">{user.username}</h3>
              <p className="text-xs text-amber-400 font-medium">
                {user.characterTitle || 'Realm Adventurer'}
              </p>
              <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <span className="text-orange-400 flex items-center">
                  <Flame className="h-3 w-3 mr-0.5 fill-orange-400/40" />
                  {character.streak}d Streak
                </span>
                <span>•</span>
                <span className="text-rose-400 flex items-center">
                  <Swords className="h-3 w-3 mr-0.5" />
                  {character.bossKills || 0} Slain
                </span>
              </div>
            </div>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-800/80 text-center font-mono text-[10px]">
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-1.5">
              <span className="text-red-400 font-bold block">STR</span>
              <span className="text-slate-200 font-bold text-xs">{character.strength}</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-1.5">
              <span className="text-blue-400 font-bold block">INT</span>
              <span className="text-slate-200 font-bold text-xs">{character.intellect}</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-1.5">
              <span className="text-emerald-400 font-bold block">VIT</span>
              <span className="text-slate-200 font-bold text-xs">{character.vitality}</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-1.5">
              <span className="text-amber-400 font-bold block">AGI</span>
              <span className="text-slate-200 font-bold text-xs">{character.agility}</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-1.5">
              <span className="text-purple-400 font-bold block">SPR</span>
              <span className="text-slate-200 font-bold text-xs">{character.spirit}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-purple-500/25 active:scale-95 transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Hero Stats</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
