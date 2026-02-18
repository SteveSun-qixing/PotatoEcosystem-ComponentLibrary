import { describe, expect, it } from 'vitest';
import { resolveToken, resolveTokens } from '../src/theme/resolveThemeTokens';

describe('resolveToken', () => {
  it('prefers local token over upper levels', () => {
    const token = resolveToken('cmp-button-bg', {
      stack: [
        { 'cmp-button-bg': '#111' },
        { 'cmp-button-bg': '#222' },
        { 'cmp-button-bg': '#333' },
        { 'cmp-button-bg': '#444' },
      ],
      defaults: { 'cmp-button-bg': '#555' },
    });

    expect(token).toBe('#111');
  });

  it('falls back to defaults when no level has the token', () => {
    const token = resolveToken('cmp-button-border', {
      stack: [],
      defaults: { 'cmp-button-border': '#000' },
    });

    expect(token).toBe('#000');
  });

  it('resolves a token bag with mixed levels', () => {
    const tokens = resolveTokens(['a', 'b', 'c'], {
      stack: [{ a: '1' }, { b: '2' }, { c: '3' }],
      defaults: {},
    });

    expect(tokens).toEqual({ a: '1', b: '2', c: '3' });
  });
});
