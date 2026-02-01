/**
 * Menu 菜单组件类型定义
 */

import type { VNode, InjectionKey, Ref } from 'vue';

/**
 * 菜单模式
 */
export type MenuMode = 'vertical' | 'horizontal' | 'inline';

/**
 * 菜单主题
 */
export type MenuTheme = 'light' | 'dark';

/**
 * Menu Props
 */
export interface MenuProps {
  /** 菜单模式 */
  mode?: MenuMode;
  /** 选中的菜单项 key 数组 */
  selectedKeys?: string[];
  /** 默认选中的菜单项 key 数组 */
  defaultSelectedKeys?: string[];
  /** 展开的子菜单 key 数组 */
  openKeys?: string[];
  /** 默认展开的子菜单 key 数组 */
  defaultOpenKeys?: string[];
  /** 主题 */
  theme?: MenuTheme;
  /** 是否收起 */
  collapsed?: boolean;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 是否允许取消选中 */
  selectable?: boolean;
}

/**
 * Menu Emits
 */
export interface MenuEmits {
  /** 选中状态变化（v-model） */
  (e: 'update:selectedKeys', keys: string[]): void;
  /** 展开状态变化（v-model） */
  (e: 'update:openKeys', keys: string[]): void;
  /** 点击菜单项 */
  (e: 'click', info: MenuClickEventInfo): void;
  /** 选中菜单项 */
  (e: 'select', info: MenuSelectEventInfo): void;
  /** 取消选中菜单项 */
  (e: 'deselect', info: MenuSelectEventInfo): void;
  /** 子菜单展开/收起 */
  (e: 'openChange', keys: string[]): void;
}

/**
 * 菜单点击事件信息
 */
export interface MenuClickEventInfo {
  key: string;
  keyPath: string[];
  domEvent: MouseEvent;
}

/**
 * 菜单选择事件信息
 */
export interface MenuSelectEventInfo {
  key: string;
  keyPath: string[];
  selectedKeys: string[];
  domEvent: MouseEvent;
}

/**
 * Menu Slots
 */
export interface MenuSlots {
  /** 默认插槽 - 菜单项 */
  default?: () => VNode[];
}

/**
 * MenuItem Props
 */
export interface MenuItemProps {
  /** 唯一标识 */
  itemKey: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: string;
  /** 标题 */
  title?: string;
  /** 危险菜单项 */
  danger?: boolean;
}

/**
 * MenuItem Emits
 */
export interface MenuItemEmits {
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void;
}

/**
 * MenuItem Slots
 */
export interface MenuItemSlots {
  /** 默认插槽 */
  default?: () => VNode[];
  /** 图标插槽 */
  icon?: () => VNode[];
}

/**
 * SubMenu Props
 */
export interface SubMenuProps {
  /** 唯一标识 */
  itemKey: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: string;
  /** 标题 */
  title?: string;
}

/**
 * SubMenu Slots
 */
export interface SubMenuSlots {
  /** 默认插槽 - 子菜单项 */
  default?: () => VNode[];
  /** 图标插槽 */
  icon?: () => VNode[];
  /** 标题插槽 */
  title?: () => VNode[];
}

/**
 * MenuItemGroup Props
 */
export interface MenuItemGroupProps {
  /** 分组标题 */
  title?: string;
}

/**
 * MenuItemGroup Slots
 */
export interface MenuItemGroupSlots {
  /** 默认插槽 - 菜单项 */
  default?: () => VNode[];
  /** 标题插槽 */
  title?: () => VNode[];
}

/**
 * Menu 上下文
 */
export interface MenuContext {
  mode: Ref<MenuMode>;
  theme: Ref<MenuTheme>;
  collapsed: Ref<boolean>;
  selectedKeys: Ref<string[]>;
  openKeys: Ref<string[]>;
  multiple: Ref<boolean>;
  selectable: Ref<boolean>;
  level: number;
  keyPath: string[];
  registerItem: (key: string) => void;
  unregisterItem: (key: string) => void;
  selectItem: (key: string, keyPath: string[], event: MouseEvent) => void;
  toggleSubMenu: (key: string) => void;
  getKeyPath: () => string[];
}

/**
 * Menu 注入 Key
 */
export const MENU_INJECTION_KEY: InjectionKey<MenuContext> = Symbol('menu');

/**
 * Menu 暴露的方法
 */
export interface MenuInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
