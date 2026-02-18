export interface CoreRequest<TPayload = Record<string, unknown>> {
  service?: string;
  method?: string;
  action?: string;
  payload?: TPayload;
  timeoutMs?: number;
  timeout?: number;
}

export interface CoreResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: {
    code: string;
    message: string;
  };
}

export interface CoreTransport {
  request<TData = unknown>(request: CoreRequest): Promise<CoreResponse<TData>>;
}

export interface NormalizedCoreRequest<TPayload = Record<string, unknown>> {
  service: string;
  method: string;
  payload: TPayload;
  timeout?: number;
}
