/**
 * Empty 空状态组件类型定义
 */

import type { VNode, CSSProperties } from 'vue';

/**
 * Empty Props
 */
export interface EmptyProps {
  /** 自定义描述内容 */
  description?: string | VNode;
  /** 自定义图片，可以是图片地址或 VNode */
  image?: string | VNode;
  /** 图片样式 */
  imageStyle?: CSSProperties;
}

/**
 * Empty Emits
 */
export interface EmptyEmits {
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * Empty Slots
 */
export interface EmptySlots {
  /** 默认插槽（底部内容） */
  default?: () => VNode[];
  /** 描述内容插槽 */
  description?: () => VNode[];
  /** 图片插槽 */
  image?: () => VNode[];
}

/**
 * Empty 暴露的方法
 */
export interface EmptyInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
