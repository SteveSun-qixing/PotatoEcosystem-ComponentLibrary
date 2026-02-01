/**
 * Alert 警告提示组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 警告类型
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * Alert Props
 */
export interface AlertProps {
  /** 警告类型 */
  type?: AlertType;
  /** 警告标题/消息 */
  message?: string;
  /** 警告描述/辅助说明 */
  description?: string;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否作为顶部公告样式 */
  banner?: boolean;
}

/**
 * Alert Emits
 */
export interface AlertEmits {
  /** 关闭事件 */
  (e: 'close', event: MouseEvent): void;
  /** 关闭后回调事件 */
  (e: 'afterClose'): void;
}

/**
 * Alert Slots
 */
export interface AlertSlots {
  /** 默认插槽（消息内容） */
  default?: () => VNode[];
  /** 消息内容插槽 */
  message?: () => VNode[];
  /** 描述内容插槽 */
  description?: () => VNode[];
  /** 图标插槽 */
  icon?: () => VNode[];
  /** 关闭按钮插槽 */
  closeIcon?: () => VNode[];
  /** 操作区域插槽 */
  action?: () => VNode[];
}

/**
 * Alert 暴露的方法
 */
export interface AlertInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
