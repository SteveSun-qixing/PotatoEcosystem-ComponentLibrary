<script setup lang="ts">
/**
 * ThemeProvider - 主题提供者组件
 *
 * 提供主题上下文，注入主题到子组件
 */

import { computed, provide, watch } from 'vue';
import type { Theme } from '@/types';
import {
  ThemeContextKey,
  createThemeContext,
  defaultTheme,
  themeToCSSVariables,
} from './ThemeContext';

interface ThemeProviderProps {
  /** 主题对象或主题ID */
  theme?: Theme | string;
}

const props = defineProps<ThemeProviderProps>();

// 创建主题上下文
const context = createThemeContext(props.theme);

// 提供主题上下文
provide(ThemeContextKey, context);

// 获取当前有效主题
const effectiveTheme = computed(() => {
  if (!props.theme) return defaultTheme;

  if (typeof props.theme === 'string') {
    // TODO: 从主题ID加载主题
    return { ...defaultTheme, id: props.theme };
  }

  return props.theme;
});

// CSS 变量样式
const cssVariables = computed(() => {
  return themeToCSSVariables(effectiveTheme.value);
});

// 样式对象
const styleObject = computed(() => {
  const styles: Record<string, string> = {};
  Object.entries(cssVariables.value).forEach(([key, value]) => {
    styles[key] = value;
  });
  return styles;
});

// 监听主题变化
watch(
  () => props.theme,
  (newTheme) => {
    if (newTheme) {
      context.setTheme(newTheme);
    }
  }
);
</script>

<template>
  <div
    class="chips-theme-provider"
    :style="styleObject"
  >
    <slot />
  </div>
</template>

<!-- 不包含任何样式 -->
