/**
 * 主题上下文管理
 */

import { inject, provide, ref, computed, type InjectionKey, type Ref } from 'vue';
import type { Theme, ThemeContextValue } from '@/types';

/**
 * 默认主题变量
 */
const defaultThemeVariables = {
  colors: {
    primary: 'var(--chips-color-primary)',
    primaryLight: 'var(--chips-color-primary-light)',
    primaryDark: 'var(--chips-color-primary-dark)',
    success: 'var(--chips-color-success)',
    warning: 'var(--chips-color-warning)',
    error: 'var(--chips-color-error)',
    info: 'var(--chips-color-info)',
    text: 'var(--chips-color-text)',
    textSecondary: 'var(--chips-color-text-secondary)',
    textDisabled: 'var(--chips-color-text-disabled)',
    background: 'var(--chips-color-background)',
    surface: 'var(--chips-color-surface)',
    border: 'var(--chips-color-border)',
    divider: 'var(--chips-color-divider)',
  },
  typography: {
    fontFamily: 'var(--chips-font-family)',
    fontFamilyMono: 'var(--chips-font-family-mono)',
    fontSizeBase: 'var(--chips-font-size-base)',
    fontSizeSm: 'var(--chips-font-size-sm)',
    fontSizeLg: 'var(--chips-font-size-lg)',
    fontSizeHeading: 'var(--chips-font-size-heading)',
    lineHeight: 1.5,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  spacing: {
    xs: 'var(--chips-spacing-xs)',
    sm: 'var(--chips-spacing-sm)',
    md: 'var(--chips-spacing-md)',
    lg: 'var(--chips-spacing-lg)',
    xl: 'var(--chips-spacing-xl)',
    xxl: 'var(--chips-spacing-xxl)',
  },
  borderRadius: {
    none: '0',
    sm: 'var(--chips-radius-sm)',
    md: 'var(--chips-radius-md)',
    lg: 'var(--chips-radius-lg)',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: 'var(--chips-shadow-sm)',
    md: 'var(--chips-shadow-md)',
    lg: 'var(--chips-shadow-lg)',
    xl: 'var(--chips-shadow-xl)',
  },
  transitions: {
    fast: 'var(--chips-transition-fast)',
    normal: 'var(--chips-transition-normal)',
    slow: 'var(--chips-transition-slow)',
  },
};

/**
 * 默认主题
 */
export const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  isDark: false,
  variables: defaultThemeVariables,
};

/**
 * 主题上下文注入键
 */
export const ThemeContextKey: InjectionKey<ThemeContextValue> = Symbol('ThemeContext');

/**
 * 创建主题上下文
 */
export function createThemeContext(initialTheme?: Theme | string): ThemeContextValue {
  const themeRef: Ref<Theme | null> = ref(null);

  // 初始化主题
  if (initialTheme) {
    if (typeof initialTheme === 'string') {
      // TODO: 从主题ID加载主题，暂时使用默认主题
      themeRef.value = { ...defaultTheme, id: initialTheme };
    } else {
      themeRef.value = initialTheme;
    }
  }

  const setTheme = (theme: Theme | string) => {
    if (typeof theme === 'string') {
      // TODO: 从主题ID加载主题
      themeRef.value = { ...defaultTheme, id: theme };
    } else {
      themeRef.value = theme;
    }
  };

  const getEffectiveTheme = (): Theme => {
    return themeRef.value ?? defaultTheme;
  };

  const isDark = computed(() => themeRef.value?.isDark ?? false);

  return {
    theme: themeRef.value,
    setTheme,
    getEffectiveTheme,
    isDark: isDark.value,
  };
}

/**
 * 提供主题上下文
 */
export function provideThemeContext(context: ThemeContextValue): void {
  provide(ThemeContextKey, context);
}

/**
 * 注入主题上下文
 */
export function useThemeContext(): ThemeContextValue | undefined {
  return inject(ThemeContextKey);
}

/**
 * 将主题变量转换为 CSS 变量对象
 */
export function themeToCSSVariables(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {};
  const { colors, typography, spacing, borderRadius, shadows, transitions } = theme.variables;

  // 颜色
  Object.entries(colors).forEach(([key, value]) => {
    const cssKey = `--chips-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    variables[cssKey] = value;
  });

  // 字体
  Object.entries(typography).forEach(([key, value]) => {
    if (typeof value === 'string') {
      const cssKey = `--chips-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      variables[cssKey] = value;
    }
  });

  // 间距
  Object.entries(spacing).forEach(([key, value]) => {
    variables[`--chips-spacing-${key}`] = value;
  });

  // 圆角
  Object.entries(borderRadius).forEach(([key, value]) => {
    variables[`--chips-radius-${key}`] = value;
  });

  // 阴影
  Object.entries(shadows).forEach(([key, value]) => {
    variables[`--chips-shadow-${key}`] = value;
  });

  // 过渡
  Object.entries(transitions).forEach(([key, value]) => {
    variables[`--chips-transition-${key}`] = value;
  });

  return variables;
}
