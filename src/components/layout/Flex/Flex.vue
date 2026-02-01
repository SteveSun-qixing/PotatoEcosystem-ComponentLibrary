<script setup lang="ts">
/**
 * Flex 弹性布局组件
 *
 * 无样式弹性布局容器，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-flex                                - Flex 容器
 * - .chips-flex--inline                        - 内联 Flex
 * - .chips-flex--direction-row                 - 主轴水平向右
 * - .chips-flex--direction-row-reverse         - 主轴水平向左
 * - .chips-flex--direction-column              - 主轴垂直向下
 * - .chips-flex--direction-column-reverse      - 主轴垂直向上
 * - .chips-flex--justify-start                 - 主轴起点对齐
 * - .chips-flex--justify-end                   - 主轴终点对齐
 * - .chips-flex--justify-center                - 主轴居中对齐
 * - .chips-flex--justify-space-between         - 主轴两端对齐
 * - .chips-flex--justify-space-around          - 主轴环绕对齐
 * - .chips-flex--justify-space-evenly          - 主轴均匀分布
 * - .chips-flex--align-start                   - 交叉轴起点对齐
 * - .chips-flex--align-end                     - 交叉轴终点对齐
 * - .chips-flex--align-center                  - 交叉轴居中对齐
 * - .chips-flex--align-baseline                - 交叉轴基线对齐
 * - .chips-flex--align-stretch                 - 交叉轴拉伸对齐
 * - .chips-flex--wrap-nowrap                   - 不换行
 * - .chips-flex--wrap-wrap                     - 换行
 * - .chips-flex--wrap-wrap-reverse             - 反向换行
 */

import { computed } from 'vue';
import type { FlexProps } from './types';
import { classNames, isNumber } from '@/utils';

// Props
const props = withDefaults(defineProps<FlexProps>(), {
  direction: 'row',
  justify: 'start',
  align: 'stretch',
  wrap: 'nowrap',
  inline: false,
});

// 计算样式类名
const flexClass = computed(() =>
  classNames(
    'chips-flex',
    `chips-flex--direction-${props.direction}`,
    `chips-flex--justify-${props.justify}`,
    `chips-flex--align-${props.align}`,
    `chips-flex--wrap-${props.wrap}`,
    {
      'chips-flex--inline': props.inline,
    }
  )
);

// 计算 gap 样式（动态布局值，允许内联样式）
const gapStyle = computed(() => {
  if (props.gap === undefined) {
    return {};
  }

  if (isNumber(props.gap)) {
    return {
      gap: `${props.gap}px`,
    };
  }

  // 数组格式 [rowGap, columnGap]
  const [rowGap, columnGap] = props.gap;
  return {
    rowGap: `${rowGap}px`,
    columnGap: `${columnGap}px`,
  };
});
</script>

<template>
  <div
    :class="flexClass"
    :style="gapStyle"
  >
    <slot />
  </div>
</template>

<!-- 不包含任何样式 -->
