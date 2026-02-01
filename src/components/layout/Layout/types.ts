/**
 * Layout 布局组件类型定义
 */

import type { VNode, InjectionKey, Ref } from 'vue';

/**
 * 响应式断点
 */
export type SiderBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 折叠触发类型
 */
export type SiderCollapseType = 'clickTrigger' | 'responsive';

// ============== Layout ==============

/**
 * Layout Props
 */
export interface LayoutProps {
  /** 表示子元素里有 Sider，一般不用指定。可用于服务端渲染时避免样式闪动 */
  hasSider?: boolean;
}

/**
 * Layout Slots
 */
export interface LayoutSlots {
  /** 默认插槽 */
  default?: () => VNode[];
}

// ============== Header ==============

/**
 * Header Props
 */
export interface HeaderProps {
  /** 头部高度，支持数字（像素）或字符串（如 '64px', '4rem'） */
  height?: number | string;
}

/**
 * Header Slots
 */
export interface HeaderSlots {
  /** 默认插槽 */
  default?: () => VNode[];
}

// ============== Sider ==============

/**
 * Sider Props
 */
export interface SiderProps {
  /** 宽度，支持数字（像素）或字符串 */
  width?: number | string;
  /** 收起宽度，支持数字（像素）或字符串 */
  collapsedWidth?: number | string;
  /** 当前收起状态 */
  collapsed?: boolean;
  /** 是否可收起 */
  collapsible?: boolean;
  /** 翻转折叠提示箭头的方向，当 Sider 在右边时可以使用 */
  reverseArrow?: boolean;
  /** 触发响应式布局的断点 */
  breakpoint?: SiderBreakpoint;
}

/**
 * Sider Emits
 */
export interface SiderEmits {
  /** 收起状态改变时触发（用于 v-model:collapsed） */
  (e: 'update:collapsed', collapsed: boolean): void;
  /** 展开/收起时触发 */
  (e: 'collapse', collapsed: boolean, type: SiderCollapseType): void;
  /** 触发响应式布局断点时触发 */
  (e: 'breakpoint', broken: boolean): void;
}

/**
 * Sider Slots
 */
export interface SiderSlots {
  /** 默认插槽 */
  default?: () => VNode[];
  /** 自定义触发器，设置为 null 时隐藏 */
  trigger?: () => VNode[];
}

/**
 * Sider 暴露的方法
 */
export interface SiderInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}

// ============== Content ==============

/**
 * Content Props
 */
export interface ContentProps {
  // Content 暂无特定 Props
}

/**
 * Content Slots
 */
export interface ContentSlots {
  /** 默认插槽 */
  default?: () => VNode[];
}

// ============== Footer ==============

/**
 * Footer Props
 */
export interface FooterProps {
  // Footer 暂无特定 Props
}

/**
 * Footer Slots
 */
export interface FooterSlots {
  /** 默认插槽 */
  default?: () => VNode[];
}

// ============== Context ==============

/**
 * Sider 上下文（用于 Layout 检测子组件中是否有 Sider）
 */
export interface SiderContextValue {
  /** Sider 计数器 */
  siderCount: Ref<number>;
  /** 添加 Sider */
  addSider: () => void;
  /** 移除 Sider */
  removeSider: () => void;
}

/**
 * Sider 上下文 Injection Key
 */
export const SIDER_CONTEXT_KEY: InjectionKey<SiderContextValue> = Symbol('SiderContext');

// ============== 响应式断点配置 ==============

/**
 * 响应式断点阈值（单位：像素）
 * 这些值与常见 CSS 框架保持一致
 */
export const BREAKPOINT_MAP: Record<SiderBreakpoint, number> = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};
