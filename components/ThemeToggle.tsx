'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-white dark:bg-[#4A3E3D] border border-slate-200 dark:border-[#52433A] w-[34px] h-[34px]" />
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-white dark:bg-[#4A3E3D] hover:bg-slate-100 dark:hover:bg-[#52433A] text-[#F7882F] dark:text-[#F7C331] border border-slate-200 dark:border-[#52433A] transition-colors cursor-pointer flex items-center justify-center"
      title="Toggle Theme"
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
