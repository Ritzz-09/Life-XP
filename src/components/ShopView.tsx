'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Coins,
  Shield,
  Sword,
  Sparkles,
  FlaskConical,
  Award,
  Crown,
  Check,
  Zap,
  ShoppingBag,
  Package,
  Gift,
  Plus,
  Trash2,
  Coffee,
  Gamepad2,
  Film,
  Utensils,
  Music,
  BookOpen,
  CheckCircle2,
  X,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  rarity: string;
  icon: string;
  statType: string | null;
  statBonus: number;
  effectDescription: string;
}

interface UserItem {
  id: string;
  itemId: string;
  quantity: number;
  isEquipped: boolean;
  item: Item;
}

interface CustomReward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  timesClaimed: number;
}

interface RedemptionLog {
  id: string;
  rewardTitle: string;
  cost: number;
  redeemedAt: string;
}

interface ShopViewProps {
  playerGold: number;
  onUpdateCharacter: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  playerGold,
  onUpdateCharacter,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [inventory, setInventory] = useState<UserItem[]>([]);
  const [customRewards, setCustomRewards] = useState<CustomReward[]>([]);
  const [recentRedemptions, setRecentRedemptions] = useState<RedemptionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'SHOP' | 'REWARDS' | 'INVENTORY'>('SHOP');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Custom Reward Modal State
  const [createRewardOpen, setCreateRewardOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCost, setNewCost] = useState(50);
  const [newIcon, setNewIcon] = useState('Gift');
  const [savingReward, setSavingReward] = useState(false);

