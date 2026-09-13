// High-performance in-memory sliding window rate limiter
// Protects authentication and critical endpoints from brute-force and credential stuffing

interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup every 5 minutes to prevent memory leak
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if request is allowed
   * @param key unique identifier, e.g. "login:192.168.1.1" or user email
   * @param maxRequests maximum allowed requests within windowMs
   * @param windowMs time window in milliseconds (e.g. 15 * 60 * 1000 for 15 minutes)
   */
  public check(
    key: string,
    maxRequests: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): {
    allowed: boolean;
    current: number;
    remaining: number;
    resetInSeconds: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    const count = record.timestamps.length;

    if (count >= maxRequests) {
      const oldest = record.timestamps[0];
      const resetInMs = oldest + windowMs - now;
      const resetInSeconds = Math.max(1, Math.ceil(resetInMs / 1000));
      return {
        allowed: false,
        current: count,
        remaining: 0,
        resetInSeconds,
      };
    }

    // Record this attempt
    record.timestamps.push(now);

    return {
      allowed: true,
      current: count + 1,
      remaining: maxRequests - (count + 1),
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  /**
   * Reset rate limit for a given key (e.g. on successful login)
   */
  public reset(key: string): void {
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > now - maxAge);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimiter = new SlidingWindowRateLimiter();

/**
 * Extracts client IP from request headers (x-forwarded-for, x-real-ip, etc.)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
