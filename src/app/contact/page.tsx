'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate real submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      soundFx.playCoin();
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-bg-overlay">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Column: Direct Info & Support */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300 mb-4">
                <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                <span>Adventurer Sanctuary</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Send Word to the High Council
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Need account assistance, spotted a bug, or want to suggest an epic new boss raid? Dispatch your message below and our guild heralds will respond swiftly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Support Parchment</h4>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">support@life-xp.game</p>
                  <p className="text-[11px] text-slate-500 mt-1">Guaranteed response within 24–48 realm hours.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Guild Discord Sanctuary</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Join 12,000+ active adventurers</p>
                  <p className="text-[11px] text-slate-500 mt-1">Share custom rewards, party raid codes, and habit strategies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Feedback Form */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-white">Message Dispatched Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, hero. Your parchment has been recorded in the guild archives. We will reach out to <span className="text-amber-400 font-mono">{email}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setSubject('');
                  }}
                  className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                >
                  Send Another Dispatch
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Dispatch Inquiries</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Hero Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roland"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="hero@realm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Support">Account Support / Technical Query</option>
                    <option value="Bug">Bug Report</option>
                    <option value="Feature">Feature / Boss Raid Suggestion</option>
                    <option value="Guild">Guild Partnership & Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of your query"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your feedback, bug details, or inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Dispatching Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