  const fetchShopData = useCallback(async () => {
    try {
      const res = await fetch('/api/shop');
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setInventory(data.inventory || []);
      }
    } catch (err) {
      console.error('Failed to load shop data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRewardsData = useCallback(async () => {
    try {
      const res = await fetch('/api/rewards');
      const data = await res.json();
      if (res.ok) {
        setCustomRewards(data.rewards || []);
        setRecentRedemptions(data.redemptions || []);
      }
    } catch (err) {
      console.error('Failed to load rewards data:', err);
    }
  }, []);

  useEffect(() => {
    fetchShopData();
    fetchRewardsData();
  }, [fetchShopData, fetchRewardsData]);

  const handleBuy = async (item: Item) => {
    if (playerGold < item.cost) {
      setActionNotice(`Need ${item.cost - playerGold} more gold to purchase ${item.name}!`);
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (res.ok) {
        soundFx.playCoin();
        setActionNotice(`Successfully purchased ${item.name}!`);
        setTimeout(() => setActionNotice(null), 3000);
        await fetchShopData();
        onUpdateCharacter();
      } else {
        setActionNotice(data.error || 'Purchase failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEquip = async (userItemId: string) => {
    try {
      const res = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userItemId }),
      });
      if (res.ok) {
        soundFx.playEquip();
        await fetchShopData();
        onUpdateCharacter();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUseConsumable = async (userItemId: string) => {
    try {
      const res = await fetch('/api/shop/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userItemId }),
      });
      const data = await res.json();
      if (res.ok) {
        soundFx.playLevelUp();
        setActionNotice(data.message || 'Consumed item!');
        setTimeout(() => setActionNotice(null), 3000);
        await fetchShopData();
        onUpdateCharacter();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Claim Custom Real-Life Reward
  const handleClaimReward = async (reward: CustomReward) => {
    if (playerGold < reward.cost) {
      setActionNotice(`Need ${reward.cost - playerGold} more gold to claim "${reward.title}"!`);
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    try {
      const res = await fetch(`/api/rewards/${reward.id}/claim`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        soundFx.playPurchase();
        setActionNotice(`🎉 Claimed "${reward.title}"! Enjoy your real-world reward!`);
        setTimeout(() => setActionNotice(null), 4000);
        await fetchRewardsData();
        onUpdateCharacter();
      } else {
        setActionNotice(data.error || 'Failed to claim reward');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReward = async (id: string) => {
    try {
      const res = await fetch(`/api/rewards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchRewardsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCustomReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSavingReward(true);
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          cost: newCost,
          icon: newIcon,
        }),
      });

      if (res.ok) {
        soundFx.playCoin();
        setNewTitle('');
        setNewDescription('');
        setNewCost(50);
        setCreateRewardOpen(false);
        await fetchRewardsData();
      }
    } catch (err) {
      console.error('Failed to create reward:', err);
    } finally {
      setSavingReward(false);
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return 'border-slate-700 bg-slate-800/80 text-slate-300';
      case 'RARE':
        return 'border-blue-500/40 bg-blue-500/10 text-blue-400';
      case 'EPIC':
        return 'border-purple-500/40 bg-purple-500/10 text-purple-400';
      case 'LEGENDARY':
        return 'border-amber-500/60 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  const getItemIcon = (icon: string) => {
    switch (icon) {
      case 'Sword': return <Sword className="h-6 w-6 text-amber-400" />;
      case 'Shield': return <Shield className="h-6 w-6 text-emerald-400" />;
      case 'BookOpen': return <Sparkles className="h-6 w-6 text-blue-400" />;
      case 'FlaskConical': return <FlaskConical className="h-6 w-6 text-rose-400" />;
      case 'Crown': return <Crown className="h-6 w-6 text-amber-300" />;
      case 'Award': case 'Flame': return <Award className="h-6 w-6 text-purple-400" />;
      default: return <Zap className="h-6 w-6 text-amber-400" />;
    }
  };

  const getRewardIcon = (icon: string) => {
    switch (icon) {
      case 'Coffee': return <Coffee className="h-6 w-6 text-amber-400" />;
      case 'Gamepad2': return <Gamepad2 className="h-6 w-6 text-purple-400" />;
      case 'Film': return <Film className="h-6 w-6 text-rose-400" />;
      case 'Utensils': return <Utensils className="h-6 w-6 text-emerald-400" />;
      case 'Music': return <Music className="h-6 w-6 text-cyan-400" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6 text-blue-400" />;
      default: return <Gift className="h-6 w-6 text-yellow-400" />;
    }
  };

  const rewardIconChoices = [
    { key: 'Gift', label: 'Gift', icon: Gift },
    { key: 'Gamepad2', label: 'Gaming', icon: Gamepad2 },
    { key: 'Coffee', label: 'Coffee', icon: Coffee },
    { key: 'Film', label: 'Movie', icon: Film },
    { key: 'Utensils', label: 'Food', icon: Utensils },
    { key: 'Music', label: 'Music', icon: Music },
    { key: 'BookOpen', label: 'Reading', icon: BookOpen },
  ];

  const filteredItems = items.filter((item) => {
    if (categoryFilter === 'ALL') return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="flex items-center text-lg font-bold text-slate-100">
            <ShoppingBag className="mr-2 h-5 w-5 text-amber-400" />
            Realm Armory & Rewards
          </h2>
          <p className="text-xs text-slate-400">
            Invest gold into gear, real-life incentives, and restorative potions
          </p>
        </div>

        {/* 3-Tab Switch */}
        <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('SHOP')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'SHOP'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Merchant Armory</span>
          </button>
          <button
            onClick={() => setActiveTab('REWARDS')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'REWARDS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="h-3.5 w-3.5" />
            <span>Real-Life Rewards</span>
          </button>
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'INVENTORY'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Bag ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* Action notification banner */}
      {actionNotice && (
        <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-center text-xs font-semibold text-amber-300 animate-in fade-in">
          {actionNotice}
        </div>
      )}

      {/* TAB 1: MERCHANT STORE */}
      {activeTab === 'SHOP' && (
        <div className="mt-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {['ALL', 'WEAPON', 'ARMOR', 'CONSUMABLE', 'BADGE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? 'bg-slate-100 text-slate-900 shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Wares' : cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Perusing merchant inventory...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredItems.map((item) => {
                const canAfford = playerGold >= item.cost;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700 hover:bg-slate-950/80"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                            {getItemIcon(item.icon)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                            <span className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getRarityBadge(item.rarity)}`}>
                              {item.rarity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Coins className="h-3.5 w-3.5" />
                          <span>{item.cost}</span>
                        </div>
                      </div>

                      <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>

                      {item.effectDescription && (
                        <div className="mt-2 text-[11px] font-semibold text-emerald-400">
                          ✦ {item.effectDescription}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`mt-4 w-full rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition ${
                        canAfford
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95'
                          : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                      }`}
                    >
                      {canAfford ? 'Purchase' : 'Insufficient Gold'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REAL-LIFE REWARDS (INCENTIVE STORE) */}
      {activeTab === 'REWARDS' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Personal Incentive Market
              </h3>
              <p className="text-xs text-slate-400">
                Redeem your gold for guilt-free real-life rewards you define
              </p>
            </div>
            <button
              onClick={() => setCreateRewardOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow transition active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Forge Custom Reward</span>
            </button>
          </div>

          {customRewards.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              No rewards created yet. Click &ldquo;Forge Custom Reward&rdquo; to add your favorite treat!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {customRewards.map((reward) => {
                const canAfford = playerGold >= reward.cost;
                return (
                  <div
                    key={reward.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-amber-500/40 hover:bg-slate-950/90 group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                            {getRewardIcon(reward.icon)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100">{reward.title}</h4>
                            <span className="text-[10px] text-slate-400">
                              Claimed {reward.timesClaimed} time{reward.timesClaimed === 1 ? '' : 's'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            <Coins className="h-3.5 w-3.5" />
                            <span>{reward.cost}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteReward(reward.id)}
                            className="text-slate-600 hover:text-rose-400 transition p-1"
                            title="Delete reward"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {reward.description && (
                        <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                          {reward.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleClaimReward(reward)}
                      disabled={!canAfford}
                      className={`mt-4 w-full rounded-xl py-2 text-xs font-black uppercase tracking-wider transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-md shadow-amber-500/20 active:scale-95'
                          : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                      }`}
                    >
                      {canAfford ? `Claim Reward (${reward.cost} G)` : `Need ${reward.cost - playerGold} More Gold`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent Redemptions Ticker */}
          {recentRedemptions.length > 0 && (
            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recent Reward Claims
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentRedemptions.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>{log.rewardTitle}</span>
                    <span className="text-amber-400 font-bold">-{log.cost} G</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeTab === 'INVENTORY' && (
        <div className="mt-4">
          {inventory.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Your bag is empty! Visit the Merchant Armory to purchase weapons, armor, or elixirs.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {inventory.map((ui) => {
                const isConsumable = ui.item.category === 'CONSUMABLE';
                return (
                  <div
                    key={ui.id}
                    className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                      ui.isEquipped
                        ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/30'
                        : 'border-slate-800 bg-slate-950/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                            {getItemIcon(ui.item.icon)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100">{ui.item.name}</h4>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <span className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider border ${getRarityBadge(ui.item.rarity)}`}>
                                {ui.item.rarity}
                              </span>
                              {ui.isEquipped && (
                                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-black text-amber-300 border border-amber-500/40">
                                  EQUIPPED
                                </span>
                              )}
                              {ui.quantity > 1 && (
                                <span className="text-[10px] text-slate-400 font-bold">
                                  x{ui.quantity}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                        {ui.item.description}
                      </p>

                      {ui.item.effectDescription && (
                        <div className="mt-2 text-[11px] font-semibold text-emerald-400">
                          ✦ {ui.item.effectDescription}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      {isConsumable ? (
                        <button
                          onClick={() => handleUseConsumable(ui.id)}
                          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 transition active:scale-95 shadow-md shadow-emerald-500/20"
                        >
                          Use Item
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEquip(ui.id)}
                          className={`w-full rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition active:scale-95 ${
                            ui.isEquipped
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                              : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                          }`}
                        >
                          {ui.isEquipped ? 'Unequip' : 'Equip to Hero'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE CUSTOM REWARD MODAL */}
      {createRewardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <button
              onClick={() => setCreateRewardOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 text-amber-400 mb-4">
              <Gift className="h-5 w-5" />
              <h3 className="text-lg font-bold text-slate-100">Forge Custom Reward</h3>
            </div>

            <form onSubmit={handleCreateCustomReward} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Hour Gaming, Favorite Coffee, Movie Night"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Gold Cost
                </label>
                <input
                  type="number"
                  min="5"
                  required
                  value={newCost}
                  onChange={(e) => setNewCost(parseInt(e.target.value, 10) || 10)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="What makes this reward special?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Reward Icon
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {rewardIconChoices.map((choice) => {
                    const IconComp = choice.icon;
                    return (
                      <button
                        key={choice.key}
                        type="button"
                        onClick={() => setNewIcon(choice.key)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2 text-xs transition ${
                          newIcon === choice.key
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <IconComp className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">{choice.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingReward || !newTitle.trim()}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  {savingReward ? 'Forging...' : 'Save Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
