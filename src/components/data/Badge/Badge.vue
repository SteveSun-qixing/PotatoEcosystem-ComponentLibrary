<script setup lang="ts">
/**
 * Badge 徽标组件
 *
 * 无样式徽标组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-badge                       - 徽标容器
 * - .chips-badge--dot                  - 小红点模式
 * - .chips-badge--status               - 状态点模式
 * - .chips-badge--standalone           - 独立使用（无子元素）
 * - .chips-badge__count                - 数字徽标
 * - .chips-badge__dot                  - 小红点
 * - .chips-badge__status               - 状态点
 * - .chips-badge__text                 - 状态文本
 * - .chips-badge-status--success       - 成功状态
 * - .chips-badge-status--processing    - 处理中状态
 * - .chips-badge-status--default       - 默认状态
 * - .chips-badge-status--error         - 错误状态
 * - .chips-badge-status--warning       - 警告状态
 *
 * CSS 变量:
 * - --chips-badge-color                - 自定义颜色
 * - --chips-badge-offset-x             - X 轴偏移
 * - --chips-badge-offset-y             - Y 轴偏移
 */

import { computed, ref, useSlots } from 'vue';
import type { BadgeProps, BadgeEmits, BadgeInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<BadgeProps>(), {
  showZero: false,
  overflowCount: 99,
  dot: false,
});

// Emits
const emit = defineEmits<BadgeEmits>();

// Slots
const slots = useSlots();

// Refs
const badgeRef = ref<HTMLElement | null>(null);

// 是否有默认插槽内容
const hasContent = computed(() => !!slots.default);

// 是否为状态点模式
const isStatus = computed(() => !!props.status);

// 是否显示徽标
const showBadge = computed(() => {
  if (props.dot) return true;
  if (isStatus.value) return true;
  if (props.count === undefined || props.count === null) return false;
  if (typeof props.count === 'string') return true;
  return props.count > 0 || props.showZero;
});

// 显示的数字/文本
const displayCount = computed(() => {
  if (props.dot || isStatus.value) return '';
  if (typeof props.count === 'string') return props.count;
  if (typeof props.count === 'number') {
    return props.count > props.overflowCount ? `${props.overflowCount}+` : String(props.count);
  }
  return '';
});

// 计算样式类名
const badgeClass = computed(() =>
  classNames('chips-badge', {
    'chips-badge--dot': props.dot,
    'chips-badge--status': isStatus.value,
    'chips-badge--standalone': !hasContent.value,
  })
);

// 状态点类名
const statusClass = computed(() => {
  if (!isStatus.value) return '';
  return classNames('chips-badge__status', `chips-badge-status--${props.status}`);
});

// 计算样式
const badgeStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.color) {
    style['--chips-badge-color'] = props.color;
  }

  if (props.offset) {
    style['--chips-badge-offset-x'] = `${props.offset[0]}px`;
    style['--chips-badge-offset-y'] = `${props.offset[1]}px`;
  }

  return style;
});

// 处理点击
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

// 暴露实例方法
defineExpose<BadgeInstance>({
  $el: badgeRef.value,
});
</script>

<template>
  <span
    ref="badgeRef"
    :class="badgeClass"
    :style="badgeStyle"
    @click="handleClick"
  >
    <!-- 被包裹的内容 -->
    <slot />

    <!-- 状态点模式 -->
    <template v-if="isStatus">
      <span :class="statusClass" />
      <span
        v-if="text"
        class="chips-badge__text"
      >
        {{ text }}
      </span>
    </template>

    <!-- 小红点模式 -->
    <span
      v-else-if="dot && showBadge"
      class="chips-badge__dot"
    />

    <!-- 数字徽标 -->
    <span
      v-else-if="showBadge"
      class="chips-badge__count"
    >
      <slot name="count">{{ displayCount }}</slot>
    </span>
  </span>
</template>

<!-- 不包含任何样式 -->
