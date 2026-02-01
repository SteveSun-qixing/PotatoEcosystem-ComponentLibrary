<script setup lang="ts">
/**
 * CardWrapper 卡片包装器组件
 *
 * 为基础卡片插件提供的包装容器，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-card-wrapper             - 包装器容器
 * - .chips-card-wrapper__header     - 头部区域
 * - .chips-card-wrapper__content    - 内容区域
 * - .chips-card-wrapper__footer     - 底部区域
 * - .chips-card-wrapper--editable   - 可编辑状态
 * - .chips-card-wrapper--loading    - 加载中状态
 * - .chips-card-wrapper--error      - 错误状态
 */

import { computed } from 'vue';
import type { CardWrapperProps } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<CardWrapperProps>(), {
  editable: false,
  loading: false,
  error: null,
});

// 计算样式类名
const wrapperClass = computed(() =>
  classNames('chips-card-wrapper', {
    'chips-card-wrapper--editable': props.editable,
    'chips-card-wrapper--loading': props.loading,
    'chips-card-wrapper--error': !!props.error,
  })
);
</script>

<template>
  <div
    :class="wrapperClass"
    :data-card-id="cardId"
    :data-card-type="cardType"
    :data-theme="theme"
  >
    <!-- 头部区域 -->
    <div
      v-if="$slots.header"
      class="chips-card-wrapper__header"
    >
      <slot name="header" />
    </div>

    <!-- 内容区域 -->
    <div class="chips-card-wrapper__content">
      <slot />
    </div>

    <!-- 底部区域 -->
    <div
      v-if="$slots.footer"
      class="chips-card-wrapper__footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
