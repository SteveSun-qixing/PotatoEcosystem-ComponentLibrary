/**
 * Form 表单组件类型定义
 */

import type { InjectionKey, Ref } from 'vue';

/**
 * 表单布局类型
 */
export type FormLayout = 'horizontal' | 'vertical' | 'inline';

/**
 * 标签对齐方式
 */
export type FormLabelAlign = 'left' | 'right';

/**
 * 验证触发方式
 */
export type FormTrigger = 'blur' | 'change';

/**
 * 验证状态
 */
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating';

/**
 * 验证规则类型
 */
export type FormRuleType = 'string' | 'number' | 'boolean' | 'array' | 'email' | 'url';

/**
 * 表单验证规则
 */
export interface FormRule {
  /** 是否必填 */
  required?: boolean;
  /** 验证失败消息 */
  message?: string;
  /** 值类型 */
  type?: FormRuleType;
  /** 最小值或最小长度 */
  min?: number;
  /** 最大值或最大长度 */
  max?: number;
  /** 正则表达式 */
  pattern?: RegExp;
  /** 自定义验证函数 */
  validator?: (rule: FormRule, value: unknown) => Promise<void> | void;
  /** 触发验证的时机 */
  trigger?: FormTrigger | FormTrigger[];
}

/**
 * 表单验证规则集合
 */
export type FormRules = Record<string, FormRule | FormRule[]>;

/**
 * 表单验证错误
 */
export interface FormValidateError {
  /** 字段名 */
  field: string;
  /** 错误消息 */
  message: string;
}

/**
 * Form Props
 */
export interface FormProps {
  /** 表单数据模型 */
  model?: Record<string, unknown>;
  /** 表单验证规则 */
  rules?: FormRules;
  /** 表单布局 */
  layout?: FormLayout;
  /** 标签宽度 */
  labelWidth?: number | string;
  /** 标签对齐方式 */
  labelAlign?: FormLabelAlign;
  /** 是否禁用整个表单 */
  disabled?: boolean;
  /** 验证失败时是否滚动到错误字段 */
  scrollToError?: boolean;
}

/**
 * Form Emits
 */
export interface FormEmits {
  /** 表单提交事件 */
  (e: 'submit', values: Record<string, unknown>): void;
  /** 表单值变化事件 */
  (e: 'valuesChange', changedValues: Record<string, unknown>, allValues: Record<string, unknown>): void;
  /** 验证成功事件 */
  (e: 'validateSuccess', values: Record<string, unknown>): void;
  /** 验证失败事件 */
  (e: 'validateError', errors: FormValidateError[]): void;
}

/**
 * Form 暴露的方法
 */
export interface FormInstance {
  /** 验证表单 */
  validate: (fields?: string[]) => Promise<void>;
  /** 验证单个字段 */
  validateField: (field: string) => Promise<void>;
  /** 重置表单字段 */
  resetFields: (fields?: string[]) => void;
  /** 清除验证状态 */
  clearValidate: (fields?: string[]) => void;
  /** 获取字段值 */
  getFieldValue: (field: string) => unknown;
  /** 设置字段值 */
  setFieldValue: (field: string, value: unknown) => void;
  /** 获取所有字段值 */
  getFieldsValue: () => Record<string, unknown>;
  /** 设置多个字段值 */
  setFieldsValue: (values: Record<string, unknown>) => void;
}

/**
 * FormItem Props
 */
export interface FormItemProps {
  /** 标签文本 */
  label?: string;
  /** 字段名（支持路径，如 'user.name'） */
  name?: string | string[];
  /** 验证规则 */
  rules?: FormRule | FormRule[];
  /** 是否必填（将自动添加必填规则） */
  required?: boolean;
  /** 标签宽度（覆盖 Form 的 labelWidth） */
  labelWidth?: number | string;
  /** 帮助提示信息 */
  help?: string;
  /** 额外信息 */
  extra?: string;
  /** 验证状态（手动控制） */
  validateStatus?: FormValidateStatus;
  /** 是否显示验证反馈图标 */
  hasFeedback?: boolean;
}

/**
 * FormItem 暴露的方法
 */
export interface FormItemInstance {
  /** 验证字段 */
  validate: () => Promise<void>;
  /** 重置字段 */
  resetField: () => void;
  /** 清除验证状态 */
  clearValidate: () => void;
}

/**
 * Form 上下文（provide/inject）
 */
export interface FormContext {
  /** 表单 model */
  model: Ref<Record<string, unknown> | undefined>;
  /** 表单 rules */
  rules: Ref<FormRules | undefined>;
  /** 表单布局 */
  layout: Ref<FormLayout>;
  /** 标签宽度 */
  labelWidth: Ref<number | string | undefined>;
  /** 标签对齐 */
  labelAlign: Ref<FormLabelAlign>;
  /** 是否禁用 */
  disabled: Ref<boolean>;
  /** 注册 FormItem */
  registerField: (name: string, instance: FormItemInstance) => void;
  /** 注销 FormItem */
  unregisterField: (name: string) => void;
  /** 获取字段规则 */
  getFieldRules: (name: string) => FormRule[];
  /** 获取字段值 */
  getFieldValue: (name: string) => unknown;
  /** 设置字段值 */
  setFieldValue: (name: string, value: unknown) => void;
}

/**
 * Form 上下文注入 key
 */
export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('form-context');

/**
 * FormItem 上下文（provide/inject）
 */
export interface FormItemContext {
  /** 字段名 */
  name: Ref<string | undefined>;
  /** 验证状态 */
  validateStatus: Ref<FormValidateStatus | undefined>;
  /** 是否禁用 */
  disabled: Ref<boolean>;
  /** 触发验证 */
  triggerValidate: (trigger: FormTrigger) => void;
}

/**
 * FormItem 上下文注入 key
 */
export const FORM_ITEM_CONTEXT_KEY: InjectionKey<FormItemContext> = Symbol('form-item-context');
