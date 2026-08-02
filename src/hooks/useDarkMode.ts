'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cso_theme_preference';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Initialize theme based on localStorage override or OS system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedPreference = localStorage.getItem(STORAGE_KEY);

    if (savedPreference === 'dark') {
      setDarkMode(true);
    } else if (savedPreference === 'light') {
      setDarkMode(false);
    } else {
      // Default to System Theme Preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    }

    // Listen for OS System Theme Changes (when no manual override is set)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const userHasCustomPref = localStorage.getItem(STORAGE_KEY) !== null;
      if (!userHasCustomPref) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Update HTML class & sync localStorage when theme state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);

    // Save user choice when toggled manually
    const currentSaved = localStorage.getItem(STORAGE_KEY);
    if (currentSaved !== null || darkMode !== window.matchMedia('(prefers-color-scheme: dark)').matches) {
      localStorage.setItem(STORAGE_KEY, darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
}
