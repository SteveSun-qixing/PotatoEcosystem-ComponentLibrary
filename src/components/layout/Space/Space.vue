<script setup lang="ts">
/**
 * Space 间距组件
 *
 * 无样式间距组件，用于为子元素添加间距，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-space                     - Space 容器
 * - .chips-space__item               - 间距项包装器
 * - .chips-space__split              - 分隔符包装器
 * - .chips-space--horizontal         - 水平方向
 * - .chips-space--vertical           - 垂直方向
 * - .chips-space--align-start        - 起点对齐
 * - .chips-space--align-end          - 终点对齐
 * - .chips-space--align-center       - 居中对齐
 * - .chips-space--align-baseline     - 基线对齐
 * - .chips-space--wrap               - 自动换行
 * - .chips-space--small              - 小尺寸（预设）
 * - .chips-space--medium             - 中尺寸（预设）
 * - .chips-space--large              - 大尺寸（预设）
 */

import { computed, useSlots, type VNode } from 'vue';
import type { SpaceProps, SpaceSizePreset } from './types';
import { classNames, isNumber, isString } from '@/utils';

// Props
const props = withDefaults(defineProps<SpaceProps>(), {
  size: 'medium',
  direction: 'horizontal',
  align: 'center',
  wrap: false,
});

// Slots
const slots = useSlots();

// 判断是否为预设尺寸
const isPresetSize = (size: unknown): size is SpaceSizePreset => {
  return isString(size) && ['small', 'medium', 'large'].includes(size);
};

// 计算样式类名
const spaceClass = computed(() => {
  const classes = [
    'chips-space',
    `chips-space--${props.direction}`,
    `chips-space--align-${props.align}`,
  ];

  // 添加预设尺寸类名
  if (isPresetSize(props.size)) {
    classes.push(`chips-space--${props.size}`);
  }

  // 添加换行类名
  if (props.wrap) {
    classes.push('chips-space--wrap');
  }

  return classNames(...classes);
});

// 计算 gap 样式（仅当 size 为数值时使用内联样式）
const gapStyle = computed(() => {
  // 预设尺寸通过 CSS 类名控制，不需要内联样式
  if (isPresetSize(props.size)) {
    return {};
  }

  if (isNumber(props.size)) {
    return {
      gap: `${props.size}px`,
    };
  }

  // 数组格式 [rowGap, columnGap]
  if (Array.isArray(props.size)) {
    const [rowGap, columnGap] = props.size;
    return {
      rowGap: `${rowGap}px`,
      columnGap: `${columnGap}px`,
    };
  }

  return {};
});

// 是否有分隔符插槽
const hasSplit = computed(() => !!slots.split);

// 过滤并获取有效的子节点
const getValidChildren = (vnodes: VNode[] | undefined): VNode[] => {
  if (!vnodes) return [];

  const validChildren: VNode[] = [];

  vnodes.forEach((vnode) => {
    // 过滤掉注释节点和空文本节点
    if (vnode.type === Comment) return;
    if (vnode.type === Text && typeof vnode.children === 'string' && !vnode.children.trim()) return;

    // Fragment 类型的节点，递归处理其子节点
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      validChildren.push(...getValidChildren(vnode.children as VNode[]));
      return;
    }

    validChildren.push(vnode);
  });

  return validChildren;
};

// Fragment, Comment, Text 类型引入
import { Fragment, Comment, Text } from 'vue';
</script>

<template>
  <div
    :class="spaceClass"
    :style="gapStyle"
  >
    <template
      v-for="(child, index) in getValidChildren($slots.default?.())"
      :key="index"
    >
      <!-- 间距项 -->
      <div class="chips-space__item">
        <component :is="() => child" />
      </div>

      <!-- 分隔符（最后一项不显示） -->
      <div
        v-if="hasSplit && index < getValidChildren($slots.default?.()).length - 1"
        class="chips-space__split"
      >
        <slot name="split" />
      </div>
    </template>
  </div>
</template>

<!-- 不包含任何样式 -->
