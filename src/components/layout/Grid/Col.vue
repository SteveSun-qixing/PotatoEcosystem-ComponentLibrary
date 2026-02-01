<script setup lang="ts">
/**
 * Col 栅格列组件
 *
 * 无样式组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-col                  - 列容器
 * - .chips-col--1 ~ --24        - 跨度类 (span)
 * - .chips-col--offset-1 ~ -24  - 偏移类 (offset)
 * - .chips-col--push-1 ~ -24    - 右移类 (push)
 * - .chips-col--pull-1 ~ -24    - 左移类 (pull)
 * - .chips-col--order-*         - 顺序类 (order)
 * - .chips-col--xs-1 ~ -24      - xs 响应式
 * - .chips-col--xs-offset-1 ~ -24
 * - .chips-col--sm-1 ~ -24      - sm 响应式
 * - .chips-col--sm-offset-1 ~ -24
 * - .chips-col--md-1 ~ -24      - md 响应式
 * - .chips-col--md-offset-1 ~ -24
 * - .chips-col--lg-1 ~ -24      - lg 响应式
 * - .chips-col--lg-offset-1 ~ -24
 * - .chips-col--xl-1 ~ -24      - xl 响应式
 * - .chips-col--xl-offset-1 ~ -24
 * - .chips-col--xxl-1 ~ -24     - xxl 响应式
 * - .chips-col--xxl-offset-1 ~ -24
 */

import { computed, inject } from 'vue';
import { classNames } from '@/utils';
import type { ColProps, ColSpanConfig, Breakpoint, RowContext } from './types';
import { ROW_CONTEXT_KEY } from './types';

// Props
const props = defineProps<ColProps>();

// 从 Row 获取 gutter 上下文
const rowContext = inject<RowContext>(ROW_CONTEXT_KEY, {
  horizontalGutter: 0,
  verticalGutter: 0,
});

/**
 * 解析响应式配置
 */
const parseColConfig = (value: number | ColSpanConfig | undefined): ColSpanConfig => {
  if (value === undefined) {
    return {};
  }
  if (typeof value === 'number') {
    return { span: value };
  }
  return value;
};

/**
 * 生成响应式类名
 */
const generateResponsiveClasses = (
  breakpoint: Breakpoint,
  config: ColSpanConfig
): string[] => {
  const classes: string[] = [];
  const prefix = `chips-col--${breakpoint}`;

  if (config.span !== undefined && config.span >= 0 && config.span <= 24) {
    classes.push(`${prefix}-${config.span}`);
  }

  if (config.offset !== undefined && config.offset >= 0 && config.offset <= 24) {
    classes.push(`${prefix}-offset-${config.offset}`);
  }

  if (config.push !== undefined && config.push >= 0 && config.push <= 24) {
    classes.push(`${prefix}-push-${config.push}`);
  }

  if (config.pull !== undefined && config.pull >= 0 && config.pull <= 24) {
    classes.push(`${prefix}-pull-${config.pull}`);
  }

  if (config.order !== undefined) {
    classes.push(`${prefix}-order-${config.order}`);
  }

  return classes;
};

/**
 * 计算列样式
 * 注意: 只有动态计算的布局值才允许使用内联 style
 * gutter 需要设置 padding 来创建间距
 */
const colStyle = computed(() => {
  const style: Record<string, string> = {};

  if (rowContext.horizontalGutter > 0) {
    const paddingH = `${rowContext.horizontalGutter / 2}px`;
    style.paddingLeft = paddingH;
    style.paddingRight = paddingH;
  }

  if (rowContext.verticalGutter > 0) {
    const paddingV = `${rowContext.verticalGutter / 2}px`;
    style.paddingTop = paddingV;
    style.paddingBottom = paddingV;
  }

  // order 也通过 style 设置（如果有的话）
  if (props.order !== undefined) {
    style.order = String(props.order);
  }

  return style;
});

/**
 * 计算样式类名
 */
const colClass = computed(() => {
  const classes: (string | Record<string, boolean>)[] = ['chips-col'];

  // 基础 span
  if (props.span !== undefined && props.span >= 0 && props.span <= 24) {
    classes.push(`chips-col--${props.span}`);
  }

  // 基础 offset
  if (props.offset !== undefined && props.offset >= 0 && props.offset <= 24) {
    classes.push(`chips-col--offset-${props.offset}`);
  }

  // 基础 push
  if (props.push !== undefined && props.push >= 0 && props.push <= 24) {
    classes.push(`chips-col--push-${props.push}`);
  }

  // 基础 pull
  if (props.pull !== undefined && props.pull >= 0 && props.pull <= 24) {
    classes.push(`chips-col--pull-${props.pull}`);
  }

  // 响应式类名
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  for (const bp of breakpoints) {
    const config = parseColConfig(props[bp]);
    const responsiveClasses = generateResponsiveClasses(bp, config);
    classes.push(...responsiveClasses);
  }

  // 自定义类名
  if (props.class) {
    classes.push(props.class);
  }

  return classNames(...classes);
});
</script>

<template>
  <div :class="colClass" :style="colStyle">
    <slot />
  </div>
</template>
