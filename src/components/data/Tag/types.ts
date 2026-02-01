/**
 * Tag 标签组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 标签预设颜色
 */
export type TagPresetColor = 'default' | 'success' | 'processing' | 'warning' | 'error';

/**
 * 标签尺寸
 */
export type TagSize = 'small' | 'medium' | 'large';

/**
 * Tag Props
 */
export interface TagProps {
  /** 标签颜色，可以是预设颜色或自定义颜色值 */
  color?: TagPresetColor | string;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 标签尺寸 */
  size?: TagSize;
}

/**
 * Tag Emits
 */
export interface TagEmits {
  /** 关闭事件 */
  (e: 'close', event: MouseEvent): void;
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * Tag Slots
 */
export interface TagSlots {
  /** 默认插槽 */
  default?: () => VNode[];
  /** 图标插槽 */
  icon?: () => VNode[];
  /** 关闭图标插槽 */
  closeIcon?: () => VNode[];
}

/**
 * Tag 暴露的方法
 */
export interface TagInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
