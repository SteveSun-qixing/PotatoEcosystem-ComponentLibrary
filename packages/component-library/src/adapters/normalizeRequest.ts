import type { CoreRequest, NormalizedCoreRequest } from './types';

export function normalizeCoreRequest<TPayload = Record<string, unknown>>(
  request: CoreRequest<TPayload>,
): NormalizedCoreRequest<TPayload> {
  const payload = (request.payload ?? {}) as TPayload;
  const timeout = request.timeoutMs ?? request.timeout;

  if (request.service && request.method) {
    return {
      service: request.service,
      method: request.method,
      payload,
      ...(timeout !== undefined ? { timeout } : {}),
    };
  }

  if (request.action) {
    const [service, method] = request.action.split('.');
    if (!service || !method) {
      throw new Error(`Invalid action format: "${request.action}". Expected "service.method".`);
    }

    return {
      service,
      method,
      payload,
      ...(timeout !== undefined ? { timeout } : {}),
    };
  }

  throw new Error('Core request requires either {service, method} or {action}.');
}
