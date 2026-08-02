/**
 * Server-Side In-Memory Rate Limiter for Next.js App Router
 * Tracks failed login attempts in RAM to block brute-force attacks in < 1ms
 * without executing database queries or touching Supabase servers.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockedUntil: number;
}

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 1000; // 60 seconds lockout

// In-Memory RAM Map
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent RAM growth
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime && now > record.lockedUntil) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkServerRateLimit(identifier: string): {
  success: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record) {
    return { success: true, remainingAttempts: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  // Check if currently locked out
  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      remainingAttempts: 0,
      retryAfterSeconds
    };
  }

  // If window expired, reset record
  if (now > record.resetTime) {
    rateLimitMap.delete(identifier);
    return { success: true, remainingAttempts: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return {
    success: remaining > 0,
    remainingAttempts: remaining,
    retryAfterSeconds: 0
  };
}

export function recordFailedServerAttempt(identifier: string): {
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  let record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + WINDOW_MS,
      lockedUntil: 0
    };
  } else {
    record.count += 1;
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + WINDOW_MS;
    rateLimitMap.set(identifier, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: 60
    };
  }

  rateLimitMap.set(identifier, record);
  return {
    isLocked: false,
    remainingAttempts: MAX_ATTEMPTS - record.count,
    retryAfterSeconds: 0
  };
}

export function resetServerRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}
