<script setup lang="ts">
/**
 * Textarea 多行文本框组件
 *
 * 样式接口点:
 * - .chips-textarea           - 容器
 * - .chips-textarea__inner    - 原生 textarea
 * - .chips-textarea__count    - 字数统计
 * - .chips-textarea--focused  - 聚焦状态
 * - .chips-textarea--disabled - 禁用状态
 * - .chips-textarea--readonly - 只读状态
 * - .chips-textarea--error    - 错误状态
 * - .chips-textarea--warning  - 警告状态
 */

import { computed, ref, watch, onMounted, nextTick } from 'vue';
import type { TextareaProps, TextareaEmits, TextareaInstance, TextareaAutoSize } from './types';
import { useControllableStateWithWatch } from '@/composables';
import { classNames } from '@/utils';

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  resize: 'vertical',
});

const emit = defineEmits<TextareaEmits>();

// Refs
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

// 受控/非受控状态
const [value, setValue] = useControllableStateWithWatch<string>(
  () => props.modelValue,
  props.defaultValue ?? '',
  (val) => emit('update:modelValue', val)
);

// 计算类名
const textareaClass = computed(() =>
  classNames('chips-textarea', {
    'chips-textarea--focused': isFocused.value,
    'chips-textarea--disabled': props.disabled,
    'chips-textarea--readonly': props.readonly,
    'chips-textarea--error': props.status === 'error',
    'chips-textarea--warning': props.status === 'warning',
  })
);

// 自动高度计算
const calcTextareaHeight = () => {
  if (!props.autoSize || !textareaRef.value) return;

  const textarea = textareaRef.value;
  const autoSize = props.autoSize as TextareaAutoSize;
  
  // 重置高度以获取正确的 scrollHeight
  textarea.style.height = 'auto';
  
  let height = textarea.scrollHeight;
  
  // 计算行高
  const computedStyle = window.getComputedStyle(textarea);
  const lineHeight = parseInt(computedStyle.lineHeight) || 20;
  const paddingTop = parseInt(computedStyle.paddingTop) || 0;
  const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
  const borderTop = parseInt(computedStyle.borderTopWidth) || 0;
  const borderBottom = parseInt(computedStyle.borderBottomWidth) || 0;
  
  const minHeight = autoSize.minRows
    ? autoSize.minRows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom
    : undefined;
  const maxHeight = autoSize.maxRows
    ? autoSize.maxRows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom
    : undefined;
  
  if (minHeight !== undefined && height < minHeight) {
    height = minHeight;
  }
  if (maxHeight !== undefined && height > maxHeight) {
    height = maxHeight;
  }
  
  textarea.style.height = `${height}px`;
};

// 监听值变化，更新高度
watch(value, () => {
  nextTick(calcTextareaHeight);
});

onMounted(() => {
  if (props.autoSize) {
    calcTextareaHeight();
  }
});

// 字数统计显示
const countText = computed(() => {
  const len = value.value?.length ?? 0;
  if (props.maxLength !== undefined) {
    return `${len} / ${props.maxLength}`;
  }
  return String(len);
});

// 事件处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  const newValue = target.value;
  setValue(newValue);
  emit('input', newValue);
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('change', target.value);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

// 暴露方法
const focus = () => textareaRef.value?.focus();
const blur = () => textareaRef.value?.blur();
const select = () => textareaRef.value?.select();

defineExpose<TextareaInstance>({
  $el: textareaRef.value,
  focus,
  blur,
  select,
});
</script>

<template>
  <div :class="textareaClass">
    <textarea
      ref="textareaRef"
      class="chips-textarea__inner"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :maxlength="maxLength"
      :style="{ resize: autoSize ? 'none' : resize }"
      :aria-disabled="disabled"
      :aria-readonly="readonly"
      :aria-invalid="status === 'error'"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span
      v-if="showCount"
      class="chips-textarea__count"
    >
      {{ countText }}
    </span>
  </div>
</template>
