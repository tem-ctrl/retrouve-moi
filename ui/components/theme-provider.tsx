'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

// next-themes injects a blocking script that applies the stored/system theme
// before first paint (no flash) and follows OS changes while in "system" mode.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from 'next-themes';
