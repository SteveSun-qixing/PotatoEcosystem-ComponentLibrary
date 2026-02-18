import { describe, expect, it, vi } from 'vitest';
import { createSdkTransport, createWindowCoreTransport } from '../src/adapters';

describe('adapters', () => {
  it('creates sdk transport from sdk.request and normalizes action', async () => {
    const request = vi.fn(async () => ({ success: true }));
    const transport = createSdkTransport({
      request,
    });

    const result = await transport.request({
      action: 'card.read',
      payload: { card_id: 'abc' },
      timeoutMs: 800,
    });

    expect(result.success).toBe(true);
    expect(request).toHaveBeenCalledWith({
      service: 'card',
      method: 'read',
      payload: { card_id: 'abc' },
      timeout: 800,
    });
  });

  it('uses sdk.connector.request when provided', async () => {
    const connectorRequest = vi.fn(async () => ({ success: true }));
    const transport = createSdkTransport({
      connector: {
        request: connectorRequest,
      },
    });

    await transport.request({
      service: 'box',
      method: 'query',
      payload: { limit: 20 },
    });

    expect(connectorRequest).toHaveBeenCalledWith({
      service: 'box',
      method: 'query',
      payload: { limit: 20 },
    });
  });

  it('returns unavailable when core is missing', async () => {
    const transport = createWindowCoreTransport(() => undefined);
    const result = await transport.request({ action: 'card.read' });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('CORE_UNAVAILABLE');
  });

  it('sends normalized request to window core transport', async () => {
    const request = vi.fn(async () => ({ success: true }));
    const transport = createWindowCoreTransport(() => ({ request }));

    await transport.request({
      action: 'card.read',
      payload: { card_id: 'x1' },
      timeout: 300,
    });

    expect(request).toHaveBeenCalledWith({
      service: 'card',
      method: 'read',
      payload: { card_id: 'x1' },
      timeout: 300,
    });
  });
});
