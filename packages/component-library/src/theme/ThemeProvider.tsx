import type { CSSProperties, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { ThemeNode, TokenBag } from './types';
import { resolveTokens } from './resolveThemeTokens';

interface ThemeProviderProps extends PropsWithChildren {
  className?: string;
  tokens?: TokenBag;
  defaults?: TokenBag;
}

const ThemeContext = createContext<ThemeNode>({
  stack: [],
  defaults: {},
});

function toCssVars(tokens: TokenBag): CSSProperties {
  const style: Record<string, string> = {};

  for (const [key, value] of Object.entries(tokens)) {
    style[`--${key}`] = value;
  }

  return style as CSSProperties;
}

export function ThemeProvider({
  children,
  className,
  tokens,
  defaults,
}: ThemeProviderProps) {
  const parent = useThemeContext();
  const value = useMemo<ThemeNode>(() => {
    const parentStack = parent?.stack ?? [];
    const stack = tokens ? [tokens, ...parentStack] : parentStack;
    return {
      stack,
      defaults: defaults ?? parent?.defaults ?? {},
    };
  }, [defaults, parent, tokens]);

  const cssVars = useMemo(() => {
    const keys = new Set<string>(Object.keys(value.defaults));
    for (const layer of value.stack) {
      for (const key of Object.keys(layer)) {
        keys.add(key);
      }
    }

    return toCssVars(resolveTokens([...keys], value));
  }, [value]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={className} style={cssVars}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export interface ThemeScopeProps extends PropsWithChildren {
  className?: string;
  tokens: TokenBag;
}

export function ThemeScope({ className, tokens, children }: ThemeScopeProps) {
  const props = {
    tokens,
    ...(className !== undefined ? { className } : {}),
  };

  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  );
}

export function useThemeContext(): ThemeNode {
  return useContext(ThemeContext);
}
