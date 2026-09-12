'use client';
import confetti from 'canvas-confetti';

export function fireQuestConfetti(originX = 0.5, originY = 0.6) {
  if (typeof window === 'undefined') return;

  confetti({
    particleCount: 40,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    ticks: 150,
    gravity: 1.2,
    scalar: 0.8,
  });
}

export function fireLevelUpConfetti() {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#fbbf24', '#f59e0b', '#d97706'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#a855f7', '#6366f1', '#3b82f6'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#10b981', '#14b8a6'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
