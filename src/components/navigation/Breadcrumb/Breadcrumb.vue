<script setup lang="ts">
/**
 * Breadcrumb 面包屑组件
 *
 * 无样式面包屑组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-breadcrumb               - 面包屑容器
 */

import { ref, provide, toRef } from 'vue';
import type { BreadcrumbProps, BreadcrumbInstance, BreadcrumbContext } from './types';
import { BREADCRUMB_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
});

// Refs
const breadcrumbRef = ref<HTMLElement | null>(null);

// 提供上下文
const breadcrumbContext: BreadcrumbContext = {
  separator: toRef(props, 'separator'),
};

provide(BREADCRUMB_INJECTION_KEY, breadcrumbContext);

// 计算样式类名
const breadcrumbClass = classNames('chips-breadcrumb');

// 暴露实例方法
defineExpose<BreadcrumbInstance>({
  $el: breadcrumbRef.value,
});
</script>

<template>
  <nav
    ref="breadcrumbRef"
    :class="breadcrumbClass"
    aria-label="breadcrumb"
  >
    <ol class="chips-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>

<!-- 不包含任何样式 -->
