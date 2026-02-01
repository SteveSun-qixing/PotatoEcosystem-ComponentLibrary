/**
 * SDKIntegration - 与薯片内核SDK的集成层
 *
 * 封装与 Chips-Core 的通信
 */

import type {
  KernelRequest,
  KernelResponse,
  KernelError,
  KernelConnectionStatus,
  FoundationModule,
} from '@/types';

/**
 * SDK 集成配置
 */
export interface SDKIntegrationConfig {
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 错误处理回调 */
  onError?: (error: KernelError) => void;
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Required<SDKIntegrationConfig> = {
  timeout: 30000,
  debug: false,
  onError: () => {},
};

/**
 * SDK 集成类
 *
 * 单例模式，负责与 Chips-Core 的通信
 */
export class SDKIntegration {
  private static instance: SDKIntegration;
  private config: Required<SDKIntegrationConfig>;
  private status: KernelConnectionStatus = 'disconnected';
  private connectionPromise: Promise<void> | null = null;

  private constructor(config?: SDKIntegrationConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: SDKIntegrationConfig): SDKIntegration {
    if (!SDKIntegration.instance) {
      SDKIntegration.instance = new SDKIntegration(config);
    }
    return SDKIntegration.instance;
  }

  /**
   * 重置实例（仅用于测试）
   */
  static resetInstance(): void {
    SDKIntegration.instance = undefined as unknown as SDKIntegration;
  }

  /**
   * 获取连接状态
   */
  getStatus(): KernelConnectionStatus {
    return this.status;
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.status === 'connected';
  }

  /**
   * 连接到内核
   */
  async connect(): Promise<void> {
    if (this.status === 'connected') {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.status = 'connecting';

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      // 模拟连接过程
      // 实际实现中，这里会调用 Core 的连接 API
      setTimeout(() => {
        try {
          // 检查 Core 是否可用
          if (typeof window !== 'undefined' && 'ChipsCore' in window) {
            this.status = 'connected';
            resolve();
          } else {
            // 在开发环境中，模拟连接成功
            if (this.config.debug) {
              console.warn('[SDKIntegration] ChipsCore not found, using mock mode');
            }
            this.status = 'connected';
            resolve();
          }
        } catch (error) {
          this.status = 'error';
          reject(error);
        } finally {
          this.connectionPromise = null;
        }
      }, 100);
    });

    return this.connectionPromise;
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.status = 'disconnected';
    this.connectionPromise = null;
  }

  /**
   * 发送请求到内核
   */
  async request<T = unknown>(req: KernelRequest): Promise<KernelResponse<T>> {
    // 确保已连接
    if (!this.isConnected()) {
      await this.connect();
    }

    const { target, action, params, timeout = this.config.timeout } = req;

    if (this.config.debug) {
      console.log(`[SDKIntegration] Request: ${target}.${action}`, params);
    }

    try {
      // 创建超时 Promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout: ${target}.${action}`));
        }, timeout);
      });

      // 实际请求
      const requestPromise = this.sendRequest<T>(target, action, params);

      // 竞争
      const response = await Promise.race([requestPromise, timeoutPromise]);

      if (this.config.debug) {
        console.log(`[SDKIntegration] Response: ${target}.${action}`, response);
      }

      return response;
    } catch (error) {
      const kernelError: KernelError = {
        code: 'REQUEST_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };

      this.config.onError(kernelError);

      return {
        success: false,
        error: kernelError,
      };
    }
  }

  /**
   * 发送请求的内部实现
   */
  private async sendRequest<T>(
    target: string,
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> {
    // 检查是否有真实的 Core API
    if (typeof window !== 'undefined' && 'ChipsCore' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const core = (window as any).ChipsCore;
      if (typeof core.request === 'function') {
        return core.request({ target, action, params });
      }
    }

    // 模拟响应（开发模式）
    return this.mockRequest<T>(target, action, params);
  }

  /**
   * 模拟请求响应（开发模式）
   */
  private async mockRequest<T>(
    _target: string,
    _action: string,
    _params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> {
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 返回模拟成功响应
    return {
      success: true,
      data: undefined as T,
    };
  }

  /**
   * 调用公共基础层模块
   */
  async callFoundation<T = unknown>(
    module: FoundationModule,
    action: string,
    params?: Record<string, unknown>
  ): Promise<KernelResponse<T>> {
    return this.request<T>({
      target: `Foundation.${module}`,
      action,
      params,
    });
  }
}

export default SDKIntegration;
