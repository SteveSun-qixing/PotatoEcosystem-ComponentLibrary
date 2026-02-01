/**
 * Textarea 多行文本框类型定义
 */

/**
 * 自动高度配置
 */
export interface TextareaAutoSize {
  minRows?: number;
  maxRows?: number;
}

/**
 * Textarea Props
 */
export interface TextareaProps {
  /** 绑定值 */
  modelValue?: string;
  /** 默认值（非受控） */
  defaultValue?: string;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 行数 */
  rows?: number;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 自动高度 */
  autoSize?: boolean | TextareaAutoSize;
  /** 调整大小方式 */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /** 状态 */
  status?: 'error' | 'warning';
}

/**
 * Textarea Emits
 */
export interface TextareaEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}

/**
 * Textarea 暴露的方法
 */
export interface TextareaInstance {
  $el: HTMLTextAreaElement | null;
  focus: () => void;
  blur: () => void;
  select: () => void;
}
