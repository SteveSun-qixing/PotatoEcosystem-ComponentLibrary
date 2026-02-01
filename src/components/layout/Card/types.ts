/**
 * Card 容器组件类型定义
 */

import type { VNode } from 'vue';

/**
 * Card 尺寸
 */
export type CardSize = 'default' | 'small';

/**
 * Card Props
 */
export interface CardProps {
  /**
   * 卡片标题
   */
  title?: string;

  /**
   * 是否显示边框
   * @default false
   */
  bordered?: boolean;

  /**
   * 鼠标悬停时是否提升
   * @default false
   */
  hoverable?: boolean;

  /**
   * 是否加载中状态
   * @default false
   */
  loading?: boolean;

  /**
   * 卡片尺寸
   * @default 'default'
   */
  size?: CardSize;
}

/**
 * Card Slots
 */
export interface CardSlots {
  /** 默认内容插槽 */
  default?: () => VNode[];
  /** 标题插槽（覆盖 title prop） */
  title?: () => VNode[];
  /** 右上角额外内容插槽 */
  extra?: () => VNode[];
  /** 封面图插槽 */
  cover?: () => VNode[];
  /** 底部操作区插槽 */
  actions?: () => VNode[];
}
