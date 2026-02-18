import type { ThemeNode, TokenBag } from './types';

export function resolveToken(key: string, node: ThemeNode): string | undefined {
  for (const level of node.stack) {
    const value = level[key];
    if (value !== undefined) {
      return value;
    }
  }

  return node.defaults[key];
}

export function resolveTokens(keys: string[], node: ThemeNode): TokenBag {
  const out: TokenBag = {};

  for (const key of keys) {
    const resolved = resolveToken(key, node);
    if (resolved !== undefined) {
      out[key] = resolved;
    }
  }

  return out;
}
