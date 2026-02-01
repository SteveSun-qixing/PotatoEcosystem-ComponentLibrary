/**
 * Flex 弹性布局组件类型定义
 */

import type { VNode } from 'vue';

/**
 * Flex 方向
 */
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/**
 * Flex 主轴对齐方式
 */
export type FlexJustify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * Flex 交叉轴对齐方式
 */
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

/**
 * Flex 换行方式
 */
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Flex 间距类型 - 支持单个数值或 [行间距, 列间距]
 */
export type FlexGap = number | [number, number];

/**
 * Flex Props
 */
export interface FlexProps {
  /**
   * 主轴方向
   * @default 'row'
   */
  direction?: FlexDirection;

  /**
   * 主轴对齐方式
   * @default 'start'
   */
  justify?: FlexJustify;

  /**
   * 交叉轴对齐方式
   * @default 'stretch'
   */
  align?: FlexAlign;

  /**
   * 换行方式
   * @default 'nowrap'
   */
  wrap?: FlexWrap;

  /**
   * 间距，支持数值或 [行间距, 列间距]
   */
  gap?: FlexGap;

  /**
   * 是否为内联 flex
   * @default false
   */
  inline?: boolean;
}

/**
 * Flex Slots
 */
export interface FlexSlots {
  /** 默认插槽 */
  default?: () => VNode[];
}
