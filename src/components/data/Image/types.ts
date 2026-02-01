/**
 * Image 图片组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 图片适应模式
 */
export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * 图片状态
 */
export type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * Image Props
 */
export interface ImageProps {
  /** 图片地址 */
  src: string;
  /** 图片描述 */
  alt?: string;
  /** 图片宽度 */
  width?: number | string;
  /** 图片高度 */
  height?: number | string;
  /** 图片适应模式 */
  fit?: ImageFit;
  /** 是否懒加载 */
  lazy?: boolean;
  /** 是否开启预览 */
  preview?: boolean;
  /** 加载失败时的占位图 */
  fallback?: string;
}

/**
 * Image Emits
 */
export interface ImageEmits {
  /** 加载成功事件 */
  (e: 'load', event: Event): void;
  /** 加载失败事件 */
  (e: 'error', event: Event): void;
  /** 预览打开事件 */
  (e: 'preview', visible: boolean): void;
}

/**
 * Image Slots
 */
export interface ImageSlots {
  /** 加载中占位 */
  placeholder?: () => VNode[];
  /** 加载失败占位 */
  error?: () => VNode[];
  /** 预览操作区域 */
  previewActions?: () => VNode[];
}

/**
 * Image 暴露的方法
 */
export interface ImageInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
  /** 图片元素 */
  imgEl: HTMLImageElement | null;
  /** 当前状态 */
  status: ImageStatus;
  /** 打开预览 */
  openPreview: () => void;
  /** 关闭预览 */
  closePreview: () => void;
}
