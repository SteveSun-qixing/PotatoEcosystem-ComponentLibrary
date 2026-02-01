<script setup lang="ts">
/**
 * Menu 菜单组件
 *
 * 无样式菜单组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-menu                     - 菜单容器
 * - .chips-menu--horizontal         - 水平模式
 * - .chips-menu--vertical           - 垂直模式
 * - .chips-menu--inline             - 内联模式
 * - .chips-menu--collapsed          - 收起状态
 * - .chips-menu--light              - 浅色主题
 * - .chips-menu--dark               - 深色主题
 */

import { computed, ref, provide, getCurrentInstance, toRef } from 'vue';
import type { MenuProps, MenuEmits, MenuInstance, MenuContext } from './types';
import { MENU_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<MenuProps>(), {
  mode: 'vertical',
  defaultSelectedKeys: () => [],
  defaultOpenKeys: () => [],
  theme: 'light',
  collapsed: false,
  multiple: false,
  selectable: true,
});

// Emits
const emit = defineEmits<MenuEmits>();

// 获取组件实例
const instance = getCurrentInstance();

// Refs
const menuRef = ref<HTMLElement | null>(null);

// 是否为受控模式
const isSelectedKeysControlled = computed(() => {
  const vnodeProps = instance?.vnode?.props;
  return vnodeProps ? 'selectedKeys' in vnodeProps : false;
});

const isOpenKeysControlled = computed(() => {
  const vnodeProps = instance?.vnode?.props;
  return vnodeProps ? 'openKeys' in vnodeProps : false;
});

// 内部状态
const internalSelectedKeys = ref<string[]>([...props.defaultSelectedKeys]);
const internalOpenKeys = ref<string[]>([...props.defaultOpenKeys]);

// 实际选中状态
const actualSelectedKeys = computed(() => {
  return isSelectedKeysControlled.value ? (props.selectedKeys || []) : internalSelectedKeys.value;
});

// 实际展开状态
const actualOpenKeys = computed(() => {
  return isOpenKeysControlled.value ? (props.openKeys || []) : internalOpenKeys.value;
});

// 注册的菜单项
const registeredItems = ref<Set<string>>(new Set());

// 选中菜单项
const selectItem = (key: string, keyPath: string[], event: MouseEvent) => {
  if (!props.selectable) return;

  let newSelectedKeys: string[];
  const isSelected = actualSelectedKeys.value.includes(key);

  if (props.multiple) {
    if (isSelected) {
      newSelectedKeys = actualSelectedKeys.value.filter((k) => k !== key);
    } else {
      newSelectedKeys = [...actualSelectedKeys.value, key];
    }
  } else {
    newSelectedKeys = isSelected ? [] : [key];
  }

  if (!isSelectedKeysControlled.value) {
    internalSelectedKeys.value = newSelectedKeys;
  }

  emit('update:selectedKeys', newSelectedKeys);
  emit('click', { key, keyPath, domEvent: event });

  if (isSelected) {
    emit('deselect', { key, keyPath, selectedKeys: newSelectedKeys, domEvent: event });
  } else {
    emit('select', { key, keyPath, selectedKeys: newSelectedKeys, domEvent: event });
  }
};

// 切换子菜单
const toggleSubMenu = (key: string) => {
  const isOpen = actualOpenKeys.value.includes(key);
  let newOpenKeys: string[];

  if (isOpen) {
    newOpenKeys = actualOpenKeys.value.filter((k) => k !== key);
  } else {
    // inline 模式只展开一个
    if (props.mode === 'inline') {
      newOpenKeys = [key];
    } else {
      newOpenKeys = [...actualOpenKeys.value, key];
    }
  }

  if (!isOpenKeysControlled.value) {
    internalOpenKeys.value = newOpenKeys;
  }

  emit('update:openKeys', newOpenKeys);
  emit('openChange', newOpenKeys);
};

// 注册菜单项
const registerItem = (key: string) => {
  registeredItems.value.add(key);
};

// 注销菜单项
const unregisterItem = (key: string) => {
  registeredItems.value.delete(key);
};

// 提供上下文
const menuContext: MenuContext = {
  mode: toRef(props, 'mode'),
  theme: toRef(props, 'theme'),
  collapsed: toRef(props, 'collapsed'),
  selectedKeys: actualSelectedKeys as any,
  openKeys: actualOpenKeys as any,
  multiple: toRef(props, 'multiple'),
  selectable: toRef(props, 'selectable'),
  level: 0,
  keyPath: [],
  registerItem,
  unregisterItem,
  selectItem,
  toggleSubMenu,
  getKeyPath: () => [],
};

provide(MENU_INJECTION_KEY, menuContext);

// 计算样式类名
const menuClass = computed(() =>
  classNames('chips-menu', `chips-menu--${props.mode}`, `chips-menu--${props.theme}`, {
    'chips-menu--collapsed': props.collapsed,
  })
);

// 暴露实例方法
defineExpose<MenuInstance>({
  $el: menuRef.value,
});
</script>

<template>
  <ul
    ref="menuRef"
    :class="menuClass"
    role="menu"
  >
    <slot />
  </ul>
</template>

<!-- 不包含任何样式 -->
