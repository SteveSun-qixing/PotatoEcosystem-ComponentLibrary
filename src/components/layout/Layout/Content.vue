<script setup lang="ts">
/**
 * Content 布局内容组件
 *
 * 无样式内容组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-layout-content - 内容区域容器
 */

import { computed } from 'vue';
import { classNames } from '@/utils';

// 计算样式类名
const contentClass = computed(() => classNames('chips-layout-content'));
</script>

<template>
  <main :class="contentClass">
    <slot />
  </main>
</template>

<!-- 不包含任何样式 -->
