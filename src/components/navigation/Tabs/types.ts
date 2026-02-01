/**
 * Tabs 标签页组件类型定义
 */

import type { VNode, InjectionKey, Ref } from 'vue';

/**
 * 标签页类型
 */
export type TabsType = 'line' | 'card' | 'editable-card';

/**
 * 标签页尺寸
 */
export type TabsSize = 'small' | 'medium' | 'large';

/**
 * 标签页位置
 */
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * TabPane 配置项
 */
export interface TabPaneConfig {
  /** 唯一标识 */
  key: string;
  /** 标签标题 */
  tab: string | VNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可关闭（仅 editable-card 类型有效） */
  closable?: boolean;
  /** 是否强制渲染 */
  forceRender?: boolean;
}

/**
 * Tabs Props
 */
export interface TabsProps {
  /** 当前激活的 tab key (受控) */
  activeKey?: string;
  /** 默认激活的 tab key (非受控) */
  defaultActiveKey?: string;
  /** 标签页类型 */
  type?: TabsType;
  /** 标签页尺寸 */
  size?: TabsSize;
  /** 是否居中显示 */
  centered?: boolean;
  /** 标签位置 */
  tabPosition?: TabsPosition;
  /** 是否销毁隐藏的 TabPane */
  destroyInactiveTabPane?: boolean;
  /** 是否开启键盘导航 */
  keyboard?: boolean;
}

/**
 * Tabs Emits
 */
export interface TabsEmits {
  /** 切换 tab 时触发 */
  (e: 'update:activeKey', key: string): void;
  /** 切换 tab 时触发（包含旧 key） */
  (e: 'change', key: string, oldKey: string): void;
  /** 编辑（新增/删除）tab 时触发 */
  (e: 'edit', targetKey: string | MouseEvent, action: 'add' | 'remove'): void;
  /** 点击 tab 时触发 */
  (e: 'tabClick', key: string, event: MouseEvent): void;
}

/**
 * Tabs Slots
 */
export interface TabsSlots {
  /** 默认插槽（TabPane） */
  default?: () => VNode[];
  /** 右侧附加内容 */
  rightExtra?: () => VNode[];
  /** 左侧附加内容 */
  leftExtra?: () => VNode[];
  /** 新增按钮（仅 editable-card） */
  addIcon?: () => VNode[];
}

/**
 * TabPane Props
 */
export interface TabPaneProps {
  /** 唯一标识（使用 name 而非 key，因为 key 是 Vue 保留属性） */
  name?: string;
  /** 标签标题 */
  tab?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否强制渲染 */
  forceRender?: boolean;
}

/**
 * TabPane Slots
 */
export interface TabPaneSlots {
  /** 默认插槽（内容） */
  default?: () => VNode[];
  /** 标签标题插槽 */
  tab?: () => VNode[];
}

/**
 * Tabs 上下文
 */
export interface TabsContext {
  /** 当前激活的 key */
  activeKey: Ref<string>;
  /** 注册 TabPane */
  registerPane: (pane: TabPaneConfig) => void;
  /** 注销 TabPane */
  unregisterPane: (key: string) => void;
  /** 是否销毁隐藏的 TabPane */
  destroyInactiveTabPane: boolean;
}

/**
 * Tabs 上下文 Key
 */
export const TABS_INJECTION_KEY: InjectionKey<TabsContext> = Symbol('tabs');

/**
 * Tabs 暴露的方法
 */
export interface TabsInstance {
  /** 获取 DOM 元素 */
  $el: HTMLDivElement | null;
}

/**
 * TabPane 暴露的方法
 */
export interface TabPaneInstance {
  /** 获取 DOM 元素 */
  $el: HTMLDivElement | null;
}
