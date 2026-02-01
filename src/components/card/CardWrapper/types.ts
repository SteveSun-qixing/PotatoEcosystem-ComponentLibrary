/**
 * CardWrapper 卡片包装器组件类型定义
 */

import type { VNode } from 'vue';

/**
 * CardWrapper Props
 */
export interface CardWrapperProps {
  /**
   * 卡片唯一标识
   */
  cardId?: string;

  /**
   * 卡片类型
   */
  cardType?: string;

  /**
   * 主题名称
   */
  theme?: string;

  /**
   * 是否可编辑
   * @default false
   */
  editable?: boolean;

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean;

  /**
   * 错误信息
   */
  error?: Error | null;
}

/**
 * CardWrapper Slots
 */
export interface CardWrapperSlots {
  /** 默认内容插槽 */
  default?: () => VNode[];
  /** 头部插槽 */
  header?: () => VNode[];
  /** 底部插槽 */
  footer?: () => VNode[];
}
