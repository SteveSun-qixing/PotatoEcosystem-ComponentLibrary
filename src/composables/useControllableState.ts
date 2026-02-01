/**
 * useControllableState - 受控/非受控状态管理
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';

/**
 * 受控/非受控状态选项
 */
export interface UseControllableStateOptions<T> {
  /** 受控值 */
  value?: T;
  /** 默认值（非受控时使用） */
  defaultValue?: T;
  /** 值变更回调 */
  onChange?: (value: T) => void;
}

/**
 * 受控/非受控状态返回值
 */
export type UseControllableStateReturn<T> = [
  /** 当前值（只读） */
  ComputedRef<T>,
  /** 设置值的方法 */
  (newValue: T) => void,
  /** 是否为受控模式 */
  boolean
];

/**
 * 受控/非受控状态管理 Hook
 *
 * 自动判断组件是受控模式还是非受控模式，并提供统一的 API
 *
 * @example
 * // 在组件中使用
 * const props = defineProps<{ modelValue?: string; defaultValue?: string }>();
 * const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
 *
 * const [value, setValue] = useControllableState({
 *   value: props.modelValue,
 *   defaultValue: props.defaultValue,
 *   onChange: (v) => emit('update:modelValue', v),
 * });
 */
export function useControllableState<T>(
  options: UseControllableStateOptions<T>
): UseControllableStateReturn<T> {
  const { value: controlledValue, defaultValue, onChange } = options;

  // 判断是否为受控模式
  const isControlled = controlledValue !== undefined;

  // 内部状态（非受控模式使用）
  const internalValue: Ref<T> = ref(defaultValue as T) as Ref<T>;

  // 当前值
  const value = computed<T>(() => {
    if (isControlled) {
      return controlledValue as T;
    }
    return internalValue.value;
  });

  // 设置值
  const setValue = (newValue: T) => {
    // 非受控模式时更新内部状态
    if (!isControlled) {
      internalValue.value = newValue;
    }
    // 触发 onChange 回调
    onChange?.(newValue);
  };

  return [value, setValue, isControlled];
}

/**
 * 带 props 监听的受控/非受控状态
 *
 * 当 props 中的受控值变化时，自动同步
 */
export function useControllableStateWithWatch<T>(
  propsValue: () => T | undefined,
  defaultValue: T | undefined,
  onChange?: (value: T) => void
): UseControllableStateReturn<T> {
  // 内部状态
  const internalValue: Ref<T> = ref((defaultValue ?? undefined) as T) as Ref<T>;

  // 是否为受控模式
  const isControlled = computed(() => propsValue() !== undefined);

  // 当前值
  const value = computed<T>(() => {
    if (isControlled.value) {
      return propsValue() as T;
    }
    return internalValue.value;
  });

  // 监听 props 变化（受控模式切换时）
  watch(
    () => propsValue(),
    (newValue) => {
      if (newValue !== undefined && !isControlled.value) {
        internalValue.value = newValue;
      }
    }
  );

  // 设置值
  const setValue = (newValue: T) => {
    if (!isControlled.value) {
      internalValue.value = newValue;
    }
    onChange?.(newValue);
  };

  return [value, setValue, isControlled.value];
}

export default useControllableState;
