<script setup lang="ts">
/**
 * CardLoading 卡片加载组件
 *
 * 为基础卡片插件提供的加载状态组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-card-loading             - 加载容器
 * - .chips-card-loading__spinner    - 加载指示器
 * - .chips-card-loading__tip        - 提示文本
 */

import type { CardLoadingProps } from './types';

// Props
defineProps<CardLoadingProps>();
</script>

<template>
  <div class="chips-card-loading">
    <!-- 加载指示器 -->
    <div class="chips-card-loading__spinner">
      <slot />
    </div>

    <!-- 提示文本 -->
    <div
      v-if="tip || $slots.tip"
      class="chips-card-loading__tip"
    >
      <slot name="tip">{{ tip }}</slot>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
