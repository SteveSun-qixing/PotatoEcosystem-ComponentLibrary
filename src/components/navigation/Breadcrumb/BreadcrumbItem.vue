<script setup lang="ts">
/**
 * BreadcrumbItem 面包屑项组件
 *
 * 无样式面包屑项组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-breadcrumb__item         - 面包屑项
 * - .chips-breadcrumb__item--disabled - 禁用状态
 * - .chips-breadcrumb__link         - 链接
 * - .chips-breadcrumb__separator    - 分隔符
 */

import { computed, inject, useSlots } from 'vue';
import type { BreadcrumbItemProps, BreadcrumbItemEmits, BreadcrumbItemInstance } from './types';
import { BREADCRUMB_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  disabled: false,
});

// Emits
const emit = defineEmits<BreadcrumbItemEmits>();

// Slots
const slots = useSlots();

// 注入面包屑上下文
const breadcrumbContext = inject(BREADCRUMB_INJECTION_KEY);

// 是否有链接
const hasLink = computed(() => {
  return !!props.href || !!props.to;
});

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
};

// 计算样式类名
const itemClass = computed(() =>
  classNames('chips-breadcrumb__item', {
    'chips-breadcrumb__item--disabled': props.disabled,
  })
);

const linkClass = computed(() =>
  classNames('chips-breadcrumb__link', {
    'chips-breadcrumb__link--disabled': props.disabled,
  })
);
</script>

<template>
  <li :class="itemClass">
    <!-- 链接内容 -->
    <template v-if="hasLink && !disabled">
      <!-- 使用 href -->
      <a
        v-if="href"
        :href="href"
        :class="linkClass"
        @click="handleClick"
      >
        <slot />
      </a>
      <!-- 使用 router-link (to) -->
      <router-link
        v-else-if="to"
        :to="to"
        :class="linkClass"
        custom
        v-slot="{ navigate }"
      >
        <a
          :class="linkClass"
          @click="(e: MouseEvent) => { handleClick(e); navigate(e); }"
        >
          <slot />
        </a>
      </router-link>
    </template>
    <!-- 非链接内容 -->
    <span
      v-else
      :class="linkClass"
      @click="handleClick"
    >
      <slot />
    </span>

    <!-- 分隔符 -->
    <span class="chips-breadcrumb__separator" aria-hidden="true">
      <slot name="separator">{{ breadcrumbContext?.separator.value }}</slot>
    </span>
  </li>
</template>

<!-- 不包含任何样式 -->
