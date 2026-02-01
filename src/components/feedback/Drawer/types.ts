/**
 * Drawer 抽屉组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 抽屉方向
 */
export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * Drawer Props
 */
export interface DrawerProps {
  /** 是否显示抽屉 */
  modelValue?: boolean;
  /** 抽屉标题 */
  title?: string;
  /** 宽度（left/right 方向使用） */
  width?: number | string;
  /** 高度（top/bottom 方向使用） */
  height?: number | string;
  /** 抽屉方向 */
  placement?: DrawerPlacement;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 是否支持键盘 ESC 关闭 */
  keyboard?: boolean;
  /** 关闭时是否销毁子元素 */
  destroyOnClose?: boolean;
  /** 抽屉 z-index */
  zIndex?: number;
  /** 挂载节点 */
  appendTo?: string | HTMLElement;
  /** 自定义类名 */
  class?: string;
  /** 是否显示遮罩 */
  mask?: boolean;
  /** 是否阻止背景滚动 */
  lockScroll?: boolean;
}

/**
 * Drawer Emits
 */
export interface DrawerEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', value: boolean): void;
  /** 关闭回调 */
  (e: 'close'): void;
  /** 完全打开后回调 */
  (e: 'afterOpen'): void;
  /** 完全关闭后回调 */
  (e: 'afterClose'): void;
}

/**
 * Drawer Slots
 */
export interface DrawerSlots {
  /** 默认插槽 - 抽屉内容 */
  default?: () => VNode[];
  /** 标题插槽 */
  title?: () => VNode[];
  /** 底部插槽 */
  footer?: () => VNode[];
  /** 关闭图标插槽 */
  closeIcon?: () => VNode[];
  /** 额外内容插槽（整个抽屉右侧/下方） */
  extra?: () => VNode[];
}

/**
 * Drawer 暴露的方法
 */
export interface DrawerInstance {
  /** 打开抽屉 */
  open: () => void;
  /** 关闭抽屉 */
  close: () => void;
}
