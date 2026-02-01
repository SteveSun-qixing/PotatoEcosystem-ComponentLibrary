/**
 * I18nContext - 多语言上下文管理
 */

import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';

/**
 * 多语言上下文值
 */
export interface I18nContextValue {
  /** 当前语言 */
  locale: string;
  /** 设置语言 */
  setLocale: (locale: string) => void;
  /** 翻译函数 */
  t: (key: string, vars?: Record<string, unknown>) => string;
  /** 格式化日期 */
  formatDate: (date: Date, format?: string) => string;
  /** 格式化数字 */
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

/**
 * 多语言上下文注入键
 */
export const I18nContextKey: InjectionKey<I18nContextValue> = Symbol('I18nContext');

/**
 * 开发环境词汇表
 */
const devVocabulary: Record<string, Record<string, string>> = {
  'zh-CN': {
    // 通用
    'common.ok': '确定',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.remove': '移除',
    'common.close': '关闭',
    'common.confirm': '确认',
    'common.reset': '重置',
    'common.submit': '提交',
    'common.search': '搜索',
    'common.clear': '清除',
    'common.loading': '加载中...',
    'common.success': '成功',
    'common.error': '错误',
    'common.warning': '警告',
    'common.info': '提示',

    // UI 组件
    'ui.empty_data': '暂无数据',
    'ui.select_placeholder': '请选择',
    'ui.input_placeholder': '请输入',
    'ui.search_placeholder': '搜索...',
    'ui.no_results': '无匹配结果',
    'ui.load_more': '加载更多',
    'ui.loading_failed': '加载失败',
    'ui.retry': '重试',
    'ui.expand': '展开',
    'ui.collapse': '收起',
    'ui.prev': '上一页',
    'ui.next': '下一页',
    'ui.total': '共 {total} 条',
    'ui.items_per_page': '每页 {size} 条',
    'ui.goto': '前往',
    'ui.page': '页',

    // 表单
    'form.required': '此项为必填项',
    'form.invalid_email': '请输入有效的邮箱地址',
    'form.invalid_url': '请输入有效的URL',
    'form.min_length': '最少 {min} 个字符',
    'form.max_length': '最多 {max} 个字符',
    'form.min_value': '不能小于 {min}',
    'form.max_value': '不能大于 {max}',
    'form.pattern_mismatch': '格式不正确',

    // 日期
    'date.today': '今天',
    'date.yesterday': '昨天',
    'date.tomorrow': '明天',
    'date.this_week': '本周',
    'date.this_month': '本月',
    'date.this_year': '今年',

    // 上传
    'upload.click_to_upload': '点击上传',
    'upload.drag_to_upload': '拖拽文件到此处上传',
    'upload.upload_failed': '上传失败',
    'upload.file_too_large': '文件大小不能超过 {size}',
    'upload.file_type_not_allowed': '不支持的文件类型',

    // 确认对话框
    'confirm.title': '确认',
    'confirm.delete_title': '确认删除',
    'confirm.delete_message': '确定要删除吗？此操作不可恢复。',
  },
  en: {
    // Common
    'common.ok': 'OK',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.reset': 'Reset',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.clear': 'Clear',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.info': 'Info',

    // UI Components
    'ui.empty_data': 'No data',
    'ui.select_placeholder': 'Please select',
    'ui.input_placeholder': 'Please enter',
    'ui.search_placeholder': 'Search...',
    'ui.no_results': 'No results found',
    'ui.load_more': 'Load more',
    'ui.loading_failed': 'Loading failed',
    'ui.retry': 'Retry',
    'ui.expand': 'Expand',
    'ui.collapse': 'Collapse',
    'ui.prev': 'Previous',
    'ui.next': 'Next',
    'ui.total': 'Total {total} items',
    'ui.items_per_page': '{size} items per page',
    'ui.goto': 'Go to',
    'ui.page': 'page',
  },
};

/**
 * 获取默认语言
 */
function getDefaultLocale(): string {
  if (typeof window !== 'undefined' && window.navigator) {
    return window.navigator.language || 'zh-CN';
  }
  return 'zh-CN';
}

/**
 * 创建多语言上下文
 */
export function createI18nContext(initialLocale?: string): I18nContextValue {
  const localeRef: Ref<string> = ref(initialLocale ?? getDefaultLocale());

  /**
   * 设置语言
   */
  const setLocale = (locale: string) => {
    localeRef.value = locale;
  };

  /**
   * 翻译函数
   */
  const t = (key: string, vars?: Record<string, unknown>): string => {
    const locale = localeRef.value;
    const vocabulary = devVocabulary[locale] ?? devVocabulary['zh-CN'] ?? {};
    let text = vocabulary[key] ?? key;

    // 变量替换
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  };

  /**
   * 格式化日期
   */
  const formatDate = (date: Date, format?: string): string => {
    const locale = localeRef.value;

    if (!format) {
      return date.toLocaleDateString(locale);
    }

    // 简单的格式化实现
    const pad = (n: number) => n.toString().padStart(2, '0');

    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  };

  /**
   * 格式化数字
   */
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    const locale = localeRef.value;
    return new Intl.NumberFormat(locale, options).format(num);
  };

  return {
    locale: localeRef.value,
    setLocale,
    t,
    formatDate,
    formatNumber,
  };
}

/**
 * 提供多语言上下文
 */
export function provideI18nContext(context: I18nContextValue): void {
  provide(I18nContextKey, context);
}

/**
 * 注入多语言上下文
 */
export function useI18nContext(): I18nContextValue | undefined {
  return inject(I18nContextKey);
}
