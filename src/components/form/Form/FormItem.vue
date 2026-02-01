<script setup lang="ts">
/**
 * FormItem 表单项组件
 *
 * 无样式表单项组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-form-item             - 表单项容器
 * - .chips-form-item__label      - 标签区域
 * - .chips-form-item__required   - 必填标记
 * - .chips-form-item__control    - 控件容器
 * - .chips-form-item__content    - 内容区域
 * - .chips-form-item__help       - 帮助/错误信息
 * - .chips-form-item__extra      - 额外信息
 * - .chips-form-item__feedback   - 验证反馈图标
 * - .chips-form-item--error      - 错误状态
 * - .chips-form-item--warning    - 警告状态
 * - .chips-form-item--success    - 成功状态
 * - .chips-form-item--validating - 验证中状态
 * - .chips-form-item--required   - 必填项
 * - .chips-form-item--has-help   - 有帮助信息
 * - .chips-form-item--has-feedback - 有反馈图标
 */

import { computed, inject, onMounted, onUnmounted, provide, ref, toRef, watch } from 'vue';
import type {
  FormItemProps,
  FormItemInstance,
  FormContext,
  FormItemContext,
  FormRule,
  FormValidateStatus,
  FormTrigger,
} from './types';
import { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from './types';
import { classNames, generateId, pxToNumber } from '@/utils';

// Props
const props = withDefaults(defineProps<FormItemProps>(), {
  hasFeedback: false,
});

// 注入 Form 上下文
const formContext = inject(FORM_CONTEXT_KEY, null);

// 内部验证状态
const internalValidateStatus = ref<FormValidateStatus | undefined>();
const validateMessage = ref<string>('');

// 生成唯一 ID
const fieldId = generateId('form-item');

// 获取规范化的字段名
const fieldName = computed(() => {
  if (!props.name) return undefined;
  return Array.isArray(props.name) ? props.name.join('.') : props.name;
});

// 获取所有验证规则
const fieldRules = computed((): FormRule[] => {
  const rules: FormRule[] = [];

  // FormItem 自身的 rules
  if (props.rules) {
    const propRules = Array.isArray(props.rules) ? props.rules : [props.rules];
    rules.push(...propRules);
  }

  // Form 的 rules
  if (formContext && fieldName.value) {
    const formRules = formContext.getFieldRules(fieldName.value);
    rules.push(...formRules);
  }

  // required prop 转为规则
  if (props.required) {
    const hasRequiredRule = rules.some((rule) => rule.required);
    if (!hasRequiredRule) {
      rules.unshift({ required: true, message: `${props.label || fieldName.value} is required` });
    }
  }

  return rules;
});

// 是否必填
const isRequired = computed(() => {
  return props.required || fieldRules.value.some((rule) => rule.required);
});

// 当前验证状态
const currentValidateStatus = computed(() => {
  return props.validateStatus || internalValidateStatus.value;
});

// 显示的帮助/错误信息
const displayHelp = computed(() => {
  if (validateMessage.value) {
    return validateMessage.value;
  }
  return props.help;
});

// 计算标签宽度样式
const labelStyle = computed(() => {
  const width = props.labelWidth ?? formContext?.labelWidth.value;
  if (!width) return {};
  
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  return { width: widthValue, flexShrink: 0 };
});

// 计算样式类名
const formItemClass = computed(() =>
  classNames(
    'chips-form-item',
    {
      'chips-form-item--required': isRequired.value,
      'chips-form-item--error': currentValidateStatus.value === 'error',
      'chips-form-item--warning': currentValidateStatus.value === 'warning',
      'chips-form-item--success': currentValidateStatus.value === 'success',
      'chips-form-item--validating': currentValidateStatus.value === 'validating',
      'chips-form-item--has-help': !!displayHelp.value,
      'chips-form-item--has-feedback': props.hasFeedback,
    }
  )
);

// 验证单个规则
const validateRule = async (rule: FormRule, value: unknown): Promise<void> => {
  // 必填验证
  if (rule.required) {
    const isEmpty = 
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);
    
    if (isEmpty) {
      throw new Error(rule.message || `${props.label || fieldName.value} is required`);
    }
  }

  // 如果值为空且不是必填，跳过其他验证
  if (value === undefined || value === null || value === '') {
    return;
  }

  // 类型验证
  if (rule.type) {
    let valid = true;
    const typeMessage = rule.message || `${props.label || fieldName.value} is not a valid ${rule.type}`;
    
    switch (rule.type) {
      case 'string':
        valid = typeof value === 'string';
        break;
      case 'number':
        valid = typeof value === 'number' && !isNaN(value);
        break;
      case 'boolean':
        valid = typeof value === 'boolean';
        break;
      case 'array':
        valid = Array.isArray(value);
        break;
      case 'email':
        valid = typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'url':
        valid = typeof value === 'string' && /^https?:\/\/.+/.test(value);
        break;
    }
    
    if (!valid) {
      throw new Error(typeMessage);
    }
  }

  // 长度/数值范围验证
  if (rule.min !== undefined || rule.max !== undefined) {
    let length: number;
    
    if (typeof value === 'string' || Array.isArray(value)) {
      length = value.length;
    } else if (typeof value === 'number') {
      length = value;
    } else {
      return;
    }

    if (rule.min !== undefined && length < rule.min) {
      const field = props.label || fieldName.value;
      const message = rule.message || 
        (typeof value === 'number' 
          ? `${field} must be at least ${rule.min}`
          : `${field} must be at least ${rule.min} characters`);
      throw new Error(message);
    }

    if (rule.max !== undefined && length > rule.max) {
      const field = props.label || fieldName.value;
      const message = rule.message || 
        (typeof value === 'number'
          ? `${field} must be at most ${rule.max}`
          : `${field} must be at most ${rule.max} characters`);
      throw new Error(message);
    }
  }

  // 正则验证
  if (rule.pattern) {
    const stringValue = String(value);
    if (!rule.pattern.test(stringValue)) {
      throw new Error(rule.message || `${props.label || fieldName.value} format is invalid`);
    }
  }

  // 自定义验证器
  if (rule.validator) {
    await rule.validator(rule, value);
  }
};

