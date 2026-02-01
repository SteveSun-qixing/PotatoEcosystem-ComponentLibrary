/**
 * CardLoading 卡片加载组件类型定义
 */

import type { VNode } from 'vue';

/**
 * CardLoading Props
 */
export interface CardLoadingProps {
  /**
   * 加载提示文本
   */
  tip?: string;
}

/**
 * CardLoading Slots
 */
export interface CardLoadingSlots {
  /** 自定义加载指示器插槽 */
  default?: () => VNode[];
  /** 自定义提示文本插槽 */
  tip?: () => VNode[];
}
