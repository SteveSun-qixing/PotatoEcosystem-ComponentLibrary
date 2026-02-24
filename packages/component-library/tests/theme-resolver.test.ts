import { describe, expect, it } from 'vitest';
import { resolveToken, resolveTokens } from '../src/theme/resolveThemeTokens';

describe('resolveToken', () => {
  it('prefers local token over upper levels', () => {
    const token = resolveToken('chips-comp-button-bg', {
      stack: [
        { 'chips-comp-button-bg': '#111' },
        { 'chips-comp-button-bg': '#222' },
        { 'chips-comp-button-bg': '#333' },
        { 'chips-comp-button-bg': '#444' },
      ],
      defaults: { 'chips-comp-button-bg': '#555' },
    });

    expect(token).toBe('#111');
  });

  it('falls back to defaults when no level has the token', () => {
    const token = resolveToken('chips-comp-button-border', {
      stack: [],
      defaults: { 'chips-comp-button-border': '#000' },
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
