/**
 * 组件基础类型定义
 */

import type { Component, VNode } from 'vue';

/**
 * 组件尺寸
 */
export type Size = 'small' | 'medium' | 'large';

/**
 * 组件状态
 */
export type Status = 'success' | 'warning' | 'error' | 'info';

/**
 * 组件方向
 */
export type Direction = 'horizontal' | 'vertical';

/**
 * 组件对齐方式
 */
export type Align = 'start' | 'center' | 'end';

/**
 * 组件类型
 */
export type ComponentType = 'default' | 'primary' | 'dashed' | 'link' | 'text';

/**
 * 触发方式
 */
export type Trigger = 'hover' | 'click' | 'focus' | 'contextmenu';

/**
 * 位置
 */
export type Placement =
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
 * 响应式断点
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 响应式断点值
 */
export const BREAKPOINT_VALUES: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

/**
 * 组件基础接口
 */
export interface ChipsComponentBase {
  /** 组件名称 */
  componentName: string;
  /** 样式接口点列表 */
  styleInterfaces: string[];
}

/**
 * 组件实例基础接口
 */
export interface ComponentInstance {
  /** 获取DOM元素 */
  $el: HTMLElement | null;
}

/**
 * 渲染函数返回类型
 */
export type RenderFn = () => VNode | null;

/**
 * 可选渲染内容
 */
export type MaybeRender = string | VNode | RenderFn | null | undefined;

/**
 * 组件类型
 */
export type AnyComponent = Component | string;
