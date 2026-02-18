import { describe, expect, it, vi } from 'vitest';
import { createLogger } from '../src/telemetry';

describe('logger', () => {
  it('respects minimum level and forwards log entries to sink', () => {
    const sink = vi.fn();
    const logger = createLogger({ minLevel: 'warn', sink });

    logger.info('skip me');
    logger.warn('warn me', { traceId: 'abc' });

    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink).toHaveBeenCalledWith({
      level: 'warn',
      message: 'warn me',
      context: { traceId: 'abc' },
    });
  });
});
