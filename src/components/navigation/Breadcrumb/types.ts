/**
 * Breadcrumb 面包屑组件类型定义
 */

import type { VNode, InjectionKey, Ref } from 'vue';

/**
 * Breadcrumb Props
 */
export interface BreadcrumbProps {
  /** 分隔符 */
  separator?: string;
}

/**
 * Breadcrumb Slots
 */
export interface BreadcrumbSlots {
  /** 默认插槽 - 面包屑项 */
  default?: () => VNode[];
  /** 自定义分隔符 */
  separator?: () => VNode[];
}

/**
 * BreadcrumbItem Props
 */
export interface BreadcrumbItemProps {
  /** 链接地址 */
  href?: string;
  /** Vue Router 路由对象 */
  to?: string | object;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * BreadcrumbItem Emits
 */
export interface BreadcrumbItemEmits {
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * BreadcrumbItem Slots
 */
export interface BreadcrumbItemSlots {
  /** 默认插槽 */
  default?: () => VNode[];
}

/**
 * Breadcrumb 上下文
 */
export interface BreadcrumbContext {
  separator: Ref<string>;
}

/**
 * Breadcrumb 注入 Key
 */
export const BREADCRUMB_INJECTION_KEY: InjectionKey<BreadcrumbContext> = Symbol('breadcrumb');

/**
 * Breadcrumb 暴露的方法
 */
export interface BreadcrumbInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}

/**
 * BreadcrumbItem 暴露的方法
 */
export interface BreadcrumbItemInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
