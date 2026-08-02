/**
 * Server-Side In-Memory Rate Limiter for Next.js App Router
 * Tracks requests in RAM to block brute-force attacks in < 1ms
 * without executing database queries or touching Supabase servers.
 */

import type { RateLimitRecord } from '@/types';

export type { RateLimitRecord };

// -------------------------------------------------------------
// Generic Core Rate-Limiting Engine
// -------------------------------------------------------------
function checkEngine(
  map: Map<string, RateLimitRecord>,
  identifier: string,
  maxAttempts: number
): { success: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = map.get(identifier);

  if (!record) {
    return { success: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { success: false, remainingAttempts: 0, retryAfterSeconds };
  }

  if (now > record.resetTime) {
    map.delete(identifier);
    return { success: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, maxAttempts - record.count);
  return { success: remaining > 0, remainingAttempts: remaining, retryAfterSeconds: 0 };
}

function recordEngine(
  map: Map<string, RateLimitRecord>,
  identifier: string,
  maxAttempts: number,
  windowMs: number,
  cooldownMs: number
): { isLocked: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const now = Date.now();
  let record = map.get(identifier);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs, lockedUntil: 0 };
  } else {
    record.count += 1;
  }

  if (record.count >= maxAttempts) {
    record.lockedUntil = now + cooldownMs;
    map.set(identifier, record);
    return { isLocked: true, remainingAttempts: 0, retryAfterSeconds: Math.ceil(cooldownMs / 1000) };
  }

  map.set(identifier, record);
  return { isLocked: false, remainingAttempts: maxAttempts - record.count, retryAfterSeconds: 0 };
}

// -------------------------------------------------------------
// Admin Auth Rate Limiter (Max 3 attempts, 60s lockout)
// -------------------------------------------------------------
const ADMIN_MAX_ATTEMPTS = 3;
const ADMIN_WINDOW_MS = 60 * 1000;
const adminRateLimitMap = new Map<string, RateLimitRecord>();

export function checkServerRateLimit(identifier: string) {
  return checkEngine(adminRateLimitMap, identifier, ADMIN_MAX_ATTEMPTS);
}

export function recordFailedServerAttempt(identifier: string) {
  return recordEngine(adminRateLimitMap, identifier, ADMIN_MAX_ATTEMPTS, ADMIN_WINDOW_MS, ADMIN_WINDOW_MS);
}

export function resetServerRateLimit(identifier: string): void {
  adminRateLimitMap.delete(identifier);
}

// -------------------------------------------------------------
// Registration Form Rate Limiter (Max 10 submissions per IP, 30s cooldown)
// -------------------------------------------------------------
const REGISTRATION_MAX_SUBMISSIONS = 10;
const REGISTRATION_WINDOW_MS = 5 * 60 * 1000; // 5 minutes window
const REGISTRATION_COOLDOWN_MS = 30 * 1000;   // 30 seconds cooldown
const registrationRateLimitMap = new Map<string, RateLimitRecord>();

export function checkRegistrationRateLimit(identifier: string) {
  const res = checkEngine(registrationRateLimitMap, identifier, REGISTRATION_MAX_SUBMISSIONS);
  return {
    success: res.success,
    remainingSubmissions: res.remainingAttempts,
    retryAfterSeconds: res.retryAfterSeconds
  };
}

export function recordRegistrationSubmission(identifier: string) {
  const res = recordEngine(
    registrationRateLimitMap,
    identifier,
    REGISTRATION_MAX_SUBMISSIONS,
    REGISTRATION_WINDOW_MS,
    REGISTRATION_COOLDOWN_MS
  );
  return {
    isLocked: res.isLocked,
    remainingSubmissions: res.remainingAttempts,
    retryAfterSeconds: res.retryAfterSeconds
  };
}

// Periodic cleanup of expired rate limit maps
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of adminRateLimitMap.entries()) {
    if (now > record.resetTime && now > record.lockedUntil) adminRateLimitMap.delete(key);
  }
  for (const [key, record] of registrationRateLimitMap.entries()) {
    if (now > record.resetTime && now > record.lockedUntil) registrationRateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);
