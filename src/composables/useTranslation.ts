/**
 * useTranslation - 多语言翻译组合式函数
 */

import { computed, inject } from 'vue';
import { I18nContextKey, createI18nContext } from '@/i18n/I18nContext';

/**
 * 获取翻译相关的组合式函数
 */
export function useTranslation() {
  const context = inject(I18nContextKey) ?? createI18nContext();

  /**
   * 当前语言
   */
  const locale = computed(() => context.locale);

  /**
   * 翻译函数
   *
   * @example
   * const { t } = useTranslation();
   * t('common.ok') // => '确定'
   * t('ui.total', { total: 100 }) // => '共 100 条'
   */
  const t = (key: string, vars?: Record<string, unknown>): string => {
    return context.t(key, vars);
  };

  /**
   * 设置语言
   */
  const setLocale = (newLocale: string) => {
    context.setLocale(newLocale);
  };

  /**
   * 格式化日期
   *
   * @example
   * formatDate(new Date()) // => '2024/1/1'
   * formatDate(new Date(), 'YYYY-MM-DD') // => '2024-01-01'
   */
  const formatDate = (date: Date, format?: string): string => {
    return context.formatDate(date, format);
  };

  /**
   * 格式化数字
   *
   * @example
   * formatNumber(1234567.89) // => '1,234,567.89'
   * formatNumber(0.5, { style: 'percent' }) // => '50%'
   */
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    return context.formatNumber(num, options);
  };

  /**
   * 格式化货币
   */
  const formatCurrency = (num: number, currency = 'CNY'): string => {
    return context.formatNumber(num, {
      style: 'currency',
      currency,
    });
  };

  /**
   * 格式化百分比
   */
  const formatPercent = (num: number, decimals = 0): string => {
    return context.formatNumber(num, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return {
    locale,
    t,
    setLocale,
    formatDate,
    formatNumber,
    formatCurrency,
    formatPercent,
  };
}

export default useTranslation;
