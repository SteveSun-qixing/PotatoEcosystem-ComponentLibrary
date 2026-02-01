/**
 * Radio 单选框组件类型定义
 */

import type { InjectionKey, VNode } from 'vue';

/**
 * 单选框值类型
 */
export type RadioValue = string | number | boolean;

/**
 * 单选框尺寸
 */
export type RadioSize = 'small' | 'medium' | 'large';

/**
 * 单选框组选项类型
 */
export type RadioOptionType = 'default' | 'button';

/**
 * 单选框组方向
 */
export type RadioDirection = 'horizontal' | 'vertical';

/**
 * 单选框选项
 */
export interface RadioOption {
  /** 选项值 */
  value: RadioValue;
  /** 选项标签 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * Radio Props
 */
export interface RadioProps {
  /** 绑定值 */
  modelValue?: RadioValue;
  /** 单选框的值 */
  value: RadioValue;
  /** 是否禁用 */
  disabled?: boolean;
  /** 原生 name 属性 */
  name?: string;
}

/**
 * Radio Emits
 */
export interface RadioEmits {
  /** 值变化事件 */
  (e: 'update:modelValue', value: RadioValue): void;
  /** 变化事件 */
  (e: 'change', value: RadioValue): void;
}

/**
 * Radio Slots
 */
export interface RadioSlots {
  /** 默认插槽 - 标签内容 */
  default?: () => VNode[];
}

/**
 * RadioGroup Props
 */
export interface RadioGroupProps {
  /** 绑定值 */
  modelValue?: RadioValue;
  /** 选项列表 */
  options?: RadioOption[];
  /** 是否禁用整组 */
  disabled?: boolean;
  /** 排列方向 */
  direction?: RadioDirection;
  /** 选项类型 */
  optionType?: RadioOptionType;
  /** 尺寸 */
  size?: RadioSize;
  /** 原生 name 属性 */
  name?: string;
}

/**
 * RadioGroup Emits
 */
export interface RadioGroupEmits {
  /** 值变化事件 */
  (e: 'update:modelValue', value: RadioValue): void;
  /** 变化事件 */
  (e: 'change', value: RadioValue): void;
}

/**
 * RadioGroup Slots
 */
export interface RadioGroupSlots {
  /** 默认插槽 - 单选框列表 */
  default?: () => VNode[];
}

/**
 * RadioGroup 注入的上下文
 */
export interface RadioGroupContext {
  /** 当前选中值 */
  modelValue: RadioValue | undefined;
  /** 是否禁用 */
  disabled: boolean;
  /** 选项类型 */
  optionType: RadioOptionType;
  /** 尺寸 */
  size: RadioSize;
  /** name 属性 */
  name?: string;
  /** 选择变化处理 */
  onChange: (value: RadioValue) => void;
}

/**
 * RadioGroup 注入 key
 */
export const RADIO_GROUP_INJECTION_KEY: InjectionKey<RadioGroupContext> =
  Symbol('chips-radio-group');
