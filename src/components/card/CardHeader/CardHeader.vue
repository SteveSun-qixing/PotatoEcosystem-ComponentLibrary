<script setup lang="ts">
/**
 * CardHeader 卡片头部组件
 *
 * 为基础卡片插件提供的头部组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-card-header              - 头部容器
 * - .chips-card-header__title       - 标题区域
 * - .chips-card-header__actions     - 操作区域
 * - .chips-card-header__close       - 关闭按钮
 */

import type { CardHeaderProps, CardHeaderEmits } from './types';

// Props
withDefaults(defineProps<CardHeaderProps>(), {
  closable: false,
});

// Emits
const emit = defineEmits<CardHeaderEmits>();

// 处理关闭点击
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="chips-card-header">
    <!-- 标题区域 -->
    <div class="chips-card-header__title">
      <slot>{{ title }}</slot>
    </div>

    <!-- 操作区域 -->
    <div
      v-if="$slots.actions || closable"
      class="chips-card-header__actions"
    >
      <slot name="actions" />
      <button
        v-if="closable"
        type="button"
        class="chips-card-header__close"
        @click="handleClose"
      >
        <slot name="close-icon">×</slot>
      </button>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
