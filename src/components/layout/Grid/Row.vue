<script setup lang="ts">
/**
 * Row 栅格行组件
 *
 * 无样式组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-row                        - 行容器
 * - .chips-row--justify-start         - 左对齐
 * - .chips-row--justify-center        - 居中对齐
 * - .chips-row--justify-end           - 右对齐
 * - .chips-row--justify-space-between - 两端对齐
 * - .chips-row--justify-space-around  - 等距对齐
 * - .chips-row--justify-space-evenly  - 平均分布
 * - .chips-row--align-top             - 顶部对齐
 * - .chips-row--align-middle          - 垂直居中
 * - .chips-row--align-bottom          - 底部对齐
 * - .chips-row--align-stretch         - 拉伸对齐
 * - .chips-row--no-wrap               - 不换行
 */

import { computed, provide, ref, onMounted, onUnmounted } from 'vue';
import { classNames } from '@/utils';
import type { RowProps, RowContext, Breakpoint, Gutter } from './types';
import { ROW_CONTEXT_KEY, BREAKPOINTS } from './types';

// Props
const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
  wrap: true,
});

// 当前屏幕宽度
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

/**
 * 获取当前断点
 */
const getCurrentBreakpoint = (): Breakpoint => {
  const width = screenWidth.value;
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * 解析响应式 gutter 值
 */
const parseResponsiveGutter = (
  gutterValue: number | Partial<Record<Breakpoint, number>>
): number => {
  if (typeof gutterValue === 'number') {
    return gutterValue;
  }

  // 响应式 gutter
  const breakpoint = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  // 从当前断点向下查找最近的有效值
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (gutterValue[bp] !== undefined) {
      return gutterValue[bp] as number;
    }
  }

  return 0;
};

/**
 * 计算 gutter 值
 */
const gutterValue = computed<[number, number]>(() => {
  const { gutter } = props;

  if (typeof gutter === 'number') {
    return [gutter, 0];
  }

  if (Array.isArray(gutter)) {
    const [h, v] = gutter;
    return [parseResponsiveGutter(h), parseResponsiveGutter(v)];
  }

  // 响应式对象
  return [parseResponsiveGutter(gutter as Partial<Record<Breakpoint, number>>), 0];
});

// 解构 gutter
const horizontalGutter = computed(() => gutterValue.value[0]);
const verticalGutter = computed(() => gutterValue.value[1]);

// 通过 provide 传递 gutter 给 Col
provide<RowContext>(ROW_CONTEXT_KEY, {
  get horizontalGutter() {
    return horizontalGutter.value;
  },
  get verticalGutter() {
    return verticalGutter.value;
  },
});

/**
 * 计算行样式
 * 注意: 只有动态计算的布局值才允许使用内联 style
 * gutter 需要设置负边距来抵消 Col 的 padding
 */
const rowStyle = computed(() => {
  const style: Record<string, string> = {};

  if (horizontalGutter.value > 0) {
    const marginH = `-${horizontalGutter.value / 2}px`;
    style.marginLeft = marginH;
    style.marginRight = marginH;
  }

  if (verticalGutter.value > 0) {
    const marginV = `-${verticalGutter.value / 2}px`;
    style.marginTop = marginV;
    style.marginBottom = marginV;
  }

  return style;
});

/**
 * 计算样式类名
 */
const rowClass = computed(() =>
  classNames(
    'chips-row',
    `chips-row--justify-${props.justify}`,
    `chips-row--align-${props.align}`,
    {
      'chips-row--no-wrap': !props.wrap,
    },
    props.class
  )
);
</script>

<template>
  <div :class="rowClass" :style="rowStyle">
    <slot />
  </div>
</template>
