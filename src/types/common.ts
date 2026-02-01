/**
 * 通用类型定义
 */

import type { CSSProperties, Ref } from 'vue';

/**
 * 可能是 Ref 的值
 */
export type MaybeRef<T> = T | Ref<T>;

/**
 * 可为 null 的值
 */
export type Nullable<T> = T | null;

/**
 * 可为 undefined 的值
 */
export type Optional<T> = T | undefined;

/**
 * 可能是数组
 */
export type MaybeArray<T> = T | T[];

/**
 * 可能是函数
 */
export type MaybeFunction<T> = T | (() => T);

/**
 * 取数组元素类型
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * 移除 readonly 修饰符
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * 深度只读
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 深度可选
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 需要的属性
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * CSS 属性扩展
 */
export interface ExtendedCSSProperties extends CSSProperties {
  [key: `--${string}`]: string | number;
}

/**
 * 异步状态
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页结果
 */
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
