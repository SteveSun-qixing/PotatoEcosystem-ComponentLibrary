import { describe, expect, it } from 'vitest';
import { normalizeCoreRequest } from '../src/adapters';

describe('normalizeCoreRequest', () => {
  it('normalizes action format', () => {
    const normalized = normalizeCoreRequest({
      action: 'card.read',
      payload: { card_id: 'x1' },
      timeoutMs: 1200,
    });

    expect(normalized).toEqual({
      service: 'card',
      method: 'read',
      payload: { card_id: 'x1' },
      timeout: 1200,
    });
  });

  it('normalizes service+method format', () => {
    const normalized = normalizeCoreRequest({
      service: 'box',
      method: 'query',
      payload: { limit: 10 },
      timeout: 900,
    });

    expect(normalized).toEqual({
      service: 'box',
      method: 'query',
      payload: { limit: 10 },
      timeout: 900,
    });
  });

  it('throws for invalid action format', () => {
    expect(() => normalizeCoreRequest({ action: 'invalid-action' })).toThrow();
  });
});
