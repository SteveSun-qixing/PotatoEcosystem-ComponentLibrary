<script setup lang="ts">
/**
 * MenuItem 菜单项组件
 *
 * 无样式菜单项组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-menu-item                - 菜单项
 * - .chips-menu-item--selected      - 选中状态
 * - .chips-menu-item--disabled      - 禁用状态
 * - .chips-menu-item--danger        - 危险状态
 * - .chips-menu-item__icon          - 图标
 * - .chips-menu-item__content       - 内容
 */

import { computed, inject, onMounted, onUnmounted, useSlots } from 'vue';
import type { MenuItemProps, MenuItemEmits } from './types';
import { MENU_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: false,
  danger: false,
});

// Emits
const emit = defineEmits<MenuItemEmits>();

// Slots
const slots = useSlots();

// 注入菜单上下文
const menuContext = inject(MENU_INJECTION_KEY);

// 是否选中
const isSelected = computed(() => {
  return menuContext?.selectedKeys.value.includes(props.itemKey) ?? false;
});

// 计算 keyPath
const keyPath = computed(() => {
  return menuContext ? [...menuContext.keyPath, props.itemKey] : [props.itemKey];
});

// 注册/注销菜单项
onMounted(() => {
  menuContext?.registerItem(props.itemKey);
});

onUnmounted(() => {
  menuContext?.unregisterItem(props.itemKey);
});

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
  menuContext?.selectItem(props.itemKey, keyPath.value, event);
};

// 是否有图标插槽
const hasIcon = computed(() => !!slots.icon || !!props.icon);

// 计算样式类名
const itemClass = computed(() =>
  classNames('chips-menu-item', {
    'chips-menu-item--selected': isSelected.value,
    'chips-menu-item--disabled': props.disabled,
    'chips-menu-item--danger': props.danger,
  })
);
</script>

<template>
  <li
    :class="itemClass"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    :aria-selected="isSelected"
    :title="title"
    @click="handleClick"
  >
    <!-- 图标 -->
    <span
      v-if="hasIcon"
      class="chips-menu-item__icon"
    >
      <slot name="icon">
        <!-- 默认图标由主题包提供 -->
      </slot>
    </span>

    <!-- 内容 -->
    <span class="chips-menu-item__content">
      <slot>{{ title }}</slot>
    </span>
  </li>
</template>

<!-- 不包含任何样式 -->
