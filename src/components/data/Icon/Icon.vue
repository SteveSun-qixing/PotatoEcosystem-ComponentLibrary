<script setup lang="ts">
/**
 * Icon 图标组件
 *
 * 无样式图标组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-icon              - 图标容器
 * - .chips-icon--spin        - 旋转动画状态
 * - .chips-icon--clickable   - 可点击状态
 * - .chips-icon__svg         - SVG 元素
 *
 * CSS 变量:
 * - --chips-icon-size        - 图标大小
 * - --chips-icon-color       - 图标颜色
 * - --chips-icon-rotate      - 旋转角度
 */

import { computed, ref, useSlots } from 'vue';
import type { IconProps, IconEmits, IconInstance } from './types';
import { classNames, isNumber } from '@/utils';

// Props
const props = withDefaults(defineProps<IconProps>(), {
  spin: false,
  rotate: 0,
});

// Emits
const emit = defineEmits<IconEmits>();

// Slots
const slots = useSlots();

// Refs
const iconRef = ref<HTMLElement | null>(null);

// 是否有默认插槽
const hasSlot = computed(() => !!slots.default);

// 计算样式类名
const iconClass = computed(() =>
  classNames('chips-icon', {
    'chips-icon--spin': props.spin,
    [`chips-icon--${props.name}`]: !!props.name,
  })
);

// 计算样式
const iconStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.size !== undefined) {
    const size = isNumber(props.size) ? `${props.size}px` : props.size;
    style['--chips-icon-size'] = size;
  }

  if (props.color) {
    style['--chips-icon-color'] = props.color;
  }

  if (props.rotate !== 0) {
    style['--chips-icon-rotate'] = `${props.rotate}deg`;
  }

  return style;
});

// 处理点击
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

// 暴露实例方法
defineExpose<IconInstance>({
  $el: iconRef.value,
});
</script>

<template>
  <span
    ref="iconRef"
    :class="iconClass"
    :style="iconStyle"
    role="img"
    :aria-label="name"
    :aria-hidden="!name && !hasSlot"
    @click="handleClick"
  >
    <!-- 自定义 SVG 内容 -->
    <span
      v-if="hasSlot"
      class="chips-icon__svg"
    >
      <slot />
    </span>

    <!-- 通过 name 引用的图标由主题包提供 -->
  </span>
</template>

<!-- 不包含任何样式 -->
