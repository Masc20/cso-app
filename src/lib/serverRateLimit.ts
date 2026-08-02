/**
 * Server-Side In-Memory Rate Limiter for Next.js App Router
 * Tracks requests in RAM to block brute-force attacks in < 1ms
 * without executing database queries or touching Supabase servers.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockedUntil: number;
}

// -------------------------------------------------------------
// Admin Auth Rate Limiter (Max 3 attempts, 60s lockout)
// -------------------------------------------------------------
const ADMIN_MAX_ATTEMPTS = 3;
const ADMIN_WINDOW_MS = 60 * 1000;

const adminRateLimitMap = new Map<string, RateLimitRecord>();

export function checkServerRateLimit(identifier: string): {
  success: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = adminRateLimitMap.get(identifier);

  if (!record) {
    return { success: true, remainingAttempts: ADMIN_MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      remainingAttempts: 0,
      retryAfterSeconds
    };
  }

  if (now > record.resetTime) {
    adminRateLimitMap.delete(identifier);
    return { success: true, remainingAttempts: ADMIN_MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, ADMIN_MAX_ATTEMPTS - record.count);
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
  let record = adminRateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + ADMIN_WINDOW_MS,
      lockedUntil: 0
    };
  } else {
    record.count += 1;
  }

  if (record.count >= ADMIN_MAX_ATTEMPTS) {
    record.lockedUntil = now + ADMIN_WINDOW_MS;
    adminRateLimitMap.set(identifier, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: 60
    };
  }

  adminRateLimitMap.set(identifier, record);
  return {
    isLocked: false,
    remainingAttempts: ADMIN_MAX_ATTEMPTS - record.count,
    retryAfterSeconds: 0
  };
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

export function checkRegistrationRateLimit(identifier: string): {
  success: boolean;
  remainingSubmissions: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = registrationRateLimitMap.get(identifier);

  if (!record) {
    return { success: true, remainingSubmissions: REGISTRATION_MAX_SUBMISSIONS, retryAfterSeconds: 0 };
  }

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      remainingSubmissions: 0,
      retryAfterSeconds
    };
  }

  if (now > record.resetTime) {
    registrationRateLimitMap.delete(identifier);
    return { success: true, remainingSubmissions: REGISTRATION_MAX_SUBMISSIONS, retryAfterSeconds: 0 };
  }

  const remaining = Math.max(0, REGISTRATION_MAX_SUBMISSIONS - record.count);
  return {
    success: remaining > 0,
    remainingSubmissions: remaining,
    retryAfterSeconds: 0
  };
}

export function recordRegistrationSubmission(identifier: string): {
  isLocked: boolean;
  remainingSubmissions: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  let record = registrationRateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + REGISTRATION_WINDOW_MS,
      lockedUntil: 0
    };
  } else {
    record.count += 1;
  }

  if (record.count >= REGISTRATION_MAX_SUBMISSIONS) {
    record.lockedUntil = now + REGISTRATION_COOLDOWN_MS;
    registrationRateLimitMap.set(identifier, record);
    return {
      isLocked: true,
      remainingSubmissions: 0,
      retryAfterSeconds: 30
    };
  }

  registrationRateLimitMap.set(identifier, record);
  return {
    isLocked: false,
    remainingSubmissions: REGISTRATION_MAX_SUBMISSIONS - record.count,
    retryAfterSeconds: 0
  };
}

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of adminRateLimitMap.entries()) {
    if (now > record.resetTime && now > record.lockedUntil) {
      adminRateLimitMap.delete(key);
    }
  }
  for (const [key, record] of registrationRateLimitMap.entries()) {
    if (now > record.resetTime && now > record.lockedUntil) {
      registrationRateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);
