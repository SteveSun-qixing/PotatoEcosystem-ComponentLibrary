/**
 * Button 按钮组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 按钮类型
 */
export type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text';

/**
 * 按钮尺寸
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * 按钮原生类型
 */
export type ButtonHTMLType = 'button' | 'submit' | 'reset';

/**
 * Button Props
 */
export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonType;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否为危险按钮 */
  danger?: boolean;
  /** 是否为块级按钮 */
  block?: boolean;
  /** 原生按钮类型 */
  htmlType?: ButtonHTMLType;
}

/**
 * Button Emits
 */
export interface ButtonEmits {
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * Button Slots
 */
export interface ButtonSlots {
  /** 默认插槽 */
  default?: () => VNode[];
  /** 图标插槽 */
  icon?: () => VNode[];
}

/**
 * Button 暴露的方法
 */
export interface ButtonInstance {
  /** 获取 DOM 元素 */
  $el: HTMLButtonElement | null;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
}
