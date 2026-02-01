/**
 * CardHeader 卡片头部组件类型定义
 */

import type { VNode } from 'vue';

/**
 * CardHeader Props
 */
export interface CardHeaderProps {
  /**
   * 标题文本
   */
  title?: string;

  /**
   * 是否可关闭
   * @default false
   */
  closable?: boolean;
}

/**
 * CardHeader Emits
 */
export interface CardHeaderEmits {
  /** 关闭按钮点击事件 */
  (e: 'close'): void;
}

/**
 * CardHeader Slots
 */
export interface CardHeaderSlots {
  /** 默认插槽（标题内容） */
  default?: () => VNode[];
  /** 操作区插槽 */
  actions?: () => VNode[];
}
