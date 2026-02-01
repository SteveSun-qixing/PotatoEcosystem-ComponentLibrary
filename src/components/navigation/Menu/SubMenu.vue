<script setup lang="ts">
/**
 * SubMenu 子菜单组件
 *
 * 无样式子菜单组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-menu-submenu             - 子菜单容器
 * - .chips-menu-submenu--open       - 展开状态
 * - .chips-menu-submenu--disabled   - 禁用状态
 * - .chips-menu-submenu__title      - 标题区域
 * - .chips-menu-submenu__icon       - 图标
 * - .chips-menu-submenu__content    - 标题内容
 * - .chips-menu-submenu__arrow      - 箭头
 * - .chips-menu-submenu__popup      - 弹出层（horizontal/vertical 模式）
 * - .chips-menu-submenu__inline     - 内联内容（inline 模式）
 */

import { computed, inject, provide, useSlots, ref, onMounted, onUnmounted } from 'vue';
import type { SubMenuProps, MenuContext } from './types';
import { MENU_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<SubMenuProps>(), {
  disabled: false,
});

// Slots
const slots = useSlots();

// 注入父级菜单上下文
const parentMenuContext = inject(MENU_INJECTION_KEY);

// Refs
const submenuRef = ref<HTMLElement | null>(null);

// 是否展开
const isOpen = computed(() => {
  return parentMenuContext?.openKeys.value.includes(props.itemKey) ?? false;
});

// 计算 keyPath
const keyPath = computed(() => {
  return parentMenuContext ? [...parentMenuContext.keyPath, props.itemKey] : [props.itemKey];
});

// 计算层级
const level = computed(() => {
  return (parentMenuContext?.level ?? 0) + 1;
});

// 提供子菜单上下文
const submenuContext: MenuContext = {
  mode: parentMenuContext!.mode,
  theme: parentMenuContext!.theme,
  collapsed: parentMenuContext!.collapsed,
  selectedKeys: parentMenuContext!.selectedKeys,
  openKeys: parentMenuContext!.openKeys,
  multiple: parentMenuContext!.multiple,
  selectable: parentMenuContext!.selectable,
  level: level.value,
  keyPath: keyPath.value,
  registerItem: parentMenuContext!.registerItem,
  unregisterItem: parentMenuContext!.unregisterItem,
  selectItem: parentMenuContext!.selectItem,
  toggleSubMenu: parentMenuContext!.toggleSubMenu,
  getKeyPath: () => keyPath.value,
};

provide(MENU_INJECTION_KEY, submenuContext);

// 注册/注销子菜单
onMounted(() => {
  parentMenuContext?.registerItem(props.itemKey);
});

onUnmounted(() => {
  parentMenuContext?.unregisterItem(props.itemKey);
});

// 点击标题处理
const handleTitleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  parentMenuContext?.toggleSubMenu(props.itemKey);
};

// hover 处理（用于 horizontal/vertical 模式）
let hoverTimer: ReturnType<typeof setTimeout> | null = null;

const handleMouseEnter = () => {
  if (props.disabled) return;
  if (parentMenuContext?.mode.value === 'inline') return;

  clearHoverTimer();
  hoverTimer = setTimeout(() => {
    if (!isOpen.value) {
      parentMenuContext?.toggleSubMenu(props.itemKey);
    }
  }, 100);
};

const handleMouseLeave = () => {
  if (parentMenuContext?.mode.value === 'inline') return;

  clearHoverTimer();
  hoverTimer = setTimeout(() => {
    if (isOpen.value) {
      parentMenuContext?.toggleSubMenu(props.itemKey);
    }
  }, 100);
};

const clearHoverTimer = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
};

onUnmounted(() => {
  clearHoverTimer();
});

// 是否有图标插槽
const hasIcon = computed(() => !!slots.icon || !!props.icon);

// 是否为内联模式
const isInlineMode = computed(() => parentMenuContext?.mode.value === 'inline');

// 计算样式类名
const submenuClass = computed(() =>
  classNames('chips-menu-submenu', {
    'chips-menu-submenu--open': isOpen.value,
    'chips-menu-submenu--disabled': props.disabled,
  })
);

const titleClass = computed(() =>
  classNames('chips-menu-submenu__title', {
    'chips-menu-submenu__title--disabled': props.disabled,
  })
);
</script>

<template>
  <li
    ref="submenuRef"
    :class="submenuClass"
    role="none"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 标题 -->
    <div
      :class="titleClass"
      role="menuitem"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="handleTitleClick"
    >
      <!-- 图标 -->
      <span
        v-if="hasIcon"
        class="chips-menu-submenu__icon"
      >
        <slot name="icon">
          <!-- 默认图标由主题包提供 -->
        </slot>
      </span>

      <!-- 标题内容 -->
      <span class="chips-menu-submenu__content">
        <slot name="title">{{ title }}</slot>
      </span>

      <!-- 箭头 -->
      <span class="chips-menu-submenu__arrow" aria-hidden="true">
        <slot name="arrow">
          <!-- 默认箭头由主题包提供 -->
        </slot>
      </span>
    </div>

    <!-- 子菜单内容 - inline 模式 -->
    <ul
      v-if="isInlineMode"
      v-show="isOpen"
      class="chips-menu-submenu__inline"
      role="menu"
    >
      <slot />
    </ul>

    <!-- 子菜单内容 - popup 模式 -->
    <ul
      v-else
      v-show="isOpen"
      class="chips-menu-submenu__popup"
      role="menu"
    >
      <slot />
    </ul>
  </li>
</template>

<!-- 不包含任何样式 -->
