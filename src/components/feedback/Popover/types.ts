/**
 * Popover 气泡卡片组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 气泡位置
 */
export type PopoverPlacement =
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
export type PopoverTrigger = 'hover' | 'click' | 'focus';

/**
 * Popover Props
 */
export interface PopoverProps {
  /** 卡片标题 */
  title?: string | VNode;
  /** 卡片内容 */
  content?: string | VNode;
  /** 触发方式 */
  trigger?: PopoverTrigger;
  /** 位置 */
  placement?: PopoverPlacement;
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
  /** 自定义类名 */
  class?: string;
  /** 是否显示箭头 */
  arrow?: boolean;
}

/**
 * Popover Emits
 */
export interface PopoverEmits {
  /** 显示状态变化（v-model） */
  (e: 'update:visible', visible: boolean): void;
  /** 显示状态变化事件 */
  (e: 'visibleChange', visible: boolean): void;
}

/**
 * Popover Slots
 */
export interface PopoverSlots {
  /** 默认插槽 - 触发元素 */
  default?: () => VNode[];
  /** 标题插槽 */
  title?: () => VNode[];
  /** 内容插槽 */
  content?: () => VNode[];
}

/**
 * Popover 暴露的方法
 */
export interface PopoverInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
  /** 显示气泡 */
  show: () => void;
  /** 隐藏气泡 */
  hide: () => void;
  /** 切换显示状态 */
  toggle: () => void;
}
