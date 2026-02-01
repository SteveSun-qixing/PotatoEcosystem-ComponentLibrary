/**
 * Icon 图标组件类型定义
 */

import type { VNode } from 'vue';

/**
 * Icon Props
 */
export interface IconProps {
  /** 图标名称 */
  name?: string;
  /** 图标大小 */
  size?: number | string;
  /** 图标颜色 */
  color?: string;
  /** 是否旋转动画 */
  spin?: boolean;
  /** 旋转角度 */
  rotate?: number;
}

/**
 * Icon Emits
 */
export interface IconEmits {
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * Icon Slots
 */
export interface IconSlots {
  /** 默认插槽，用于自定义 SVG 内容 */
  default?: () => VNode[];
}

/**
 * Icon 暴露的方法
 */
export interface IconInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
