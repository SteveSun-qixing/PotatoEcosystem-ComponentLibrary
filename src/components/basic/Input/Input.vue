<script setup lang="ts">
/**
 * Input 输入框组件
 *
 * 无样式输入框组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-input              - 输入框容器
 * - .chips-input__wrapper     - 包装层
 * - .chips-input__inner       - 原生 input
 * - .chips-input__prefix      - 前缀区域
 * - .chips-input__suffix      - 后缀区域
 * - .chips-input__clear       - 清除按钮
 * - .chips-input__count       - 字数统计
 * - .chips-input--focused     - 聚焦状态
 * - .chips-input--disabled    - 禁用状态
 * - .chips-input--readonly    - 只读状态
 * - .chips-input--error       - 错误状态
 * - .chips-input--warning     - 警告状态
 * - .chips-input--small       - 小尺寸
 * - .chips-input--medium      - 中尺寸
 * - .chips-input--large       - 大尺寸
 * - .chips-input--has-prefix  - 有前缀
 * - .chips-input--has-suffix  - 有后缀
 * - .chips-input--clearable   - 可清除
 */

import { computed, ref, useSlots, onMounted, watch, toRef } from 'vue';
import type { InputProps, InputEmits, InputInstance } from './types';
import { classNames } from '@/utils';
import { useControllableStateWithWatch } from '@/composables';
import { useTranslation } from '@/composables';

// Props
const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  showCount: false,
  clearable: false,
  autofocus: false,
});

// Emits
const emit = defineEmits<InputEmits>();

// Slots
const slots = useSlots();

// Translation
const { t } = useTranslation();

// Refs
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// 聚焦状态
const focused = ref(false);

// 使用受控/非受控状态管理
const [value, setValue] = useControllableStateWithWatch<string>(
  () => props.modelValue,
  props.defaultValue ?? '',
  (newValue) => {
    emit('update:modelValue', newValue);
  }
);

// 计算是否有前缀
const hasPrefix = computed(() => !!slots.prefix);

// 计算是否有后缀
const hasSuffix = computed(() => !!slots.suffix);

// 计算是否显示清除按钮
const showClearButton = computed(() => {
  return (
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    value.value &&
    value.value.length > 0
  );
});

// 计算字数统计文本
const countText = computed(() => {
  if (!props.showCount) return '';
  const currentLength = value.value?.length ?? 0;
  if (props.maxLength !== undefined) {
    return `${currentLength} / ${props.maxLength}`;
  }
  return String(currentLength);
});

// 计算样式类名
const containerClass = computed(() =>
  classNames(
    'chips-input',
    `chips-input--${props.size}`,
    {
      'chips-input--focused': focused.value,
      'chips-input--disabled': props.disabled,
      'chips-input--readonly': props.readonly,
      'chips-input--error': props.status === 'error',
      'chips-input--warning': props.status === 'warning',
      'chips-input--has-prefix': hasPrefix.value,
      'chips-input--has-suffix': hasSuffix.value || showClearButton.value || props.showCount,
      'chips-input--clearable': props.clearable,
    }
  )
);

// 处理输入事件
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newValue = target.value;
  
  setValue(newValue);
  emit('input', newValue, event);
};

// 处理变化事件
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('change', target.value, event);
};

// 处理聚焦事件
const handleFocus = (event: FocusEvent) => {
  focused.value = true;
  emit('focus', event);
};

// 处理失焦事件
const handleBlur = (event: FocusEvent) => {
  focused.value = false;
  emit('blur', event);
};

// 处理键盘按下事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('pressEnter', event);
  }
};

// 处理清除事件
const handleClear = () => {
  setValue('');
  emit('clear');
  // 清除后聚焦输入框
  inputRef.value?.focus();
};

// 聚焦方法
const focus = () => {
  inputRef.value?.focus();
};

// 失焦方法
const blur = () => {
  inputRef.value?.blur();
};

// 选中方法
const select = () => {
  inputRef.value?.select();
};

// 清空方法
const clear = () => {
  handleClear();
};

// 自动聚焦
onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus();
  }
});

// 暴露实例方法
defineExpose<InputInstance>({
  $el: containerRef.value,
  inputRef: inputRef.value,
  focus,
  blur,
  select,
  clear,
});
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClass"
  >
    <!-- 包装层 -->
    <div class="chips-input__wrapper">
      <!-- 前缀插槽 -->
      <span
        v-if="hasPrefix"
        class="chips-input__prefix"
      >
        <slot name="prefix" />
      </span>

      <!-- 原生 input -->
      <input
        :id="id"
        ref="inputRef"
        class="chips-input__inner"
        :type="type"
        :value="value"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :aria-disabled="disabled"
        :aria-readonly="readonly"
        :aria-invalid="status === 'error'"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeyDown"
      />

      <!-- 后缀区域 -->
      <span
        v-if="hasSuffix || showClearButton || showCount"
        class="chips-input__suffix"
      >
        <!-- 清除按钮 -->
        <button
          v-if="showClearButton"
          type="button"
          class="chips-input__clear"
          :aria-label="t('input.clear')"
          tabindex="-1"
          @click="handleClear"
        >
          <slot name="clearIcon">
            <!-- 默认清除图标由主题包提供 -->
          </slot>
        </button>

        <!-- 后缀插槽 -->
        <slot name="suffix" />

        <!-- 字数统计 -->
        <span
          v-if="showCount"
          class="chips-input__count"
        >
          {{ countText }}
        </span>
      </span>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
