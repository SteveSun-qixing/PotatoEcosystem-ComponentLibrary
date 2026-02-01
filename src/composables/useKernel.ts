/**
 * useKernel - 内核通信组合式函数
 */

import { inject, computed, ref } from 'vue';
import { KernelContextKey } from '@/kernel/KernelContext';
import { SDKIntegration } from '@/kernel/SDKIntegration';
import type { KernelResponse, FoundationModule } from '@/types';

/**
 * 内核通信组合式函数
 */
export function useKernel() {
  const context = inject(KernelContextKey);
  const sdk = SDKIntegration.getInstance();

  /**
   * 连接状态
   */
  const status = computed(() => context?.status ?? sdk.getStatus());

  /**
   * 是否已连接
   */
  const isConnected = computed(() => status.value === 'connected');

  /**
   * 发送请求
   */
  const request = async <T>(
    target: string,
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    if (context) {
      return context.request<T>({ target, action, params });
    }
    return sdk.request<T>({ target, action, params });
  };

  /**
   * 调用公共基础层模块
   */
  const callFoundation = async <T>(
    module: FoundationModule,
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    return sdk.callFoundation<T>(module, action, params);
  };

  /**
   * 快捷方法：调用 UIControls
   */
  const callUIControls = async <T>(
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    return callFoundation<T>('UIControls', action, params);
  };

  /**
   * 快捷方法：调用 WindowManager
   */
  const callWindowManager = async <T>(
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    return callFoundation<T>('WindowManager', action, params);
  };

  /**
   * 快捷方法：调用 I18nSystem
   */
  const callI18n = async <T>(
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    return callFoundation<T>('I18nSystem', action, params);
  };

  /**
   * 快捷方法：调用 LogSystem
   */
  const callLog = async <T>(
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    return callFoundation<T>('LogSystem', action, params);
  };

  /**
   * 快捷方法：调用 NotificationCenter
   */
  const callNotification = async <T>(
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> => {
    return callFoundation<T>('NotificationCenter', action, params);
  };

  return {
    status,
    isConnected,
    request,
    callFoundation,
    callUIControls,
    callWindowManager,
    callI18n,
    callLog,
    callNotification,
  };
}

/**
 * 带加载状态的请求 Hook
 */
export function useKernelRequest<T>(
  target: string,
  action: string,
  params?: Record<string, unknown>
) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<T | null>(null);

  const { request } = useKernel();

  const execute = async (overrideParams?: Record<string, unknown>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await request<T>(target, action, overrideParams ?? params);

      if (response.success) {
        data.value = response.data ?? null;
      } else {
        error.value = new Error(response.error?.message ?? 'Request failed');
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    data,
    execute,
  };
}

export default useKernel;
