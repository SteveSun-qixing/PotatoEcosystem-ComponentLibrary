/**
 * Avatar 头像组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 头像尺寸
 */
export type AvatarSize = 'small' | 'default' | 'large' | number;

/**
 * 头像形状
 */
export type AvatarShape = 'circle' | 'square';

/**
 * Avatar Props
 */
export interface AvatarProps {
  /** 头像尺寸 */
  size?: AvatarSize;
  /** 头像形状 */
  shape?: AvatarShape;
  /** 图片地址 */
  src?: string;
  /** 图片无法显示时的替代文本 */
  alt?: string;
  /** 图标 */
  icon?: VNode;
  /** 字符类型距离左右两侧边界单位像素 */
  gap?: number;
}

/**
 * Avatar Emits
 */
export interface AvatarEmits {
  /** 图片加载失败事件 */
  (e: 'error', event: Event): void;
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * Avatar Slots
 */
export interface AvatarSlots {
  /** 默认插槽（字符内容） */
  default?: () => VNode[];
  /** 图标插槽 */
  icon?: () => VNode[];
}

/**
 * Avatar 暴露的方法
 */
export interface AvatarInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
