'use client';

import React, { useState } from 'react';
import { X, Sparkles, Shield, Sword, Award, Check, UserCheck, ChevronRight, Box, UserCog } from 'lucide-react';
import { CharacterVisual, Gender, getEvolutionStage } from './CharacterVisual';
import { Superhero3D } from './Superhero3D';
import { soundFx } from '@/lib/sound-fx';

interface CharacterInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    characterTitle?: string;
  };
  character: {
    level: number;
    xp: number;
    gender?: string;
    strength: number;
    intellect: number;
    vitality: number;
    agility: number;
    spirit: number;
    equippedWeapon?: { name: string; rarity: string; statBonus: number } | null;
    equippedArmor?: { name: string; rarity: string; statBonus: number } | null;
  };
  onUpdateCharacter: () => void;
  onOpenAvatarVault?: () => void;
  onOpenEditProfile?: () => void;
}

export const CharacterInspectModal: React.FC<CharacterInspectModalProps> = ({
  isOpen,
  onClose,
  user,
  character,
  onUpdateCharacter,
  onOpenAvatarVault,
  onOpenEditProfile,
}) => {
  const [selectedGender, setSelectedGender] = useState<Gender>(
    (character.gender as Gender) || 'MALE'
  );
  const [viewFormat, setViewFormat] = useState<'3D' | '2D'>('3D');
  const [savingGender, setSavingGender] = useState(false);
  const [inspectStage, setInspectStage] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentStageInfo = getEvolutionStage(character.level);
  const displayedLevel = inspectStage ? (inspectStage === 1 ? 1 : inspectStage === 2 ? 3 : inspectStage === 3 ? 6 : 10) : character.level;

  const handleGenderChange = async (newGender: Gender) => {
    setSelectedGender(newGender);
    setSavingGender(true);
    soundFx.playEquip();
    try {
      const res = await fetch('/api/character/gender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gender: newGender }),
      });
      if (res.ok) {
        onUpdateCharacter();
      }
    } catch (err) {
      console.error('Failed to change gender:', err);
    } finally {
      setSavingGender(false);
    }
  };

  const stages = [
    { stage: 1, minLvl: 1, name: 'Vigilante Recruit', tier: 'Common', desc: 'Slim tactical suit, basic cowl & raw discipline' },
    { stage: 2, minLvl: 3, name: 'Armored Defender', tier: 'Rare', desc: 'Muscular bulk, titanium armor plates, glowing arc reactor & cape' },
    { stage: 3, minLvl: 6, name: 'Apex Avenger', tier: 'Epic', desc: 'Superhuman physique, heavy vibranium plating & energy conduits' },
    { stage: 4, minLvl: 10, name: 'Cosmic Titan', tier: 'Mythic', desc: 'Godly superhuman build, orbital energy rings & starlight wings' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-amber-500/30 bg-slate-950 p-6 shadow-2xl overflow-hidden max-h-[94vh] overflow-y-auto">
        {/* Background glow */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 sm:text-2xl">
                3D Superhero Character Lab
              </h2>
              <p className="text-xs text-slate-400">
                Rotate 360°, inspect your muscular superhero growth, and customize your suit.
              </p>
            </div>
          </div>

          {/* 3D / 2D Format Switcher & Avatar Vault */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setViewFormat('3D')}
                className={`rounded-lg px-3 py-1 text-xs font-black transition ${
                  viewFormat === '3D'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3D Superhero
              </button>
              <button
                onClick={() => setViewFormat('2D')}
                className={`rounded-lg px-3 py-1 text-xs font-black transition ${
                  viewFormat === '2D'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2D Codex
              </button>
            </div>
            {onOpenEditProfile && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEditProfile();
                }}
                className="flex items-center space-x-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 text-xs font-black text-cyan-300 transition"
                title="Edit Hero Profile, Title & 3D Archetype"
              >
                <UserCog className="h-3.5 w-3.5 text-cyan-400" />
                <span>Edit Profile</span>
              </button>
            )}
            {onOpenAvatarVault && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAvatarVault();
                }}
                className="flex items-center space-x-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 text-xs font-black text-amber-300 transition"
              >
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>Avatar Stack</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Visual Showcase (3D Superhero or 2D) */}
          <div className="md:col-span-7 flex flex-col items-center">
            {viewFormat === '3D' ? (
              <div className="relative w-full h-80 sm:h-96 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl overflow-hidden">
                <Superhero3D
                  gender={selectedGender}
                  level={displayedLevel}
                  height="100%"
                  width="100%"
                  interactive={true}
                  autoRotate={true}
                  showControls={true}
                />
              </div>
            ) : (
              <CharacterVisual
                gender={selectedGender}
                level={displayedLevel}
                mode="full"
                className="w-full"
              />
            )}

            {inspectStage && inspectStage !== currentStageInfo.stage && (
              <button
                onClick={() => setInspectStage(null)}
                className="mt-3 text-xs font-bold text-amber-400 underline hover:text-amber-300 transition"
              >
                Reset preview to current Level ({character.level})
              </button>
            )}
          </div>

          {/* Controls & Evolution Progression */}
          <div className="md:col-span-5 space-y-5">
            {/* Gender Customizer */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Hero Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['MALE', 'FEMALE', 'NON_BINARY'] as Gender[]).map((g) => {
                  const isSelected = selectedGender === g;
                  const label = g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Enby';
                  return (
                    <button
                      key={g}
                      onClick={() => handleGenderChange(g)}
                      disabled={savingGender}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition active:scale-95 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400 font-black'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <UserCheck className="h-4 w-4 mb-1" />
                      <span className="text-xs">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evolution Stage Roadmap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Evolution Stages
              </label>
              <div className="space-y-2">
                {stages.map((st) => {
                  const isUnlocked = character.level >= st.minLvl;
                  const isCurrent = currentStageInfo.stage === st.stage;
                  const isInspecting = inspectStage === st.stage;

                  return (
                    <div
                      key={st.stage}
                      onClick={() => setInspectStage(st.stage)}
                      className={`group cursor-pointer rounded-xl border p-3 transition flex items-center justify-between ${
                        isCurrent
                          ? 'border-amber-500/60 bg-amber-500/10'
                          : isUnlocked
                          ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                          : 'border-slate-900 bg-slate-950/60 opacity-60'
                      } ${isInspecting ? 'ring-1 ring-cyan-400' : ''}`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-100">
                            Stage {st.stage}: {st.name}
                          </span>
                          {isCurrent && (
                            <span className="rounded bg-amber-500 px-1.5 py-0.2 text-[9px] font-black text-slate-950">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {st.desc}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isUnlocked ? 'Unlocked' : `Req Lv ${st.minLvl}`}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-auto text-slate-500 group-hover:text-slate-200 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Close / Confirm */}
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition"
            >
              Confirm Hero Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
