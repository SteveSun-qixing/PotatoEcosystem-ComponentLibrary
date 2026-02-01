<script setup lang="ts">
/**
 * Loading 加载组件
 *
 * 无样式加载组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-loading              - 容器
 * - .chips-loading__mask        - 遮罩层
 * - .chips-loading__content     - 内容区（spinner + tip）
 * - .chips-loading__spinner     - 加载图标
 * - .chips-loading__text        - 提示文本
 * - .chips-loading--fullscreen  - 全屏模式
 * - .chips-loading--small       - 小尺寸
 * - .chips-loading--default     - 默认尺寸
 * - .chips-loading--large       - 大尺寸
 * - .chips-loading--nested      - 嵌套模式（包裹内容时）
 * - .chips-loading--active      - 激活状态（正在加载）
 */

import { computed, ref, watch, onMounted, onUnmounted, useSlots, Teleport } from 'vue';
import type { LoadingProps, LoadingInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<LoadingProps>(), {
  loading: true,
  size: 'default',
  fullscreen: false,
  delay: 0,
});

// Slots
const slots = useSlots();

// Refs
const loadingRef = ref<HTMLElement | null>(null);

// 延迟显示控制
const delayedLoading = ref(props.delay > 0 ? false : props.loading);
let delayTimer: ReturnType<typeof setTimeout> | null = null;

// 监听 loading 变化，处理延迟显示
watch(
  () => props.loading,
  (newVal) => {
    // 清除之前的定时器
    if (delayTimer) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }

    if (newVal && props.delay > 0) {
      // 延迟显示
      delayTimer = setTimeout(() => {
        delayedLoading.value = true;
      }, props.delay);
    } else {
      // 立即更新（关闭时或无延迟时）
      delayedLoading.value = newVal;
    }
  },
  { immediate: true }
);

// 清理定时器
onUnmounted(() => {
  if (delayTimer) {
    clearTimeout(delayTimer);
    delayTimer = null;
  }
});

// 是否有嵌套内容
const hasContent = computed(() => !!slots.default);

// 是否显示 loading
const shouldShow = computed(() => delayedLoading.value);

// 计算样式类名
const loadingClass = computed(() =>
  classNames('chips-loading', `chips-loading--${props.size}`, {
    'chips-loading--fullscreen': props.fullscreen,
    'chips-loading--nested': hasContent.value,
    'chips-loading--active': shouldShow.value,
  })
);

// 暴露实例方法
defineExpose<LoadingInstance>({
  $el: loadingRef.value,
});
</script>

<template>
  <!-- 全屏模式使用 Teleport -->
  <Teleport
    v-if="fullscreen"
    to="body"
  >
    <div
      v-if="shouldShow"
      ref="loadingRef"
      :class="loadingClass"
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      <div class="chips-loading__mask">
        <div class="chips-loading__content">
          <span class="chips-loading__spinner">
            <slot name="indicator">
              <!-- 默认指示器由主题包提供 -->
              <component
                :is="indicator"
                v-if="indicator"
              />
            </slot>
          </span>
          <span
            v-if="tip || $slots.tip"
            class="chips-loading__text"
          >
            <slot name="tip">{{ tip }}</slot>
          </span>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- 非全屏模式 -->
  <div
    v-else
    ref="loadingRef"
    :class="loadingClass"
  >
    <!-- 嵌套模式：包裹内容 -->
    <template v-if="hasContent">
      <slot />
      <!-- 加载遮罩 -->
      <div
        v-if="shouldShow"
        class="chips-loading__mask"
        role="alert"
        aria-busy="true"
        aria-live="polite"
      >
        <div class="chips-loading__content">
          <span class="chips-loading__spinner">
            <slot name="indicator">
              <component
                :is="indicator"
                v-if="indicator"
              />
            </slot>
          </span>
          <span
            v-if="tip || $slots.tip"
            class="chips-loading__text"
          >
            <slot name="tip">{{ tip }}</slot>
          </span>
        </div>
      </div>
    </template>

    <!-- 独立模式：仅显示加载指示器 -->
    <template v-else>
      <div
        v-if="shouldShow"
        class="chips-loading__content"
        role="alert"
        aria-busy="true"
        aria-live="polite"
      >
        <span class="chips-loading__spinner">
          <slot name="indicator">
            <component
              :is="indicator"
              v-if="indicator"
            />
          </slot>
        </span>
        <span
          v-if="tip || $slots.tip"
          class="chips-loading__text"
        >
          <slot name="tip">{{ tip }}</slot>
        </span>
      </div>
    </template>
  </div>
</template>

<!-- 不包含任何样式 -->
