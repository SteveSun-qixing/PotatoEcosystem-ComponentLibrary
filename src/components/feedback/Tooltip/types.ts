/**
 * Tooltip 文字提示组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 提示位置
 */
export type TooltipPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

/**
 * 触发方式
 */
export type TooltipTrigger = 'hover' | 'click' | 'focus';

/**
 * Tooltip Props
 */
export interface TooltipProps {
  /** 提示内容 */
  content?: string;
  /** 位置 */
  placement?: TooltipPlacement;
  /** 触发方式 */
  trigger?: TooltipTrigger;
  /** 受控模式：是否显示 */
  visible?: boolean;
  /** 非受控模式：默认是否显示 */
  defaultVisible?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 鼠标移入延迟（毫秒） */
  mouseEnterDelay?: number;
  /** 鼠标移出延迟（毫秒） */
  mouseLeaveDelay?: number;
  /** 隐藏时是否销毁内容 */
  destroyOnHide?: boolean;
  /** 挂载容器 */
  getPopupContainer?: () => HTMLElement;
  /** 自定义 z-index */
  zIndex?: number;
}

/**
 * Tooltip Emits
 */
export interface TooltipEmits {
  /** 显示状态变化（v-model） */
  (e: 'update:visible', visible: boolean): void;
  /** 显示状态变化事件 */
  (e: 'visibleChange', visible: boolean): void;
}

/**
 * Tooltip Slots
 */
export interface TooltipSlots {
  /** 默认插槽 - 触发元素 */
  default?: () => VNode[];
  /** 自定义提示内容 */
  content?: () => VNode[];
}

/**
 * Tooltip 暴露的方法
 */
export interface TooltipInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
  /** 显示提示 */
  show: () => void;
  /** 隐藏提示 */
  hide: () => void;
  /** 切换显示状态 */
  toggle: () => void;
}
