<script setup lang="ts">
/**
 * CardError 卡片错误组件
 *
 * 为基础卡片插件提供的错误状态组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-card-error               - 错误容器
 * - .chips-card-error__icon         - 错误图标
 * - .chips-card-error__message      - 错误消息
 * - .chips-card-error__retry        - 重试按钮
 */

import { computed } from 'vue';
import type { CardErrorProps, CardErrorEmits } from './types';

// Props
const props = withDefaults(defineProps<CardErrorProps>(), {
  retryable: false,
});

// Emits
const emit = defineEmits<CardErrorEmits>();

// 计算错误消息文本
const errorMessage = computed(() => {
  if (!props.error) return '';
  if (typeof props.error === 'string') return props.error;
  return props.error.message;
});

// 处理重试点击
const handleRetry = () => {
  emit('retry');
};
</script>

<template>
  <div class="chips-card-error">
    <!-- 错误图标 -->
    <div class="chips-card-error__icon">
      <slot name="icon">⚠</slot>
    </div>

    <!-- 错误消息 -->
    <div class="chips-card-error__message">
      <slot name="message">{{ errorMessage }}</slot>
    </div>

    <!-- 重试按钮 -->
    <button
      v-if="retryable"
      type="button"
      class="chips-card-error__retry"
      @click="handleRetry"
    >
      <slot name="retry">重试</slot>
    </button>
  </div>
</template>

<!-- 不包含任何样式 -->
