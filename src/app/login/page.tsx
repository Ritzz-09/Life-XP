'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthView } from '@/components/AuthView';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace('/');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        setChecking(false);
      });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-bg-overlay">
        <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 animate-spin flex items-center justify-center text-amber-400">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
    );
  }

  return (
    <AuthView
      initialTab="LOGIN"
      onSuccess={() => {
        router.push('/');
      }}
    />
  );
}
