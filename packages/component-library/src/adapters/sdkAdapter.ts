import { normalizeCoreRequest } from './normalizeRequest';
import type { CoreRequest, CoreResponse, CoreTransport, NormalizedCoreRequest } from './types';

interface SdkLike {
  request?: <TData = unknown>(request: CoreRequest | NormalizedCoreRequest) => Promise<CoreResponse<TData>>;
  connector?: {
    request?: <TData = unknown>(request: NormalizedCoreRequest) => Promise<CoreResponse<TData>>;
  };
  core?: {
    request?: <TData = unknown>(request: CoreRequest | NormalizedCoreRequest) => Promise<CoreResponse<TData>>;
  };
}

export function createSdkTransport(sdk: SdkLike): CoreTransport {
  const sdkRequest = sdk.request ?? sdk.core?.request;
  const connectorRequest = sdk.connector?.request;

  if (!sdkRequest && !connectorRequest) {
    throw new Error('SDK transport requires request() on sdk/core or connector.request()');
  }

  return {
    async request<TData>(request: CoreRequest) {
      const normalized = normalizeCoreRequest(request);

      if (connectorRequest) {
        return connectorRequest<TData>(normalized);
      }

      return (sdkRequest as NonNullable<typeof sdkRequest>)<TData>(normalized);
    },
  };
}
