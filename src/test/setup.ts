/**
 * Vitest 测试设置文件
 */

import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// 全局组件存根
config.global.stubs = {
  // 可以在这里添加需要全局存根的组件
};

// 全局指令
config.global.directives = {
  // 可以在这里添加需要全局注册的指令
};

// 全局 mocks
config.global.mocks = {
  // 可以在这里添加需要全局 mock 的对象
};

// 测试工具函数
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = ReturnType<typeof vi.fn<any>>;

export function mockConsole(): {
  log: MockFn;
  warn: MockFn;
  error: MockFn;
  restore: () => void;
} {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  const log = vi.fn();
  const warn = vi.fn();
  const error = vi.fn();

  console.log = log;
  console.warn = warn;
  console.error = error;

  return {
    log,
    warn,
    error,
    restore: () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    },
  };
}
