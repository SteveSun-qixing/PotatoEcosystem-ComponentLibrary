/**
 * Input 输入框组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 输入框类型
 */
export type InputType = 'text' | 'password' | 'number' | 'email' | 'tel' | 'url';

/**
 * 输入框尺寸
 */
export type InputSize = 'small' | 'medium' | 'large';

/**
 * 输入框状态
 */
export type InputStatus = 'error' | 'warning';

/**
 * Input Props
 */
export interface InputProps {
  /** 绑定值（v-model） */
  modelValue?: string;
  /** 默认值（非受控模式） */
  defaultValue?: string;
  /** 输入框类型 */
  type?: InputType;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 是否可清除 */
  clearable?: boolean;
  /** 输入框尺寸 */
  size?: InputSize;
  /** 输入框状态 */
  status?: InputStatus;
  /** 输入框名称 */
  name?: string;
  /** 自动聚焦 */
  autofocus?: boolean;
  /** 自动完成 */
  autocomplete?: string;
  /** 输入框 id */
  id?: string;
}

/**
 * Input Emits
 */
export interface InputEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', value: string): void;
  /** 值变化事件 */
  (e: 'change', value: string, event: Event): void;
  /** 输入事件 */
  (e: 'input', value: string, event: Event): void;
  /** 聚焦事件 */
  (e: 'focus', event: FocusEvent): void;
  /** 失焦事件 */
  (e: 'blur', event: FocusEvent): void;
  /** 清除事件 */
  (e: 'clear'): void;
  /** 回车事件 */
  (e: 'pressEnter', event: KeyboardEvent): void;
}

/**
 * Input Slots
 */
export interface InputSlots {
  /** 前缀插槽 */
  prefix?: () => VNode[];
  /** 后缀插槽 */
  suffix?: () => VNode[];
}

/**
 * Input 暴露的方法
 */
export interface InputInstance {
  /** 获取 DOM 元素 */
  $el: HTMLDivElement | null;
  /** 获取原生 input 元素 */
  inputRef: HTMLInputElement | null;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
  /** 选中输入框内容 */
  select: () => void;
  /** 清空输入框 */
  clear: () => void;
}
