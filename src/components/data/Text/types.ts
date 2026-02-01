/**
 * Text 文本组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 文本类型
 */
export type TextType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * 省略配置
 */
export interface EllipsisConfig {
  /** 显示行数 */
  rows?: number;
  /** 是否可展开 */
  expandable?: boolean;
}

/**
 * 复制配置
 */
export interface CopyableConfig {
  /** 复制的文本，默认为组件内容 */
  text?: string;
  /** 复制成功回调 */
  onCopy?: () => void;
}

/**
 * Text Props
 */
export interface TextProps {
  /** 文本类型 */
  type?: TextType;
  /** 是否加粗 */
  strong?: boolean;
  /** 是否斜体 */
  italic?: boolean;
  /** 是否添加下划线 */
  underline?: boolean;
  /** 是否添加删除线 */
  delete?: boolean;
  /** 是否为代码样式 */
  code?: boolean;
  /** 是否为标记样式 */
  mark?: boolean;
  /** 是否为键盘样式 */
  keyboard?: boolean;
  /** 是否省略，支持配置行数和展开 */
  ellipsis?: boolean | EllipsisConfig;
  /** 是否可复制 */
  copyable?: boolean | CopyableConfig;
}

/**
 * Text Emits
 */
export interface TextEmits {
  /** 复制事件 */
  (e: 'copy', text: string): void;
  /** 展开/收起事件 */
  (e: 'expand', expanded: boolean): void;
}

/**
 * Text Slots
 */
export interface TextSlots {
  /** 默认插槽 */
  default?: () => VNode[];
  /** 复制按钮插槽 */
  copyIcon?: () => VNode[];
  /** 复制成功图标插槽 */
  copiedIcon?: () => VNode[];
  /** 展开按钮插槽 */
  expand?: (props: { expanded: boolean }) => VNode[];
}

/**
 * Text 暴露的方法
 */
export interface TextInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
  /** 手动复制文本 */
  copy: () => Promise<void>;
  /** 展开/收起 */
  toggleExpand: () => void;
}
