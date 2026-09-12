'use client';

import React from 'react';
import { Swords, Shield, ShoppingBag, Skull, Plus } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'QUESTS' | 'HERO' | 'SHOP' | 'RAID';
  onChangeTab: (tab: 'QUESTS' | 'HERO' | 'SHOP' | 'RAID') => void;
  onOpenCreateQuest: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenCreateQuest,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-around px-2 relative">
        {/* Quests Tab */}
        <button
          onClick={() => onChangeTab('QUESTS')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
            activeTab === 'QUESTS' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Swords className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Quests</span>
        </button>

        {/* Hero Tab */}
        <button
          onClick={() => onChangeTab('HERO')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
            activeTab === 'HERO' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Hero</span>
        </button>

        {/* Floating Centered New Quest Button */}
        <div className="-mt-6 flex items-center justify-center">
          <button
            onClick={onOpenCreateQuest}
            aria-label="Forge New Quest"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/40 ring-4 ring-slate-950 transition active:scale-95"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Shop Tab */}
        <button
          onClick={() => onChangeTab('SHOP')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
            activeTab === 'SHOP' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Armory</span>
        </button>

        {/* Raid Boss Tab */}
        <button
          onClick={() => onChangeTab('RAID')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
            activeTab === 'RAID' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Skull className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Boss</span>
        </button>
      </div>
    </div>
  );
};
