/**
 * Select 选择器组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 选项类型
 */
export interface SelectOption {
  /** 选项显示文本 */
  label: string;
  /** 选项值 */
  value: string | number;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 选择器尺寸
 */
export type SelectSize = 'small' | 'medium' | 'large';

/**
 * 选择器状态
 */
export type SelectStatus = 'error' | 'warning';

/**
 * 选择器值类型
 */
export type SelectValue = string | number | (string | number)[];

/**
 * Select Props
 */
export interface SelectProps {
  /** 选中值 (v-model) */
  modelValue?: SelectValue;
  /** 默认值（非受控模式） */
  defaultValue?: SelectValue;
  /** 选项列表 */
  options: SelectOption[];
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否多选 */
  multiple?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 是否可清除 */
  clearable?: boolean;
  /** 尺寸 */
  size?: SelectSize;
  /** 状态 */
  status?: SelectStatus;
  /** 多选时最多显示的标签数量 */
  maxTagCount?: number;
  /** 是否加载中 */
  loading?: boolean;
}

/**
 * Select Emits
 */
export interface SelectEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', value: SelectValue): void;
  /** 值变化事件 */
  (e: 'change', value: SelectValue): void;
  /** 搜索事件 */
  (e: 'search', keyword: string): void;
  /** 聚焦事件 */
  (e: 'focus', event: FocusEvent): void;
  /** 失焦事件 */
  (e: 'blur', event: FocusEvent): void;
  /** 清除事件 */
  (e: 'clear'): void;
}

/**
 * Select Slots
 */
export interface SelectSlots {
  /** 选项自定义渲染 */
  option?: (props: { option: SelectOption; selected: boolean }) => VNode[];
  /** 空状态插槽 */
  empty?: () => VNode[];
  /** 加载状态插槽 */
  loading?: () => VNode[];
  /** 多选标签内容 */
  tag?: (props: { option: SelectOption }) => VNode[];
  /** 箭头图标 */
  arrow?: () => VNode[];
  /** 清除图标 */
  clearIcon?: () => VNode[];
}

/**
 * Select 暴露的方法
 */
export interface SelectInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
  /** 打开下拉菜单 */
  open: () => void;
  /** 关闭下拉菜单 */
  close: () => void;
}
