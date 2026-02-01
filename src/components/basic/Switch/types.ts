/**
 * Switch 开关组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 开关值类型
 */
export type SwitchValue = string | number | boolean;

/**
 * 开关尺寸
 */
export type SwitchSize = 'small' | 'medium' | 'large';

/**
 * Switch Props
 */
export interface SwitchProps {
  /** 绑定值 */
  modelValue?: SwitchValue;
  /** 默认是否选中（非受控模式） */
  defaultChecked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 开关尺寸 */
  size?: SwitchSize;
  /** 选中时的值 */
  checkedValue?: SwitchValue;
  /** 未选中时的值 */
  uncheckedValue?: SwitchValue;
}

/**
 * Switch Emits
 */
export interface SwitchEmits {
  /** 值变化事件 */
  (e: 'update:modelValue', value: SwitchValue): void;
  /** 变化事件 */
  (e: 'change', value: SwitchValue): void;
}

/**
 * Switch Slots
 */
export interface SwitchSlots {
  /** 开启状态内容 */
  checked?: () => VNode[];
  /** 关闭状态内容 */
  unchecked?: () => VNode[];
}

/**
 * Switch 暴露的方法
 */
export interface SwitchInstance {
  /** 获取 DOM 元素 */
  $el: HTMLButtonElement | null;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
}
