/**
 * Message 消息提示组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 消息类型
 */
export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading';

/**
 * 单条消息配置
 */
export interface MessageConfig {
  /** 消息唯一标识 */
  id?: string;
  /** 消息类型 */
  type: MessageType;
  /** 消息内容 */
  content: string | VNode;
  /** 显示时长（毫秒），设置为 0 则不自动关闭 */
  duration?: number;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 关闭时的回调 */
  onClose?: () => void;
  /** 自定义图标 */
  icon?: VNode;
}

/**
 * Message 组件实例
 */
export interface MessageInstance {
  /** 消息 ID */
  id: string;
  /** 关闭消息 */
  close: () => void;
}

/**
 * Message 全局配置
 */
export interface MessageGlobalConfig {
  /** 默认显示时长（毫秒） */
  duration?: number;
  /** 最大显示数量 */
  maxCount?: number;
  /** 距离顶部的距离 */
  top?: number | string;
  /** 挂载节点 */
  appendTo?: string | HTMLElement;
}

/**
 * Message API
 */
export interface MessageApi {
  /** 显示信息提示 */
  info: (content: string, duration?: number) => MessageInstance;
  /** 显示成功提示 */
  success: (content: string, duration?: number) => MessageInstance;
  /** 显示警告提示 */
  warning: (content: string, duration?: number) => MessageInstance;
  /** 显示错误提示 */
  error: (content: string, duration?: number) => MessageInstance;
  /** 显示加载提示 */
  loading: (content: string, duration?: number) => MessageInstance;
  /** 打开消息（完整配置） */
  open: (config: MessageConfig) => MessageInstance;
  /** 销毁所有消息 */
  destroy: () => void;
  /** 更新全局配置 */
  config: (options: MessageGlobalConfig) => void;
}

/**
 * Message 组件 Props
 */
export interface MessageProps {
  /** 消息 ID */
  id: string;
  /** 消息类型 */
  type: MessageType;
  /** 消息内容 */
  content: string | VNode;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: VNode;
}

/**
 * Message 组件 Emits
 */
export interface MessageEmits {
  /** 关闭事件 */
  (e: 'close', id: string): void;
}

/**
 * MessageContainer Props
 */
export interface MessageContainerProps {
  /** 消息列表 */
  messages: MessageConfig[];
  /** 距离顶部的距离 */
  top?: number | string;
}
