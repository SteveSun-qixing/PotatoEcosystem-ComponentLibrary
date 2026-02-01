/**
 * 内核通信模块导出
 */

export { SDKIntegration, type SDKIntegrationConfig } from './SDKIntegration';
export {
  KernelContextKey,
  createKernelContext,
  provideKernelContext,
  useKernelContext,
} from './KernelContext';
