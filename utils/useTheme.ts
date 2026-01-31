import { useEffect, useState } from 'react';

const KEY = 'booster_theme';

export type Theme = 'light' | 'dark';

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(KEY);
      return (stored === 'dark' ? 'dark' : 'light');
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme);
    } catch {}
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  return { theme, setTheme } as const;
}
