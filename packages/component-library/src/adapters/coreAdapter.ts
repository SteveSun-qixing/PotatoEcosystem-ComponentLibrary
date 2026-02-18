import { normalizeCoreRequest } from './normalizeRequest';
import type { CoreRequest, CoreResponse, CoreTransport, NormalizedCoreRequest } from './types';

interface ChipsCoreLike {
  request: <TData = unknown>(
    request: CoreRequest | NormalizedCoreRequest,
  ) => Promise<CoreResponse<TData>>;
}

export function createWindowCoreTransport(getCore: () => ChipsCoreLike | undefined): CoreTransport {
  return {
    async request<TData>(request: CoreRequest) {
      const core = getCore();
      if (!core || typeof core.request !== 'function') {
        return {
          success: false,
          error: {
            code: 'CORE_UNAVAILABLE',
            message: 'Chips core transport is not available in current runtime',
          },
        };
      }

      const normalized = normalizeCoreRequest(request);

      try {
        return await core.request<TData>(normalized);
      } catch {
        return core.request<TData>(request);
      }
    },
  };
}
