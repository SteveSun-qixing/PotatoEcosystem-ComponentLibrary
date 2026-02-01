/**
 * Checkbox 复选框组件类型定义
 */

import type { InjectionKey, VNode } from 'vue';

/**
 * Checkbox Props
 */
export interface CheckboxProps {
  /** 选中状态 (v-model) */
  modelValue?: boolean;
  /** 默认选中状态 (非受控) */
  defaultChecked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 半选状态 */
  indeterminate?: boolean;
  /** 复选框的值（在 CheckboxGroup 中使用） */
  value?: string | number;
  /** 原生 name 属性 */
  name?: string;
}

/**
 * Checkbox Emits
 */
export interface CheckboxEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', checked: boolean): void;
  /** 选中状态变化事件 */
  (e: 'change', checked: boolean, event: Event): void;
}

/**
 * Checkbox Slots
 */
export interface CheckboxSlots {
  /** 默认插槽 - 标签内容 */
  default?: () => VNode[];
}

/**
 * Checkbox 暴露的方法
 */
export interface CheckboxInstance {
  /** 获取 DOM 元素 */
  $el: HTMLLabelElement | null;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
  /** 获取选中状态 */
  isChecked: () => boolean;
}

/**
 * CheckboxOption 选项类型
 */
export interface CheckboxOption {
  /** 选项标签 */
  label: string | VNode;
  /** 选项值 */
  value: string | number;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * CheckboxGroup Props
 */
export interface CheckboxGroupProps {
  /** 选中值数组 (v-model) */
  modelValue?: (string | number)[];
  /** 默认选中值 (非受控) */
  defaultValue?: (string | number)[];
  /** 选项列表 */
  options?: CheckboxOption[];
  /** 是否禁用整组 */
  disabled?: boolean;
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical';
  /** 原生 name 属性 */
  name?: string;
}

/**
 * CheckboxGroup Emits
 */
export interface CheckboxGroupEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', values: (string | number)[]): void;
  /** 选中状态变化事件 */
  (e: 'change', values: (string | number)[]): void;
}

/**
 * CheckboxGroup Slots
 */
export interface CheckboxGroupSlots {
  /** 默认插槽 - 子 Checkbox 组件 */
  default?: () => VNode[];
}

/**
 * CheckboxGroup 上下文类型
 * 通过 provide/inject 传递给子 Checkbox
 */
export interface CheckboxGroupContext {
  /** 组名称 */
  name?: string;
  /** 选中值数组 */
  modelValue: (string | number)[];
  /** 是否禁用 */
  disabled: boolean;
  /** 注册 Checkbox 值 */
  registerValue: (value: string | number) => void;
  /** 注销 Checkbox 值 */
  unregisterValue: (value: string | number) => void;
  /** 切换选中状态 */
  toggleValue: (value: string | number, checked: boolean) => void;
}

/**
 * CheckboxGroup 上下文 injection key
 */
export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> = Symbol('CheckboxGroup');
