/**
 * Grid 栅格组件类型定义
 */

import type { InjectionKey } from 'vue';

/**
 * 响应式断点
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 对齐方式
 */
export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

/**
 * 垂直对齐方式
 */
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch';

/**
 * Gutter 类型
 * - number: 水平间距
 * - [number, number]: [水平间距, 垂直间距]
 * - Record<Breakpoint, number>: 响应式间距
 */
export type Gutter =
  | number
  | [number, number]
  | Partial<Record<Breakpoint, number>>
  | [Partial<Record<Breakpoint, number>>, Partial<Record<Breakpoint, number>>];

/**
 * Row Props
 */
export interface RowProps {
  /**
   * 栅格间距
   * - number: 水平间距 (px)
   * - [number, number]: [水平间距, 垂直间距]
   * - Record<Breakpoint, number>: 响应式水平间距
   */
  gutter?: Gutter;

  /**
   * 水平对齐方式
   * @default 'start'
   */
  justify?: RowJustify;

  /**
   * 垂直对齐方式
   * @default 'top'
   */
  align?: RowAlign;

  /**
   * 是否自动换行
   * @default true
   */
  wrap?: boolean;

  /**
   * 自定义类名
   */
  class?: string;
}

/**
 * Col 跨度配置
 */
export interface ColSpanConfig {
  /** 栅格占位格数 */
  span?: number;
  /** 栅格左侧偏移格数 */
  offset?: number;
  /** 栅格向右移动格数 */
  push?: number;
  /** 栅格向左移动格数 */
  pull?: number;
  /** 栅格顺序 */
  order?: number;
}

/**
 * Col Props
 */
export interface ColProps {
  /**
   * 栅格占位格数 (1-24)
   */
  span?: number;

  /**
   * 栅格左侧偏移格数
   */
  offset?: number;

  /**
   * 栅格向右移动格数
   */
  push?: number;

  /**
   * 栅格向左移动格数
   */
  pull?: number;

  /**
   * 栅格顺序 (flex order)
   */
  order?: number;

  /**
   * <576px 响应式栅格配置
   */
  xs?: number | ColSpanConfig;

  /**
   * ≥576px 响应式栅格配置
   */
  sm?: number | ColSpanConfig;

  /**
   * ≥768px 响应式栅格配置
   */
  md?: number | ColSpanConfig;

  /**
   * ≥992px 响应式栅格配置
   */
  lg?: number | ColSpanConfig;

  /**
   * ≥1200px 响应式栅格配置
   */
  xl?: number | ColSpanConfig;

  /**
   * ≥1600px 响应式栅格配置
   */
  xxl?: number | ColSpanConfig;

  /**
   * 自定义类名
   */
  class?: string;
}

/**
 * Row 上下文 - 通过 provide/inject 传递给 Col
 */
export interface RowContext {
  /** 水平间距 */
  horizontalGutter: number;
  /** 垂直间距 */
  verticalGutter: number;
}

/**
 * Row 上下文的注入 key
 */
export const ROW_CONTEXT_KEY: InjectionKey<RowContext> = Symbol('chips-row-context');

/**
 * 响应式断点值 (px)
 */
export const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 576,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};
