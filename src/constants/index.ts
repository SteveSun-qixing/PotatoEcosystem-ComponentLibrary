/**
 * 常量定义
 */

/**
 * 组件前缀
 */
export const COMPONENT_PREFIX = 'chips';

/**
 * 尺寸常量
 */
export const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

/**
 * 状态常量
 */
export const STATUS = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
} as const;

/**
 * 方向常量
 */
export const DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;

/**
 * 键盘按键常量
 */
export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * 断点常量
 */
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
} as const;

/**
 * 默认 z-index
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  MESSAGE: 1080,
  NOTIFICATION: 1090,
} as const;

/**
 * 过渡时间（毫秒）
 */
export const TRANSITIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
} as const;

/**
 * 默认配置
 */
export const DEFAULTS = {
  /** 消息提示持续时间 */
  MESSAGE_DURATION: 3000,
  /** 通知持续时间 */
  NOTIFICATION_DURATION: 4500,
  /** Tooltip 延迟显示时间 */
  TOOLTIP_DELAY: 100,
  /** 防抖延迟 */
  DEBOUNCE_DELAY: 300,
  /** 节流延迟 */
  THROTTLE_DELAY: 100,
} as const;
