<script setup lang="ts">
/**
 * Tag 标签组件
 *
 * 无样式标签组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-tag                - 标签容器
 * - .chips-tag--default       - 默认颜色
 * - .chips-tag--success       - 成功颜色
 * - .chips-tag--processing    - 处理中颜色
 * - .chips-tag--warning       - 警告颜色
 * - .chips-tag--error         - 错误颜色
 * - .chips-tag--custom        - 自定义颜色
 * - .chips-tag--closable      - 可关闭状态
 * - .chips-tag--bordered      - 有边框
 * - .chips-tag--small         - 小尺寸
 * - .chips-tag--medium        - 中尺寸
 * - .chips-tag--large         - 大尺寸
 * - .chips-tag__icon          - 图标区域
 * - .chips-tag__content       - 内容区域
 * - .chips-tag__close         - 关闭按钮
 *
 * CSS 变量:
 * - --chips-tag-color         - 自定义颜色值
 */

import { computed, ref, useSlots } from 'vue';
import type { TagProps, TagEmits, TagInstance, TagPresetColor } from './types';
import { classNames } from '@/utils';

// 预设颜色列表
const PRESET_COLORS: TagPresetColor[] = ['default', 'success', 'processing', 'warning', 'error'];

// Props
const props = withDefaults(defineProps<TagProps>(), {
  color: 'default',
  closable: false,
  bordered: true,
  size: 'medium',
});

// Emits
const emit = defineEmits<TagEmits>();

// Slots
const slots = useSlots();

// Refs
const tagRef = ref<HTMLElement | null>(null);

// 是否为预设颜色
const isPresetColor = computed(() => PRESET_COLORS.includes(props.color as TagPresetColor));

// 是否有图标插槽
const hasIcon = computed(() => !!slots.icon);

// 计算样式类名
const tagClass = computed(() =>
  classNames('chips-tag', `chips-tag--${props.size}`, {
    [`chips-tag--${props.color}`]: isPresetColor.value,
    'chips-tag--custom': !isPresetColor.value,
    'chips-tag--closable': props.closable,
    'chips-tag--bordered': props.bordered,
  })
);

// 计算样式
const tagStyle = computed(() => {
  if (isPresetColor.value) return {};

  return {
    '--chips-tag-color': props.color,
  };
});

// 处理点击
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

// 处理关闭
const handleClose = (event: MouseEvent) => {
  event.stopPropagation();
  emit('close', event);
};

// 暴露实例方法
defineExpose<TagInstance>({
  $el: tagRef.value,
});
</script>

<template>
  <span
    ref="tagRef"
    :class="tagClass"
    :style="tagStyle"
    @click="handleClick"
  >
    <!-- 图标区域 -->
    <span
      v-if="hasIcon"
      class="chips-tag__icon"
    >
      <slot name="icon" />
    </span>

    <!-- 内容区域 -->
    <span class="chips-tag__content">
      <slot />
    </span>

    <!-- 关闭按钮 -->
    <span
      v-if="closable"
      class="chips-tag__close"
      role="button"
      tabindex="0"
      aria-label="Close"
      @click="handleClose"
      @keydown.enter="handleClose"
      @keydown.space.prevent="handleClose"
    >
      <slot name="closeIcon" />
    </span>
  </span>
</template>

<!-- 不包含任何样式 -->