// 执行验证
const validate = async (): Promise<void> => {
  if (!fieldName.value) return;

  const value = formContext?.getFieldValue(fieldName.value);
  const rules = fieldRules.value;

  if (rules.length === 0) return;

  internalValidateStatus.value = 'validating';
  validateMessage.value = '';

  try {
    for (const rule of rules) {
      await validateRule(rule, value);
    }
    internalValidateStatus.value = 'success';
  } catch (error) {
    internalValidateStatus.value = 'error';
    if (error instanceof Error) {
      validateMessage.value = error.message;
    }
    throw error;
  }
};

// 按触发方式验证
const triggerValidate = (trigger: FormTrigger): void => {
  const rules = fieldRules.value.filter((rule) => {
    if (!rule.trigger) return trigger === 'change'; // 默认 change 触发
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger);
    }
    return rule.trigger === trigger;
  });

  if (rules.length > 0) {
    validate().catch(() => {
      // 验证失败，错误已记录
    });
  }
};

// 重置字段
const resetField = (): void => {
  internalValidateStatus.value = undefined;
  validateMessage.value = '';
};

// 清除验证状态
const clearValidate = (): void => {
  internalValidateStatus.value = undefined;
  validateMessage.value = '';
};

// 计算是否禁用
const isDisabled = computed(() => {
  return formContext?.disabled.value ?? false;
});

// 提供 FormItem 上下文给子组件（如 Input、Select 等）
const formItemContext: FormItemContext = {
  name: fieldName as any,
  validateStatus: currentValidateStatus as any,
  disabled: isDisabled as any,
  triggerValidate,
};

provide(FORM_ITEM_CONTEXT_KEY, formItemContext);

// 注册到 Form
onMounted(() => {
  if (formContext && fieldName.value) {
    formContext.registerField(fieldName.value, {
      validate,
      resetField,
      clearValidate,
    });
  }
});

// 从 Form 注销
onUnmounted(() => {
  if (formContext && fieldName.value) {
    formContext.unregisterField(fieldName.value);
  }
});

// 暴露实例方法
defineExpose<FormItemInstance>({
  validate,
  resetField,
  clearValidate,
});
</script>

<template>
  <div
    :class="formItemClass"
    :data-field="fieldName"
  >
    <!-- 标签区域 -->
    <label
      v-if="label"
      :for="fieldId"
      class="chips-form-item__label"
      :style="labelStyle"
    >
      <span
        v-if="isRequired"
        class="chips-form-item__required"
        aria-hidden="true"
      >
        *
      </span>
      {{ label }}
    </label>

    <!-- 控件容器 -->
    <div class="chips-form-item__control">
      <!-- 内容区域 -->
      <div class="chips-form-item__content">
        <slot />
        
        <!-- 验证反馈图标 -->
        <span
          v-if="hasFeedback && currentValidateStatus"
          class="chips-form-item__feedback"
          :data-status="currentValidateStatus"
        >
          <slot :name="`feedback-${currentValidateStatus}`" />
        </span>
      </div>

      <!-- 帮助/错误信息 -->
      <div
        v-if="displayHelp"
        class="chips-form-item__help"
        :role="currentValidateStatus === 'error' ? 'alert' : undefined"
      >
        {{ displayHelp }}
      </div>

      <!-- 额外信息 -->
      <div
        v-if="extra"
        class="chips-form-item__extra"
      >
        {{ extra }}
      </div>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
