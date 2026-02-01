<script setup lang="ts">
/**
 * Button 按钮组件
 *
 * 无样式按钮组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-button              - 按钮容器
 * - .chips-button--default     - 默认类型
 * - .chips-button--primary     - 主按钮
 * - .chips-button--dashed      - 虚线按钮
 * - .chips-button--link        - 链接按钮
 * - .chips-button--text        - 文本按钮
 * - .chips-button--small       - 小尺寸
 * - .chips-button--medium      - 中尺寸
 * - .chips-button--large       - 大尺寸
 * - .chips-button--disabled    - 禁用状态
 * - .chips-button--loading     - 加载状态
 * - .chips-button--danger      - 危险按钮
 * - .chips-button--block       - 块级按钮
 * - .chips-button__spinner     - 加载图标
 * - .chips-button__icon        - 图标区域
 * - .chips-button__content     - 内容区域
 */

import { computed, ref, useSlots } from 'vue';
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  danger: false,
  block: false,
  htmlType: 'button',
});

// Emits
const emit = defineEmits<ButtonEmits>();

// Slots
const slots = useSlots();

// Refs
const buttonRef = ref<HTMLButtonElement | null>(null);

// 计算是否禁用（包括加载状态）
const isDisabled = computed(() => props.disabled || props.loading);

// 计算样式类名
const buttonClass = computed(() =>
  classNames('chips-button', `chips-button--${props.type}`, `chips-button--${props.size}`, {
    'chips-button--disabled': isDisabled.value,
    'chips-button--loading': props.loading,
    'chips-button--danger': props.danger,
    'chips-button--block': props.block,
  })
);

// 是否有图标插槽
const hasIcon = computed(() => !!slots.icon);

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
};

// 聚焦
const focus = () => {
  buttonRef.value?.focus();
};

// 失焦
const blur = () => {
  buttonRef.value?.blur();
};

// 暴露实例方法
defineExpose<ButtonInstance>({
  $el: buttonRef.value,
  focus,
  blur,
});
</script>

<template>
  <button
    ref="buttonRef"
    :class="buttonClass"
    :type="htmlType"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    @click="handleClick"
  >
    <!-- 加载状态图标 -->
    <span
      v-if="loading"
      class="chips-button__spinner"
      aria-hidden="true"
    >
      <slot name="loading">
        <!-- 默认加载图标由主题包提供 -->
      </slot>
    </span>

    <!-- 图标插槽 -->
    <span
      v-if="hasIcon && !loading"
      class="chips-button__icon"
    >
      <slot name="icon" />
    </span>

    <!-- 内容区域 -->
    <span class="chips-button__content">
      <slot />
    </span>
  </button>
</template>

<!-- 不包含任何样式 -->
