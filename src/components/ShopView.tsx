'use client';

import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'SHOP' | 'INVENTORY'>('SHOP');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchShopData = async () => {
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
  };

  useEffect(() => {
    fetchShopData();
  }, []);

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
        soundFx.playQuestComplete();
        setActionNotice(data.message || 'Consumed item!');
        setTimeout(() => setActionNotice(null), 3000);
        await fetchShopData();
        onUpdateCharacter();
      }
    } catch (err) {
      console.error(err);
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
            Realm Armory & Merchant
          </h2>
          <p className="text-xs text-slate-400">
            Invest your hard-earned gold into gear, relics, and restorative potions
          </p>
        </div>

        {/* Shop / Inventory Switch */}
        <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('SHOP')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'SHOP'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Merchant Store</span>
          </button>
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
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

      {/* Category Filter Chips (for Shop) */}
      {activeTab === 'SHOP' && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {['ALL', 'WEAPON', 'ARMOR', 'CONSUMABLE', 'BADGE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                categoryFilter === cat
                  ? 'border border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Goods' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="mt-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 animate-pulse">
            Consulting the merchant inventory ledger...
          </div>
        ) : activeTab === 'SHOP' ? (
          /* SHOP ITEMS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const userOwns = inventory.some((inv) => inv.itemId === item.id);
              const canAfford = playerGold >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all ${getRarityBadge(
                    item.rarity
                  )} bg-slate-950/70 hover:border-slate-600`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                        {getItemIcon(item.icon)}
                      </div>
                      <span className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider border border-current">
                        {item.rarity}
                      </span>
                    </div>

                    <h4 className="mt-2.5 text-sm font-bold text-slate-100">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-2 rounded-lg bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                      ⚡ {item.effectDescription || `+${item.statBonus} ${item.statType}`}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <div className="flex items-center text-xs font-bold text-yellow-300 font-mono">
                      <Coins className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {item.cost} Gold
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`flex items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                        canAfford
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                          : 'border border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Buy</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* INVENTORY BAG */
          <div>
            {inventory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-xs text-slate-500">
                Your inventory bag is currently empty. Visit the merchant store to acquire gear!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {inventory.map((inv) => (
                  <div
                    key={inv.id}
                    className={`flex flex-col justify-between rounded-xl border p-3.5 bg-slate-950/80 transition-all ${
                      inv.isEquipped ? 'border-amber-400/80 ring-1 ring-amber-400/60' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                          {getItemIcon(inv.item.icon)}
                        </div>
                        {inv.isEquipped && (
                          <span className="flex items-center rounded-full bg-amber-500/20 border border-amber-400 px-2 py-0.5 text-[10px] font-black text-amber-300">
                            <Check className="mr-1 h-3 w-3" /> EQUIPPED
                          </span>
                        )}
                      </div>

                      <h4 className="mt-2.5 text-sm font-bold text-slate-100">
                        {inv.item.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {inv.item.effectDescription || `+${inv.item.statBonus} ${inv.item.statType}`}
                      </p>
                      {inv.quantity > 1 && (
                        <p className="text-[11px] text-slate-400 font-mono mt-1">
                          Quantity: {inv.quantity}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 border-t border-slate-800 pt-3">
                      {inv.item.category === 'CONSUMABLE' ? (
                        <button
                          onClick={() => handleUseConsumable(inv.id)}
                          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-1.5 text-xs font-bold text-slate-950 shadow transition active:scale-95"
                        >
                          Consume / Use
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEquip(inv.id)}
                          className={`w-full rounded-lg py-1.5 text-xs font-bold transition active:scale-95 ${
                            inv.isEquipped
                              ? 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                              : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow'
                          }`}
                        >
                          {inv.isEquipped ? 'Unequip' : 'Equip to Hero'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
