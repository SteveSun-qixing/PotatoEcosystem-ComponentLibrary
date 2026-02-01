/**
 * Modal 对话框组件类型定义
 */

import type { VNode } from 'vue';

/**
 * Modal Props
 */
export interface ModalProps {
  /** 是否显示对话框 */
  modelValue?: boolean;
  /** 对话框标题 */
  title?: string;
  /** 对话框宽度 */
  width?: number | string;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 是否支持键盘 ESC 关闭 */
  keyboard?: boolean;
  /** 是否垂直居中 */
  centered?: boolean;
  /** 关闭时是否销毁子元素 */
  destroyOnClose?: boolean;
  /** 确定按钮 loading 状态 */
  confirmLoading?: boolean;
  /** 确定按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 自定义底部内容，设置为 null 时不显示底部 */
  footer?: VNode | null;
  /** 对话框 z-index */
  zIndex?: number;
  /** 挂载节点 */
  appendTo?: string | HTMLElement;
  /** 自定义类名 */
  class?: string;
  /** 遮罩是否可见 */
  mask?: boolean;
}

/**
 * Modal Emits
 */
export interface ModalEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', value: boolean): void;
  /** 点击确定按钮回调 */
  (e: 'ok'): void;
  /** 点击取消按钮回调 */
  (e: 'cancel'): void;
  /** 完全打开后回调 */
  (e: 'afterOpen'): void;
  /** 完全关闭后回调 */
  (e: 'afterClose'): void;
}

/**
 * Modal Slots
 */
export interface ModalSlots {
  /** 默认插槽 - 对话框内容 */
  default?: () => VNode[];
  /** 标题插槽 */
  title?: () => VNode[];
  /** 底部插槽 */
  footer?: () => VNode[];
  /** 关闭图标插槽 */
  closeIcon?: () => VNode[];
}

/**
 * Modal 暴露的方法
 */
export interface ModalInstance {
  /** 打开对话框 */
  open: () => void;
  /** 关闭对话框 */
  close: () => void;
}
