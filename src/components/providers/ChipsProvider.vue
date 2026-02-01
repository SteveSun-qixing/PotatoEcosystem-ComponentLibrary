<script setup lang="ts">
/**
 * ChipsProvider - 薯片生态上下文提供者
 *
 * 注入主题、内核连接和多语言等全局上下文
 */

import { provide, computed } from 'vue';
import type { Theme } from '@/types';
import {
  ThemeContextKey,
  createThemeContext,
  defaultTheme,
  themeToCSSVariables,
} from '@/theme/ThemeContext';
import { KernelContextKey, createKernelContext } from '@/kernel/KernelContext';
import { I18nContextKey, createI18nContext } from '@/i18n/I18nContext';

/**
 * 全局配置
 */
interface GlobalConfig {
  /** 组件尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** z-index 基准值 */
  zIndex?: number;
  /** 是否启用过渡动画 */
  animation?: boolean;
}

interface ChipsProviderProps {
  /** 主题配置 */
  theme?: Theme | string;
  /** 语言设置 */
  locale?: string;
  /** 全局配置 */
  config?: GlobalConfig;
}

const props = withDefaults(defineProps<ChipsProviderProps>(), {
  config: () => ({
    size: 'medium',
    animation: true,
  }),
});

// 创建上下文
const themeContext = createThemeContext(props.theme);
const kernelContext = createKernelContext();
const i18nContext = createI18nContext(props.locale);

// 提供上下文
provide(ThemeContextKey, themeContext);
provide(KernelContextKey, kernelContext);
provide(I18nContextKey, i18nContext);

// 获取当前有效主题
const effectiveTheme = computed(() => {
  if (!props.theme) return defaultTheme;

  if (typeof props.theme === 'string') {
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

  // 主题变量
  Object.entries(cssVariables.value).forEach(([key, value]) => {
    styles[key] = value;
  });

  // z-index 基准值
  if (props.config?.zIndex !== undefined) {
    styles['--chips-z-index-base'] = String(props.config.zIndex);
  }

  return styles;
});

// 组件类名
const providerClass = computed(() => {
  const classes = ['chips-provider'];

  if (effectiveTheme.value.isDark) {
    classes.push('chips-provider--dark');
  }

  if (props.config?.size) {
    classes.push(`chips-provider--${props.config.size}`);
  }

  if (props.config?.animation === false) {
    classes.push('chips-provider--no-animation');
  }

  return classes;
});
</script>

<template>
  <div
    :class="providerClass"
    :style="styleObject"
  >
    <slot />
  </div>
</template>

<!-- 不包含任何样式 -->
