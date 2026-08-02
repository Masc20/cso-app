'use client';

import { useState, useEffect } from 'react';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_SECONDS = 60; // 1 minute lockout
const STORAGE_KEY_ATTEMPTS = 'cso_admin_login_attempts';
const STORAGE_KEY_LOCKOUT = 'cso_admin_login_lockout_until';

export function useRateLimiter() {
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Initialize state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedAttempts = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10);
    const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEY_LOCKOUT) || '0', 10);
    const now = Date.now();

    if (lockoutUntil > now) {
      const diffSec = Math.ceil((lockoutUntil - now) / 1000);
      setIsLocked(true);
      setRemainingSeconds(diffSec);
      setAttempts(MAX_ATTEMPTS);
    } else {
      // Lockout expired
      if (lockoutUntil > 0) {
        localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        localStorage.setItem(STORAGE_KEY_ATTEMPTS, '0');
      } else {
        setAttempts(savedAttempts);
      }
    }
  }, []);

  // Live countdown ticker for lockout
  useEffect(() => {
    if (!isLocked || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          setAttempts(0);
          localStorage.removeItem(STORAGE_KEY_LOCKOUT);
          localStorage.setItem(STORAGE_KEY_ATTEMPTS, '0');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, remainingSeconds]);

  // Record a failed login attempt
  const recordFailedAttempt = (): { locked: boolean; attemptsLeft: number } => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, String(nextAttempts));

    if (nextAttempts >= MAX_ATTEMPTS) {
      const lockoutTimestamp = Date.now() + LOCKOUT_DURATION_SECONDS * 1000;
      localStorage.setItem(STORAGE_KEY_LOCKOUT, String(lockoutTimestamp));
      setIsLocked(true);
      setRemainingSeconds(LOCKOUT_DURATION_SECONDS);
      return { locked: true, attemptsLeft: 0 };
    }

    return { locked: false, attemptsLeft: MAX_ATTEMPTS - nextAttempts };
  };

  // Reset rate limiter upon successful login
  const resetLimiter = () => {
    setAttempts(0);
    setIsLocked(false);
    setRemainingSeconds(0);
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_LOCKOUT);
  };

  return {
    attempts,
    isLocked,
    remainingSeconds,
    maxAttempts: MAX_ATTEMPTS,
    recordFailedAttempt,
    resetLimiter
  };
}
