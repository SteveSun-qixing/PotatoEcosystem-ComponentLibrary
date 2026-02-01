/**
 * Loading 加载组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 加载尺寸
 */
export type LoadingSize = 'small' | 'default' | 'large';

/**
 * Loading Props
 */
export interface LoadingProps {
  /** 是否加载中 */
  loading?: boolean;
  /** 加载提示文本 */
  tip?: string;
  /** 尺寸 */
  size?: LoadingSize;
  /** 自定义加载指示器 */
  indicator?: VNode;
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 延迟显示时间（毫秒），防止闪烁 */
  delay?: number;
}

/**
 * Loading Slots
 */
export interface LoadingSlots {
  /** 默认插槽 - 被加载包裹的内容 */
  default?: () => VNode[];
  /** 自定义加载指示器 */
  indicator?: () => VNode[];
  /** 自定义提示文本 */
  tip?: () => VNode[];
}

/**
 * Loading 暴露的方法
 */
export interface LoadingInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
