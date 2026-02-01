<script setup lang="ts">
/**
 * MenuDivider 菜单分割线组件
 *
 * 无样式菜单分割线组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-menu-divider             - 分割线
 */

import { classNames } from '@/utils';

// 计算样式类名
const dividerClass = classNames('chips-menu-divider');
</script>

<template>
  <li
    :class="dividerClass"
    role="separator"
  />
</template>

<!-- 不包含任何样式 -->
