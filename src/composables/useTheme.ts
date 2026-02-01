/**
 * useTheme - 主题相关组合式函数
 */

import { computed, inject } from 'vue';
import { ThemeContextKey, defaultTheme } from '@/theme/ThemeContext';
import type { Theme, ThemeVariables } from '@/types';

/**
 * 获取主题相关的组合式函数
 */
export function useTheme() {
  const context = inject(ThemeContextKey);

  /**
   * 当前主题
   */
  const theme = computed<Theme>(() => {
    return context?.getEffectiveTheme() ?? defaultTheme;
  });

  /**
   * 主题变量
   */
  const variables = computed<ThemeVariables>(() => {
    return theme.value.variables;
  });

  /**
   * 是否为深色主题
   */
  const isDark = computed<boolean>(() => {
    return theme.value.isDark ?? false;
  });

  /**
   * 获取主题变量值
   */
  const getVariable = (path: string): string | number | undefined => {
    const parts = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = variables.value;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  };

  /**
   * 设置主题
   */
  const setTheme = (newTheme: Theme | string) => {
    if (context) {
      context.setTheme(newTheme);
    }
  };

  return {
    theme,
    variables,
    isDark,
    getVariable,
    setTheme,
  };
}

export default useTheme;
