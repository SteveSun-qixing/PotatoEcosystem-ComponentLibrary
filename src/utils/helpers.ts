/**
 * 通用工具函数
 */

import type { ComposeEventHandlersOptions } from '@/types';

/**
 * 组合事件处理器
 *
 * @example
 * const onClick = composeEventHandlers(
 *   props.onClick,
 *   (e) => console.log('internal click')
 * )
 */
export function composeEventHandlers<E extends Event>(
  externalHandler?: (event: E) => void,
  internalHandler?: (event: E) => void,
  options: ComposeEventHandlersOptions = {}
): (event: E) => void {
  const { checkDefaultPrevented = true } = options;

  return (event: E) => {
    externalHandler?.(event);

    if (!checkDefaultPrevented || !event.defaultPrevented) {
      internalHandler?.(event);
    }
  };
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastTime >= delay) {
      fn(...args);
      lastTime = now;
    }
  };
}

/**
 * 生成唯一 ID
 */
let idCounter = 0;
export function generateId(prefix = 'chips'): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 判断是否为空值 (null 或 undefined)
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * 判断是否为函数
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * 判断是否为对象
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 判断是否为字符串
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * 判断是否为数字
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * 判断是否为布尔值
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * 从对象中排除指定属性
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * 从对象中选取指定属性
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * 深度克隆
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepClone) as T;
  }

  const result: Record<string, unknown> = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepClone((value as Record<string, unknown>)[key]);
    }
  }
  return result as T;
}

/**
 * 等待指定时间
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 将值限制在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 将像素值转换为数字
 */
export function pxToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  return parseInt(value.replace('px', ''), 10) || 0;
}
