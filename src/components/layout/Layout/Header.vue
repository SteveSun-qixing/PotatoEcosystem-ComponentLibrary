<script setup lang="ts">
/**
 * Header 布局头部组件
 *
 * 无样式头部组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-layout-header - 头部容器
 */

import { computed } from 'vue';
import type { HeaderProps } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<HeaderProps>(), {
  height: undefined,
});

// 计算样式类名
const headerClass = computed(() => classNames('chips-layout-header'));

// 计算动态样式（仅用于动态高度）
const headerStyle = computed(() => {
  if (props.height === undefined) {
    return undefined;
  }

  const heightValue =
    typeof props.height === 'number' ? `${props.height}px` : props.height;

  return {
    height: heightValue,
  };
});
</script>

<template>
  <header
    :class="headerClass"
    :style="headerStyle"
  >
    <slot />
  </header>
</template>

<!-- 不包含任何样式 -->
