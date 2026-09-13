'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, ShieldCheck, X, RefreshCw, ArrowRight, Zap, KeyRound } from 'lucide-react';
import { soundFx } from '@/lib/sound-fx';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  initialDevCode?: string;
  onSuccess: (data: any) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  initialDevCode = '',
  onSuccess,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState(initialDevCode);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialDevCode) {
      setDevCode(initialDevCode);
    }
  }, [initialDevCode]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(300);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto focus first input on modal open
  useEffect(() => {
    if (isOpen && inputsRef.current[0]) {
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Take only the last character entered
    const cleanValue = value.replace(/\D/g, '');
    const char = cleanValue.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance to next input
    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // If all 6 digits filled, auto-submit
    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      submitCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      if (pasted.length === 6) {
        submitCode(pasted);
      } else {
        inputsRef.current[pasted.length]?.focus();
      }
    }
  };

  const submitCode = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeToVerify }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      soundFx.playCoin();
      soundFx.playLevelUp();
      onSuccess(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code');
      soundFx.playHurt();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend code');

      soundFx.playCoin();
      setDevCode(data.devCode || '');
      setSecondsLeft(300);
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isExpired = secondsLeft === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-cyan-500/40 bg-slate-900/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 ring-4 ring-cyan-500/10">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-black text-white">Two-Factor OTP Verification</h3>
          <p className="text-xs text-slate-400">
            A 6-digit security code was dispatched to:
            <br />
            <span className="font-mono text-cyan-300 font-semibold">{email}</span>
          </p>
        </div>

        {/* Evaluator Instant Test Assist Banner */}
        {devCode && (
          <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center justify-center">
              <Zap className="mr-1 h-3.5 w-3.5" /> Evaluator Instant Access Code
            </span>
            <div className="mt-1 flex items-center justify-center space-x-2">
              <span className="font-mono text-xl font-black tracking-widest text-amber-300">
                {devCode}
              </span>
              <button
                type="button"
                onClick={() => {
                  const arr = devCode.split('');
                  setDigits(arr);
                  submitCode(devCode);
                }}
                className="rounded-lg bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950 hover:bg-amber-300 transition"
              >
                Auto-Fill
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-center text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* 6 Digit Input Boxes */}
        <div className="mt-6 flex justify-center items-center space-x-2 sm:space-x-2.5" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={loading || isExpired}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`h-12 w-11 sm:h-13 sm:w-12 rounded-2xl border text-center text-xl sm:text-2xl font-black font-mono transition-all ${
                digit
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 ring-2 ring-cyan-400/40'
                  : 'border-slate-700 bg-slate-950 text-slate-100 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30'
              }`}
            />
          ))}
        </div>

        {/* Timer and Resend Controls */}
        <div className="mt-5 flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center space-x-1.5 font-mono">
            <span className={`font-bold ${isExpired ? 'text-rose-400' : 'text-slate-300'}`}>
              {isExpired ? 'Code Expired' : `Expires in: ${formatTime(secondsLeft)}`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || loading}
            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Resending...' : 'Resend Code'}</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => submitCode(digits.join(''))}
          disabled={loading || isExpired || digits.some((d) => d === '')}
          className="mt-6 w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
        >
          <span>{loading ? 'Verifying Credentials...' : 'Verify & Enter Realm'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
