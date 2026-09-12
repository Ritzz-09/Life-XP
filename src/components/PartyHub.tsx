'use client';

import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Shield, Flame, Swords, LogOut, UserPlus, Sparkles, RefreshCw, Skull, AlertCircle } from 'lucide-react';
import { GamerAvatar } from './GamerAvatar';

interface PartyHubProps {
  isOpen: boolean;
  onClose: () => void;
  onPartyUpdated?: () => void;
}

interface PartyMemberData {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    characterTitle: string;
    character?: {
      level: number;
      characterClass: string;
      streak: number;
    } | null;
  };
}

interface PartyActivity {
  id: string;
  username: string;
  action: string;
  damage: number;
  timestamp: string;
}

interface PartyData {
  id: string;
  name: string;
  inviteCode: string;
  bossTarget: string;
  bossHp: number;
  bossMaxHp: number;
  members: PartyMemberData[];
  activities: PartyActivity[];
}

export const PartyHub: React.FC<PartyHubProps> = ({
  isOpen,
  onClose,
  onPartyUpdated,
}) => {
  const [inParty, setInParty] = useState(false);
  const [party, setParty] = useState<PartyData | null>(null);
  const [role, setRole] = useState<string>('MEMBER');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fetchParty = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/party');
      if (res.ok) {
        const data = await res.json();
        setInParty(data.inParty);
        setParty(data.party || null);
        setRole(data.role || 'MEMBER');
      }
    } catch (err) {
      console.error('Failed to load party:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchParty();
      setStatusMsg(null);
    }
  }, [isOpen]);

  const handleCopyCode = () => {
    if (!party?.inviteCode) return;
    navigator.clipboard.writeText(party.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/party/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to create party' });
      } else {
        setStatusMsg({ type: 'success', text: 'Party founded!' });
        setParty(data.party);
        setInParty(true);
        setRole('LEADER');
        setCreateName('');
        if (onPartyUpdated) onPartyUpdated();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error creating party' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleJoinParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setFormLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/party/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: joinCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to join party' });
      } else {
        setStatusMsg({ type: 'success', text: 'Joined party!' });
        setParty(data.party);
        setInParty(true);
        setRole('MEMBER');
        setJoinCode('');
        if (onPartyUpdated) onPartyUpdated();
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error joining party' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleLeaveParty = async () => {
    if (!confirm('Are you sure you want to leave this fellowship?')) return;
    try {
      const res = await fetch('/api/party/leave', { method: 'POST' });
      if (res.ok) {
        setInParty(false);
        setParty(null);
        if (onPartyUpdated) onPartyUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Co-Op Guild Fellowship
                  {inParty && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {role}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400">
                  Form parties with friends, share invite codes, and conquer colossal Guild Boss Raids together!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchParty}
                disabled={loading}
                title="Refresh Party Data"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 text-xs font-bold flex items-center gap-2 ${
                statusMsg.type === 'error'
                  ? 'bg-rose-500/20 text-rose-300 border-b border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Main Content Area */}
          <div className="p-6 overflow-y-auto flex-1">
            {!inParty ? (
              /* NOT IN A PARTY: Creation & Join Forms */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto py-6">
                {/* Create Party */}
                <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Found a Fellowship</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Create your own guild party, receive a 6-character invite code, and rally your friends.
                    </p>

                    <form onSubmit={handleCreateParty} className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Fellowship Name
                        </label>
                        <input
                          type="text"
                          value={createName}
                          onChange={(e) => setCreateName(e.target.value)}
                          placeholder="e.g. Iron Vanguard"
                          maxLength={32}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
                      >
                        {formLoading ? 'Creating...' : 'Found Party'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Join Party */}
                <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Join Existing Party</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Enter the 6-character invite code given by a party leader to unite forces.
                    </p>

                    <form onSubmit={handleJoinParty} className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          6-Character Invite Code
                        </label>
                        <input
                          type="text"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                          placeholder="e.g. RAID92"
                          maxLength={8}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-center tracking-widest text-amber-400 uppercase placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formLoading || !joinCode.trim()}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
                      >
                        {formLoading ? 'Joining...' : 'Enter Fellowship'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : party ? (
              /* ACTIVE IN A PARTY */
              <div className="space-y-6">
                {/* Party Header Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Guild Fellowship
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-wide">{party.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {party.members.length} / 8 Adventurers Assembled
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Invite Code Badge */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700">
                      <span className="text-xs text-slate-400 font-semibold">Code:</span>
                      <span className="font-mono font-black text-amber-400 text-base tracking-widest">
                        {party.inviteCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        title="Copy Code"
                        className="p-1 rounded text-slate-400 hover:text-white transition"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      onClick={handleLeaveParty}
                      title="Leave Party"
                      className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Co-Op Boss Raid Bar */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-rose-900/40 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <Skull className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                          Co-Op World Boss Raid
                        </span>
                        <h4 className="text-base font-extrabold text-white">{party.bossTarget}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-rose-300">
                        {party.bossHp.toLocaleString()} / {party.bossMaxHp.toLocaleString()} HP
                      </span>
                      <p className="text-[10px] text-slate-400">
                        ({Math.round((party.bossHp / party.bossMaxHp) * 100)}% Remaining)
                      </p>
                    </div>
                  </div>

                  {/* HP Bar */}
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(0, (party.bossHp / party.bossMaxHp) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 italic text-center">
                    ⚔️ Completing your daily quests automatically deals party damage to this boss!
                  </p>
                </div>

                {/* Party Members Roster & Activity Feed */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Members Roster (Left) */}
                  <div className="md:col-span-7">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Adventurer Roster ({party.members.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {party.members.map((member) => (
                        <div
                          key={member.id}
                          className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3"
                        >
                          <GamerAvatar
                            avatarId={member.user.avatar || 'warrior'}
                            size="md"
                            level={member.user.character?.level || 1}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white truncate">
                                {member.user.username}
                              </span>
                              {member.role === 'LEADER' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                                  👑
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {member.user.characterTitle || 'Adventurer'}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300 font-medium">
                              <span>Lvl {member.user.character?.level || 1}</span>
                              <span>•</span>
                              <span className="text-amber-400">🔥 {member.user.character?.streak || 1}d</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed (Right) */}
                  <div className="md:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col max-h-80">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Live Raid Activity Feed
                    </h4>

                    <div className="overflow-y-auto flex-1 space-y-2.5 pr-1">
                      {party.activities.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-6">
                          No raid events yet. Complete quests to strike the boss!
                        </p>
                      ) : (
                        party.activities.map((act) => (
                          <div
                            key={act.id}
                            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                          >
                            <p className="text-slate-200">
                              <strong className="text-amber-400">{act.username}</strong> {act.action}
                            </p>
                            {act.damage > 0 && (
                              <span className="text-[10px] font-bold text-rose-400">
                                -{act.damage.toLocaleString()} DMG
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
  );
};
