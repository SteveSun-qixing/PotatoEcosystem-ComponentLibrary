<script setup lang="ts">
/**
 * Footer 布局底部组件
 *
 * 无样式底部组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-layout-footer - 底部容器
 */

import { computed } from 'vue';
import { classNames } from '@/utils';

// 计算样式类名
const footerClass = computed(() => classNames('chips-layout-footer'));
</script>

<template>
  <footer :class="footerClass">
    <slot />
  </footer>
</template>

<!-- 不包含任何样式 -->
