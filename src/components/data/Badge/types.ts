/**
 * Badge 徽标组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 徽标状态
 */
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';

/**
 * Badge Props
 */
export interface BadgeProps {
  /** 展示的数字 */
  count?: number | string;
  /** 当数值为 0 时是否展示 */
  showZero?: boolean;
  /** 展示封顶的数字值，超出显示 {overflowCount}+ */
  overflowCount?: number;
  /** 不展示数字，只有一个小红点 */
  dot?: boolean;
  /** 状态点类型 */
  status?: BadgeStatus;
  /** 状态点对应的文本 */
  text?: string;
  /** 设置徽标偏移量 [x, y] */
  offset?: [number, number];
  /** 自定义徽标颜色 */
  color?: string;
}

/**
 * Badge Emits
 */
export interface BadgeEmits {
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * Badge Slots
 */
export interface BadgeSlots {
  /** 默认插槽（被包裹的内容） */
  default?: () => VNode[];
  /** 徽标数字内容 */
  count?: () => VNode[];
}

/**
 * Badge 暴露的方法
 */
export interface BadgeInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
