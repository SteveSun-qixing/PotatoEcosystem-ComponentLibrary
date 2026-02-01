/**
 * 合并多个 ref 的工具函数
 */

import type { Ref } from 'vue';

/**
 * Ref 回调函数类型
 */
export type RefCallback<T> = (instance: T | null) => void;

/**
 * Ref 值类型
 */
export type RefValue<T> = Ref<T | null> | RefCallback<T> | null | undefined;

/**
 * 设置 ref 值
 */
function setRef<T>(ref: RefValue<T>, value: T | null): void {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(value);
  } else {
    ref.value = value;
  }
}

/**
 * 合并多个 ref
 *
 * @example
 * const ref1 = ref<HTMLElement | null>(null)
 * const ref2 = ref<HTMLElement | null>(null)
 * const mergedRef = mergeRefs(ref1, ref2)
 *
 * // 在模板中使用
 * // <div :ref="mergedRef">
 */
export function mergeRefs<T>(...refs: RefValue<T>[]): RefCallback<T> {
  return (instance: T | null) => {
    refs.forEach((ref) => setRef(ref, instance));
  };
}

export default mergeRefs;
