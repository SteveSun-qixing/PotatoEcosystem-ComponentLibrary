/**
 * Progress 进度条组件类型定义
 */

/**
 * 进度条类型
 */
export type ProgressType = 'line' | 'circle' | 'dashboard';

/**
 * 进度条状态
 */
export type ProgressStatus = 'normal' | 'success' | 'exception' | 'active';

/**
 * 进度条尺寸
 */
export type ProgressSize = 'default' | 'small';

/**
 * Progress Props
 */
export interface ProgressProps {
  /** 进度百分比 */
  percent?: number;
  /** 进度条类型 */
  type?: ProgressType;
  /** 进度条状态 */
  status?: ProgressStatus;
  /** 进度条颜色（支持渐变） */
  strokeColor?: string | string[];
  /** 进度条宽度（线条粗细） */
  strokeWidth?: number;
  /** 是否显示进度信息 */
  showInfo?: boolean;
  /** 自定义进度显示格式 */
  format?: (percent: number) => string;
  /** 尺寸 */
  size?: ProgressSize;
  /** 圆形进度条宽度（仅 circle/dashboard 类型有效） */
  width?: number;
  /** 自定义类名 */
  class?: string;
  /** 进度条末端形状 */
  strokeLinecap?: 'round' | 'square';
  /** 仪表盘缺口角度（仅 dashboard 类型有效） */
  gapDegree?: number;
  /** 仪表盘缺口位置（仅 dashboard 类型有效） */
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** 进度条背景色 */
  trailColor?: string;
}

/**
 * Progress Emits
 */
export interface ProgressEmits {
  /** 进度变化事件 */
  (e: 'change', percent: number): void;
}

/**
 * Progress Slots
 */
export interface ProgressSlots {
  /** 自定义进度显示内容（覆盖 format） */
  default?: (props: { percent: number }) => any;
}
