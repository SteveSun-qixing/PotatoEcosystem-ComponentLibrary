<script setup lang="ts">
/**
 * MenuItemGroup 菜单组组件
 *
 * 无样式菜单组组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-menu-group               - 菜单组容器
 * - .chips-menu-group__title        - 组标题
 * - .chips-menu-group__list         - 组内菜单项列表
 */

import type { MenuItemGroupProps } from './types';
import { classNames } from '@/utils';

// Props
const props = defineProps<MenuItemGroupProps>();

// 计算样式类名
const groupClass = classNames('chips-menu-group');
</script>

<template>
  <li
    :class="groupClass"
    role="group"
  >
    <!-- 组标题 -->
    <div class="chips-menu-group__title" role="presentation">
      <slot name="title">{{ title }}</slot>
    </div>

    <!-- 组内菜单项 -->
    <ul class="chips-menu-group__list" role="menu">
      <slot />
    </ul>
  </li>
</template>

<!-- 不包含任何样式 -->
