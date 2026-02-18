import { useMemo } from 'react';
import { resolveToken, resolveTokens } from './resolveThemeTokens';
import { useThemeContext } from './ThemeProvider';

export function useThemeToken(key: string): string | undefined {
  const theme = useThemeContext();
  return useMemo(() => resolveToken(key, theme), [key, theme]);
}

export function useThemeTokens(keys: string[]): Record<string, string> {
  const theme = useThemeContext();
  return useMemo(() => resolveTokens(keys, theme), [keys, theme]);
}
