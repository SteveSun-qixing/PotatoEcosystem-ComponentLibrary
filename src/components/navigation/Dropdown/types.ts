/**
 * Dropdown 下拉菜单组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 弹出位置
 */
export type DropdownPlacement =
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
export type DropdownTrigger = 'hover' | 'click' | 'contextmenu';

/**
 * Dropdown Props
 */
export interface DropdownProps {
  /** 触发方式 */
  trigger?: DropdownTrigger;
  /** 弹出位置 */
  placement?: DropdownPlacement;
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
 * Dropdown Emits
 */
export interface DropdownEmits {
  /** 显示状态变化（v-model） */
  (e: 'update:visible', visible: boolean): void;
  /** 显示状态变化事件 */
  (e: 'visibleChange', visible: boolean): void;
}

/**
 * Dropdown Slots
 */
export interface DropdownSlots {
  /** 默认插槽 - 触发元素 */
  default?: () => VNode[];
  /** 下拉菜单内容 */
  overlay?: () => VNode[];
}

/**
 * Dropdown 暴露的方法
 */
export interface DropdownInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
  /** 显示下拉菜单 */
  show: () => void;
  /** 隐藏下拉菜单 */
  hide: () => void;
  /** 切换显示状态 */
  toggle: () => void;
}
