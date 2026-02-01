/**
 * KernelContext - 内核上下文管理
 */

import { inject, provide, ref, computed, type InjectionKey, type Ref } from 'vue';
import type { KernelContextValue, KernelConnectionStatus, KernelRequest, KernelResponse } from '@/types';
import { SDKIntegration } from './SDKIntegration';

/**
 * 内核上下文注入键
 */
export const KernelContextKey: InjectionKey<KernelContextValue> = Symbol('KernelContext');

/**
 * 创建内核上下文
 */
export function createKernelContext(): KernelContextValue {
  const sdk = SDKIntegration.getInstance();
  const statusRef: Ref<KernelConnectionStatus> = ref(sdk.getStatus());

  // 初始化连接
  sdk.connect().then(() => {
    statusRef.value = sdk.getStatus();
  });

  const request = async <T>(req: KernelRequest): Promise<KernelResponse<T>> => {
    const response = await sdk.request<T>(req);
    statusRef.value = sdk.getStatus();
    return response;
  };

  const isConnected = computed(() => statusRef.value === 'connected');

  return {
    status: statusRef.value,
    request,
    isConnected: isConnected.value,
  };
}

/**
 * 提供内核上下文
 */
export function provideKernelContext(context: KernelContextValue): void {
  provide(KernelContextKey, context);
}

/**
 * 注入内核上下文
 */
export function useKernelContext(): KernelContextValue | undefined {
  return inject(KernelContextKey);
}
