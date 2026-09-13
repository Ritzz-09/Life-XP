'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, Sword, Flame, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';
import { CharacterVisual } from './CharacterVisual';
import { GamerAvatar } from './GamerAvatar';
import { BrandLogo } from './BrandLogo';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthViewProps {
  onSuccess: (data: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('crimson-avenger');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'NON_BINARY'>('MALE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const starterAvatars = [
    { key: 'crimson-avenger', label: 'Avenger', sub: 'Superhero' },
    { key: 'cyber-ninja', label: 'Cyber Ninja', sub: 'Cyberpunk' },
    { key: 'warrior', label: 'Iron Guard', sub: 'Fantasy' },
    { key: 'pixel-hero', label: 'Pixel Knight', sub: 'Retro' },
  ];

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      soundFx.playCoin();
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enter realm');
      onSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo access failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { identifier, password }
        : { username, email, password, avatar, gender };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      soundFx.playCoin();
      onSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 cyber-bg-overlay relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Realm Emblem & Brand Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <BrandLogo size="lg" className="justify-center" />
          <p className="mt-2 text-xs sm:text-sm text-slate-400 text-center max-w-xs">
            Turn your daily discipline into legendary virtual power.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>Instant Evaluator Demo</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300">
              Explore immediately with a preloaded Level 3 Hero, quests, and armory gear.
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="mt-3 w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-500/25 transition active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Entering Realm...' : 'Enter as Demo Hero'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Or Custom Hero
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Tab Switch */}
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                isLogin ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                !isLogin ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Join Guild
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Hero Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roland of Eldoria"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                {isLogin ? 'Email or Hero Name' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type={isLogin ? 'text' : 'email'}
                  required
                  placeholder={isLogin ? 'adventurer@realm.com or HeroName' : 'adventurer@realm.com'}
                  value={isLogin ? identifier : email}
                  onChange={(e) => (isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              {isLogin && (
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] font-medium text-amber-400/90 hover:text-amber-300 transition hover:underline"
                  >
                    Forgot Master Password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <>
                {/* Hero Gender Selection */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Hero Identity & Visual Form
                  </label>
                  <div className="flex items-center space-x-3 rounded-2xl border border-slate-800 bg-slate-950 p-2.5">
                    <CharacterVisual
                      gender={gender}
                      level={1}
                      mode="portrait"
                      className="h-14 w-14 shrink-0"
                    />
                    <div className="grid grid-cols-3 gap-1.5 flex-1">
                      {[
                        { key: 'MALE', label: 'Male' },
                        { key: 'FEMALE', label: 'Female' },
                        { key: 'NON_BINARY', label: 'Enby' },
                      ].map((g) => (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => {
                            setGender(g.key as any);
                            soundFx.playEquip();
                          }}
                          className={`rounded-xl border py-2 text-center text-xs font-bold transition ${
                            gender === g.key
                              ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
                              : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Starter Game Avatar (Profile Pic)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {starterAvatars.map((starter) => (
                      <button
                        key={starter.key}
                        type="button"
                        onClick={() => {
                          setAvatar(starter.key);
                          soundFx.playEquip();
                        }}
                        className={`flex flex-col items-center justify-between rounded-xl border p-2 text-center transition ${
                          avatar === starter.key
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400 shadow-md shadow-amber-500/20'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <GamerAvatar
                          avatarId={starter.key}
                          size="sm"
                          showFrame={false}
                          className="mb-1"
                        />
                        <div className="text-[10px] font-bold truncate w-full">{starter.label}</div>
                        <div className="text-[8px] text-slate-500 truncate w-full">{starter.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {loading
                ? 'Channeling...'
                : isLogin
                ? 'Enter Realm'
                : 'Embark on Journey'}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onPasswordResetSuccess={() => {
          setIsLogin(true);
        }}
      />
    </div>
  );
};
