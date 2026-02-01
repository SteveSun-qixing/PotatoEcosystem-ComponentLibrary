<script setup lang="ts">
/**
 * Form 表单组件
 *
 * 无样式表单容器组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-form                  - 表单容器
 * - .chips-form--horizontal      - 水平布局
 * - .chips-form--vertical        - 垂直布局
 * - .chips-form--inline          - 行内布局
 * - .chips-form--disabled        - 禁用状态
 */

import { computed, provide, reactive, ref, toRef, watch } from 'vue';
import type {
  FormProps,
  FormEmits,
  FormInstance,
  FormContext,
  FormItemInstance,
  FormRule,
  FormValidateError,
  FormRules,
} from './types';
import { FORM_CONTEXT_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<FormProps>(), {
  layout: 'vertical',
  labelAlign: 'right',
  disabled: false,
  scrollToError: true,
});

// Emits
const emit = defineEmits<FormEmits>();

// 表单 ref
const formRef = ref<HTMLFormElement | null>(null);

// 存储注册的 FormItem 实例
const fieldsMap = reactive(new Map<string, FormItemInstance>());

// 内部 model（用于存储初始值以支持重置）
const initialModel = ref<Record<string, unknown>>({});

// 初始化时保存初始值
watch(
  () => props.model,
  (newModel) => {
    if (newModel && Object.keys(initialModel.value).length === 0) {
      initialModel.value = JSON.parse(JSON.stringify(newModel));
    }
  },
  { immediate: true }
);

// 计算样式类名
const formClass = computed(() =>
  classNames(
    'chips-form',
    `chips-form--${props.layout}`,
    {
      'chips-form--disabled': props.disabled,
    }
  )
);

// 注册 FormItem
const registerField = (name: string, instance: FormItemInstance) => {
  fieldsMap.set(name, instance);
};

// 注销 FormItem
const unregisterField = (name: string) => {
  fieldsMap.delete(name);
};

// 获取字段规则
const getFieldRules = (name: string): FormRule[] => {
  if (!props.rules) return [];
  const fieldRules = props.rules[name];
  if (!fieldRules) return [];
  return Array.isArray(fieldRules) ? fieldRules : [fieldRules];
};

// 获取嵌套字段值（支持 'user.name' 路径）
const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return undefined;
    result = (result as Record<string, unknown>)[key];
  }
  return result;
};

// 设置嵌套字段值
const setNestedValue = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
};

// 获取字段值
const getFieldValue = (name: string): unknown => {
  if (!props.model) return undefined;
  return getNestedValue(props.model, name);
};

// 设置字段值
const setFieldValue = (name: string, value: unknown): void => {
  if (!props.model) return;
  const oldValues = JSON.parse(JSON.stringify(props.model));
  setNestedValue(props.model, name, value);
  emit('valuesChange', { [name]: value }, props.model);
};

// 获取所有字段值
const getFieldsValue = (): Record<string, unknown> => {
  return props.model ? JSON.parse(JSON.stringify(props.model)) : {};
};

// 设置多个字段值
const setFieldsValue = (values: Record<string, unknown>): void => {
  if (!props.model) return;
  Object.entries(values).forEach(([key, value]) => {
    setNestedValue(props.model!, key, value);
  });
  emit('valuesChange', values, props.model);
};

// 验证单个字段
const validateField = async (field: string): Promise<void> => {
  const instance = fieldsMap.get(field);
  if (instance) {
    await instance.validate();
  }
};

// 验证表单
const validate = async (fields?: string[]): Promise<void> => {
  const fieldsToValidate = fields || Array.from(fieldsMap.keys());
  const errors: FormValidateError[] = [];

  await Promise.all(
    fieldsToValidate.map(async (field) => {
      const instance = fieldsMap.get(field);
      if (instance) {
        try {
          await instance.validate();
        } catch (error) {
          if (error instanceof Error) {
            errors.push({ field, message: error.message });
          }
        }
      }
    })
  );

  if (errors.length > 0) {
    emit('validateError', errors);
    
    // 滚动到第一个错误字段
    if (props.scrollToError && formRef.value) {
      const firstErrorField = errors[0].field;
      const errorElement = formRef.value.querySelector(`[data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    throw new Error('Form validation failed');
  }

  emit('validateSuccess', getFieldsValue());
};

// 重置字段
const resetFields = (fields?: string[]): void => {
  const fieldsToReset = fields || Array.from(fieldsMap.keys());
  
  fieldsToReset.forEach((field) => {
    // 恢复初始值
    if (props.model && initialModel.value) {
      const initialValue = getNestedValue(initialModel.value, field);
      setNestedValue(props.model, field, initialValue);
    }
    
    // 调用 FormItem 的重置方法
    const instance = fieldsMap.get(field);
    if (instance) {
      instance.resetField();
    }
  });
};

// 清除验证状态
const clearValidate = (fields?: string[]): void => {
  const fieldsToClear = fields || Array.from(fieldsMap.keys());
  
  fieldsToClear.forEach((field) => {
    const instance = fieldsMap.get(field);
    if (instance) {
      instance.clearValidate();
    }
  });
};

// 处理表单提交
const handleSubmit = async (event: Event) => {
  event.preventDefault();
  
  try {
    await validate();
    emit('submit', getFieldsValue());
  } catch (error) {
    // 验证失败，已在 validate 中处理
  }
};

// 提供上下文给子组件
const formContext: FormContext = {
  model: toRef(props, 'model') as any,
  rules: toRef(props, 'rules') as any,
  layout: toRef(props, 'layout') as any,
  labelWidth: toRef(props, 'labelWidth') as any,
  labelAlign: toRef(props, 'labelAlign') as any,
  disabled: toRef(props, 'disabled') as any,
  registerField,
  unregisterField,
  getFieldRules,
  getFieldValue,
  setFieldValue,
};

provide(FORM_CONTEXT_KEY, formContext);

// 暴露实例方法
defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  clearValidate,
  getFieldValue,
  setFieldValue,
  getFieldsValue,
  setFieldsValue,
});
</script>

<template>
  <form
    ref="formRef"
    :class="formClass"
    @submit="handleSubmit"
  >
    <slot />
  </form>
</template>

<!-- 不包含任何样式 -->
