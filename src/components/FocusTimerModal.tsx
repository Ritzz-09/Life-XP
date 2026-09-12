'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Zap, CheckCircle2, Award } from 'lucide-react';
import { QuestItem } from './QuestCard';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: QuestItem | null;
  onCompleteQuestWithBonus: (questId: string, focusMinutes: number) => Promise<void>;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  quest,
  onCompleteQuestWithBonus,
}) => {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Web Audio Synth for ambient focus hum
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Reset timer when duration changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(durationMinutes * 60);
      setIsRunning(false);
      setSessionCompleted(false);
    } else {
      stopAmbientTone();
    }
  }, [isOpen, durationMinutes]);

  // Timer countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessionCompleted(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Ambient sound management
  const startAmbientTone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Deep, soothing alpha wave frequency (144Hz with low volume)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(144, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainRef.current = gain;
      setSoundEnabled(true);
    } catch (e) {
      console.warn('Audio tone failed to start', e);
    }
  };

  const stopAmbientTone = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setSoundEnabled(false);
    } catch {
      // ignore
    }
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // ignore
    }
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopAmbientTone();
    } else {
      startAmbientTone();
    }
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
    setSessionCompleted(false);
  };

  const handleClaimVictory = async () => {
    if (!quest) return;
    setIsSubmitting(true);
    try {
      stopAmbientTone();
      await onCompleteQuestWithBonus(quest.id, durationMinutes);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = durationMinutes * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white overflow-hidden animate-fade-in">
          {/* Ambient background glow */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                  Hyperfocus Chamber
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-500/30 font-semibold">
                    +20 XP Bonus
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Pomodoro Focus Session</p>
              </div>
            </div>

            <button
              onClick={() => {
                stopAmbientTone();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Linked Quest Target */}
          {quest ? (
            <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="overflow-hidden pr-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                  Target Quest
                </span>
                <p className="text-sm font-medium text-slate-200 truncate">{quest.title}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-400">+{quest.xpReward + 20} XP</span>
                <p className="text-[10px] text-slate-400">with hyperfocus</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
              <p className="text-xs text-slate-400">Standalone Deep Work Focus</p>
            </div>
          )}

          {/* Duration Presets */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setDurationMinutes(mins);
                  setTimeLeft(mins * 60);
                  setIsRunning(false);
                }}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  durationMinutes === mins
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Circular Countdown Ring */}
          <div className="relative my-8 flex items-center justify-center">
            <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#amberGradient)"
                strokeWidth="6"
                strokeDasharray={314.159}
                strokeDashoffset={314.159 - (314.159 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tight font-mono text-white drop-shadow-md">
                {formattedTime}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                {sessionCompleted ? 'Completed!' : isRunning ? 'In Deep Flow' : 'Ready to Focus'}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Disable Ambient Hum' : 'Enable Alpha Wave Ambient Hum'}
              className={`p-3 rounded-full border transition ${
                soundEnabled
                  ? 'bg-indigo-600/30 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={handleToggleTimer}
              className={`px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition shadow-lg ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" /> Pause Focus
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Start Flow
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              title="Reset Timer"
              className="p-3 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Complete Quest Button */}
          {quest && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={handleClaimVictory}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-white text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Zap className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span>Complete Quest & Claim Hyperfocus Victory!</span>
              </button>
            </div>
          )}
        </div>
      </div>
  );
};
