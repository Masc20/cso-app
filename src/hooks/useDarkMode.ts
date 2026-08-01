'use client';

import { useEffect, useState } from 'react';

export function useDarkMode(initialValue = true) {
  const [darkMode, setDarkMode] = useState(initialValue);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return { darkMode, setDarkMode };
}
