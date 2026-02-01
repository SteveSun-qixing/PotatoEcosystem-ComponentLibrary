/**
 * CardError 卡片错误组件类型定义
 */

import type { VNode } from 'vue';

/**
 * CardError Props
 */
export interface CardErrorProps {
  /**
   * 错误信息（支持 Error 对象或字符串）
   */
  error?: Error | string;

  /**
   * 是否显示重试按钮
   * @default false
   */
  retryable?: boolean;
}

/**
 * CardError Emits
 */
export interface CardErrorEmits {
  /** 重试按钮点击事件 */
  (e: 'retry'): void;
}

/**
 * CardError Slots
 */
export interface CardErrorSlots {
  /** 自定义图标插槽 */
  icon?: () => VNode[];
  /** 自定义错误消息插槽 */
  message?: () => VNode[];
  /** 自定义重试按钮插槽 */
  retry?: () => VNode[];
}
