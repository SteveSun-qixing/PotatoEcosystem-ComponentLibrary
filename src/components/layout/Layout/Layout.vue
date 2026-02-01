<script setup lang="ts">
/**
 * Layout 布局容器组件
 *
 * 无样式布局组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-layout           - 布局容器
 * - .chips-layout--has-sider - 包含侧边栏的布局
 */

import { computed, provide, ref, useSlots } from 'vue';
import type { LayoutProps, SiderContextValue } from './types';
import { SIDER_CONTEXT_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<LayoutProps>(), {
  hasSider: undefined,
});

// Slots
const slots = useSlots();

// Sider 计数器，用于自动检测是否有 Sider 子组件
const siderCount = ref(0);

// 提供 Sider 上下文给子组件
const siderContext: SiderContextValue = {
  siderCount,
  addSider: () => {
    siderCount.value++;
  },
  removeSider: () => {
    siderCount.value--;
  },
};

provide(SIDER_CONTEXT_KEY, siderContext);

// 计算是否有 Sider
// 如果显式传入 hasSider 则使用传入值，否则自动检测
const hasSider = computed(() => {
  if (props.hasSider !== undefined) {
    return props.hasSider;
  }
  return siderCount.value > 0;
});

// 计算样式类名
const layoutClass = computed(() =>
  classNames('chips-layout', {
    'chips-layout--has-sider': hasSider.value,
  })
);
</script>

<template>
  <section :class="layoutClass">
    <slot />
  </section>
</template>

<!-- 不包含任何样式 -->
