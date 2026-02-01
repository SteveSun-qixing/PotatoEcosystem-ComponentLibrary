/**
 * Slider 滑块组件类型定义
 */

import type { CSSProperties } from 'vue';

/**
 * Tooltip 显示模式
 */
export type SliderTooltipMode = boolean | 'always';

/**
 * 刻度标记
 */
export interface SliderMark {
  /** 标记文本 */
  label: string;
  /** 自定义样式（由主题包实现） */
  style?: CSSProperties;
}

/**
 * 刻度标记集合
 */
export type SliderMarks = Record<number, string | SliderMark>;

/**
 * Slider Props
 */
export interface SliderProps {
  /** 当前值 (单值或范围) */
  modelValue?: number | [number, number];
  /** 默认值 */
  defaultValue?: number | [number, number];
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为范围选择 */
  range?: boolean;
  /** 是否为垂直方向 */
  vertical?: boolean;
  /** 刻度标记 */
  marks?: SliderMarks;
  /** 是否显示 tooltip */
  showTooltip?: SliderTooltipMode;
  /** 格式化 tooltip 内容 */
  tooltipFormatter?: (value: number) => string;
  /** 是否只能拖拽到刻度上 */
  dots?: boolean;
  /** 是否包含边界值 */
  included?: boolean;
  /** 反向 */
  reverse?: boolean;
}

/**
 * Slider Emits
 */
export interface SliderEmits {
  /** 值改变时触发 */
  (e: 'update:modelValue', value: number | [number, number]): void;
  /** 值改变时触发 */
  (e: 'change', value: number | [number, number]): void;
  /** 拖拽过程中触发 */
  (e: 'input', value: number | [number, number]): void;
  /** 拖拽开始时触发 */
  (e: 'dragStart', value: number | [number, number]): void;
  /** 拖拽结束时触发 */
  (e: 'dragEnd', value: number | [number, number]): void;
}

/**
 * Slider Slots
 */
export interface SliderSlots {
  /** 自定义标记内容 */
  mark?: (props: { label: string; value: number }) => unknown;
  /** 自定义 tooltip 内容 */
  tooltip?: (props: { value: number }) => unknown;
}

/**
 * Slider 暴露的方法
 */
export interface SliderInstance {
  /** 获取 DOM 元素 */
  $el: HTMLDivElement | null;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
}
