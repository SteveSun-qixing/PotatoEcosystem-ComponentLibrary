<script setup lang="ts">
/**
 * Card 容器组件
 *
 * 通用无样式卡片容器，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-card                   - 卡片容器
 * - .chips-card__head             - 卡片头部
 * - .chips-card__title            - 卡片标题
 * - .chips-card__extra            - 右上角额外内容
 * - .chips-card__cover            - 封面区域
 * - .chips-card__body             - 卡片主体内容
 * - .chips-card__actions          - 底部操作区
 * - .chips-card--bordered         - 带边框状态
 * - .chips-card--hoverable        - 可悬停状态
 * - .chips-card--loading          - 加载中状态
 * - .chips-card--small            - 小尺寸
 */

import { computed, useSlots } from 'vue';
import type { CardProps } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<CardProps>(), {
  bordered: false,
  hoverable: false,
  loading: false,
  size: 'default',
});

// Slots
const slots = useSlots();

// 计算是否显示头部
const showHead = computed(() => {
  return props.title || slots.title || slots.extra;
});

// 计算样式类名
const cardClass = computed(() =>
  classNames('chips-card', {
    'chips-card--bordered': props.bordered,
    'chips-card--hoverable': props.hoverable,
    'chips-card--loading': props.loading,
    'chips-card--small': props.size === 'small',
  })
);
</script>

<template>
  <div :class="cardClass">
    <!-- 封面区域 -->
    <div
      v-if="$slots.cover"
      class="chips-card__cover"
    >
      <slot name="cover" />
    </div>

    <!-- 头部区域 -->
    <div
      v-if="showHead"
      class="chips-card__head"
    >
      <div class="chips-card__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        v-if="$slots.extra"
        class="chips-card__extra"
      >
        <slot name="extra" />
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="chips-card__body">
      <slot />
    </div>

    <!-- 底部操作区 -->
    <div
      v-if="$slots.actions"
      class="chips-card__actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
