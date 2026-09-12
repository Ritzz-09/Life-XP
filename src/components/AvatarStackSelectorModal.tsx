'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Lock,
  Sparkles,
  Shield,
  Zap,
  Swords,
  Flame,
  Award,
  Filter,
} from 'lucide-react';
import {
  GAME_AVATARS,
  GAME_AVATAR_CATEGORIES,
  RARITY_CONFIG,
  getAvatarById,
  isAvatarUnlocked,
  AvatarCategory,
  GameAvatar,
} from '@/lib/avatar-data';
import { GamerAvatar } from './GamerAvatar';
import { soundFx } from '@/lib/sound-fx';
import { fireQuestConfetti } from '@/lib/confetti';

interface AvatarStackSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarId?: string;
  user?: {
    id: string;
    username: string;
    characterTitle?: string;
  } | null;
  character?: {
    level: number;
    streak: number;
    bossKills?: number;
  } | null;
  onAvatarEquipped: (newAvatarId: string) => void;
}

export const AvatarStackSelectorModal: React.FC<AvatarStackSelectorModalProps> = ({
  isOpen,
  onClose,
  currentAvatarId = 'crimson-avenger',
  user,
  character,
  onAvatarEquipped,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AvatarCategory>('ALL');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(currentAvatarId);
  const [unlockedOnly, setUnlockedOnly] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const inspectedAvatar: GameAvatar = getAvatarById(selectedAvatarId);
  const isInspectedUnlocked = isAvatarUnlocked(inspectedAvatar, character);
  const isCurrentlyEquipped = currentAvatarId.toLowerCase() === inspectedAvatar.id.toLowerCase();
  const rarityMeta = RARITY_CONFIG[inspectedAvatar.rarity];

  // Filter avatars
  const filteredAvatars = GAME_AVATARS.filter((avatar) => {
    const matchesCategory = selectedCategory === 'ALL' || avatar.category === selectedCategory;
    const matchesUnlocked = !unlockedOnly || isAvatarUnlocked(avatar, character);
    return matchesCategory && matchesUnlocked;
  });

  const handleEquip = async (e: React.MouseEvent) => {
    if (!isInspectedUnlocked || isCurrentlyEquipped || saving) return;

    // Get origin coords for confetti burst
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/character/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: inspectedAvatar.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to equip avatar');
      }

      soundFx.playEquip();
      fireQuestConfetti(originX, originY);
      onAvatarEquipped(inspectedAvatar.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating avatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-vault-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="avatar-vault-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Game Avatar Vault
                </h3>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  {GAME_AVATARS.length} AVATARS
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Equip gaming profile pictures unlocked by your character level, streaks, and boss kills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Categories Bar & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950 px-5 py-2.5">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            {GAME_AVATAR_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.key
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filter toggle */}
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unlockedOnly}
              onChange={(e) => setUnlockedOnly(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400"
            />
            <span className="flex items-center space-x-1">
              <Filter className="h-3 w-3" />
              <span>Unlocked Only</span>
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="mx-5 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Avatar Grid Stack */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredAvatars.map((avatar) => {
                  const isUnlocked = isAvatarUnlocked(avatar, character);
                  const isSelected = selectedAvatarId.toLowerCase() === avatar.id.toLowerCase();
                  const isEquipped = currentAvatarId.toLowerCase() === avatar.id.toLowerCase();
                  const rarity = RARITY_CONFIG[avatar.rarity];

                  return (
                    <div
                      key={avatar.id}
                      onClick={() => setSelectedAvatarId(avatar.id)}
                      className={`group relative flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center transition cursor-pointer select-none ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500 shadow-md shadow-amber-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60 shadow-sm'
                      }`}
                    >
                      {/* Top status pills */}
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${rarity.bg} ${rarity.border} ${rarity.text}`}>
                          {avatar.rarity}
                        </span>
                        {isEquipped ? (
                          <span className="flex items-center space-x-0.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow">
                            <Check className="h-2.5 w-2.5" />
                            <span>ACTIVE</span>
                          </span>
                        ) : !isUnlocked ? (
                          <span className="flex items-center space-x-0.5 rounded-md bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-400">
                            <Lock className="h-2.5 w-2.5" />
                          </span>
                        ) : null}
                      </div>

                      {/* Avatar Graphic */}
                      <div className="relative my-1">
                        <GamerAvatar
                          avatarId={avatar.id}
                          size="lg"
                          level={character?.level || 1}
                          showFrame={true}
                          showLevelBadge={false}
                        />

                        {/* Darkened lock overlay if locked */}
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/60 backdrop-blur-[1px]">
                            <Lock className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Title & Lore */}
                      <div className="mt-2 w-full">
                        <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                          {avatar.name}
                        </h4>
                        <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isUnlocked ? avatar.title : avatar.unlockLabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredAvatars.length === 0 && (
                <div className="py-16 text-center text-xs text-slate-500">
                  No avatars found in this filter category.
                </div>
              )}
            </div>

            {/* RIGHT: Gamer Profile Preview & Equip Card */}
            <div className="lg:col-span-5 sticky top-0">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 shadow-xl">
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Profile Picture Preview
                  </span>

                  {/* Gamer Portrait Showcase */}
                  <div className="relative my-4 flex justify-center">
                    <GamerAvatar
                      avatarId={inspectedAvatar.id}
                      size="hero"
                      level={character?.level || 1}
                      showFrame={true}
                      showLevelBadge={true}
                      showOnlineDot={true}
                      className="shadow-2xl"
                    />
                  </div>

                  {/* Player Nameplate in Game Style */}
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {user?.username || 'Hero Player'}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {user?.characterTitle || 'Realm Adventurer'}
                  </p>

                  <div className="my-3 flex items-center justify-center space-x-2">
                    <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${rarityMeta.bg} ${rarityMeta.border} ${rarityMeta.text}`}>
                      {inspectedAvatar.rarity}
                    </span>
                    <span className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {inspectedAvatar.category}
                    </span>
                  </div>
                </div>

                {/* Lore Box */}
                <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {inspectedAvatar.name} — {inspectedAvatar.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {inspectedAvatar.flavorText}
                  </p>
                </div>

                {/* Unlock Requirement Card */}
                <div className="mt-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Unlock Criteria
                    </span>
                    <span
                      className={`font-black ${
                        isInspectedUnlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {isInspectedUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {inspectedAvatar.unlockLabel}
                  </p>
                </div>

                {/* Equip Button */}
                <div className="mt-5">
                  {isCurrentlyEquipped ? (
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 py-3 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 cursor-default"
                    >
                      <Check className="h-4 w-4" />
                      <span>Currently Equipped</span>
                    </button>
                  ) : isInspectedUnlocked ? (
                    <button
                      type="button"
                      onClick={handleEquip}
                      disabled={saving}
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{saving ? 'Equipping...' : 'Equip as Profile Picture'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 py-3 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Locked — {inspectedAvatar.unlockLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
