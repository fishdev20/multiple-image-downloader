'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-lg border dark:bg-slate-800">
      {theme === 'light' ? (
        <BsFillMoonFill
          onClick={() => {
            setTheme('dark');
          }}
        />
      ) : (
        <BsFillSunFill
          onClick={() => {
            setTheme('light');
          }}
        />
      )}
    </button>
  );
}
