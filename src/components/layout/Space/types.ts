/**
 * Space 间距组件类型定义
 */

import type { VNode } from 'vue';

/**
 * Space 预设尺寸
 */
export type SpaceSizePreset = 'small' | 'medium' | 'large';

/**
 * Space 尺寸类型 - 支持预设值、数值或 [行间距, 列间距]
 */
export type SpaceSize = SpaceSizePreset | number | [number, number];

/**
 * Space 方向
 */
export type SpaceDirection = 'horizontal' | 'vertical';

/**
 * Space 对齐方式
 */
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';

/**
 * Space Props
 */
export interface SpaceProps {
  /**
   * 间距大小，支持预设值或自定义数值
   * @default 'medium'
   */
  size?: SpaceSize;

  /**
   * 排列方向
   * @default 'horizontal'
   */
  direction?: SpaceDirection;

  /**
   * 对齐方式
   * @default 'center'
   */
  align?: SpaceAlign;

  /**
   * 是否自动换行（仅水平方向有效）
   * @default false
   */
  wrap?: boolean;
}

/**
 * Space Slots
 */
export interface SpaceSlots {
  /** 默认插槽 - 子元素 */
  default?: () => VNode[];
  /** 分隔符插槽 */
  split?: () => VNode[];
}
