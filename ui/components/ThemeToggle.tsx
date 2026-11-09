'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

// True only after hydration: the resolved theme is unknown during SSR.
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

/*
 * Two-state toggle (light ↔ dark). Visitors start on the OS theme
 * (defaultTheme="system" in app/layout.tsx); clicking stores an explicit choice.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === 'dark';
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Passer au thème clair' : 'Passer au thème sombre';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn('p-2 rounded-lg transition-colors hover:bg-white/10', className)}
      aria-label={label}
      title={label}
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}
