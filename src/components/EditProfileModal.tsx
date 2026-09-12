'use client';

import React, { useState } from 'react';
import {
  X,
  Award,
  Check,
  Save,
  UserCheck,
} from 'lucide-react';
import { GamerAvatar } from './GamerAvatar';
import { soundFx } from '@/lib/sound-fx';

export type GenderArchetype = 'MALE' | 'FEMALE' | 'NON_BINARY';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: string;
    username: string;
    characterTitle?: string;
    avatar?: string;
  };
  character: {
    level: number;
    gender?: string;
    characterClass?: string;
  };
  onProfileUpdated: () => void;
  onOpenAvatarVault?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  character,
  onProfileUpdated,
  onOpenAvatarVault,
}) => {
  const [username, setUsername] = useState(user?.username || '');
  const [characterTitle, setCharacterTitle] = useState(user?.characterTitle || '');
  const [gender, setGender] = useState<GenderArchetype>(
    (character?.gender as GenderArchetype) || 'MALE'
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/character/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          characterTitle: characterTitle.trim(),
          gender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update hero profile');
      }

      soundFx.playEquip();
      setSuccessMsg('Profile and Hero Archetype successfully updated!');
      onProfileUpdated();

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const genderOptions = [
    {
      id: 'MALE' as GenderArchetype,
      label: 'Male',
      icon: '♂',
      title: 'Titan / Warrior',
      desc: 'Muscular V-taper frame, Spartan battle crest, and tiered armor plating.',
      activeRing: 'ring-blue-400 border-blue-400 bg-blue-500/20 text-blue-300',
    },
    {
      id: 'FEMALE' as GenderArchetype,
      label: 'Female',
      icon: '♀',
      title: 'Valkyrie / Champion',
      desc: 'Hourglass athletic silhouette, golden superhero diadem, and winged cuirass.',
      activeRing: 'ring-rose-400 border-rose-400 bg-rose-500/20 text-rose-300',
    },
    {
      id: 'NON_BINARY' as GenderArchetype,
      label: 'Non-Binary',
      icon: '⚥',
      title: 'Astral / Celestial',
      desc: 'Agile cosmic silhouette, hovering celestial halo, and 3 orbiting runic spheres.',
      activeRing: 'ring-purple-400 border-purple-400 bg-purple-500/20 text-purple-300',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-700/80 dark:border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-inner">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 sm:text-2xl">
              Edit Hero Profile
            </h2>
            <p className="text-xs text-slate-400">
              Customize your hero identity, gamer title, and 3D character archetype.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Profile Picture Banner */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-800/90 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center space-x-3.5">
              <GamerAvatar
                avatarId={user?.avatar}
                size="md"
                level={character?.level || 1}
                showFrame={true}
                showOnlineDot={true}
              />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Profile Picture
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  Current: <span className="text-amber-400 capitalize">{user?.avatar?.replace('-', ' ') || 'Warrior'}</span>
                </p>
              </div>
            </div>

            {onOpenAvatarVault && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAvatarVault();
                }}
                className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-black text-amber-300 hover:bg-amber-500/25 transition active:scale-95"
              >
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>Change Avatar</span>
              </button>
            )}
          </div>

          {/* Hero Name & Character Title */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Hero Name / Gamer Tag
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Shadowblade, Valkyrie..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Character Title / Epithet
              </label>
              <input
                type="text"
                maxLength={40}
                value={characterTitle}
                onChange={(e) => setCharacterTitle(e.target.value)}
                placeholder="e.g. Vanguard of Focus, Apex Cyber Blade..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Displayed proudly under your hero name across the realm.
              </p>
            </div>
          </div>

          {/* 3D Character Archetype / Gender Selection */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Hero Archetype / Gender (3D Model)
              </label>
              <span className="text-[10px] font-mono text-cyan-400">
                Switches 3D Anatomy & Armor
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {genderOptions.map((opt) => {
                const isSelected = gender === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setGender(opt.id);
                      soundFx.playEquip();
                    }}
                    className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all relative ${
                      isSelected
                        ? opt.activeRing + ' ring-2 shadow-lg'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-base font-black">
                        {opt.icon} {opt.label}
                      </span>
                      {isSelected && (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-slate-950 font-black">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 mb-0.5">
                      {opt.title}
                    </span>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              {successMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-2/3 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4 stroke-[2.5]" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
