<script setup lang="ts">
/**
 * Radio 单选框组件
 *
 * 无样式单选框组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-radio              - 单选框容器
 * - .chips-radio--checked     - 选中状态
 * - .chips-radio--disabled    - 禁用状态
 * - .chips-radio--button      - 按钮样式
 * - .chips-radio--small       - 小尺寸
 * - .chips-radio--medium      - 中尺寸
 * - .chips-radio--large       - 大尺寸
 * - .chips-radio__input       - 原生 input 元素
 * - .chips-radio__inner       - 单选框视觉元素
 * - .chips-radio__label       - 标签文本
 */

import { computed, inject, useSlots } from 'vue';
import type { RadioProps, RadioEmits, RadioValue } from './types';
import { RADIO_GROUP_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
});

// Emits
const emit = defineEmits<RadioEmits>();

// Slots
const slots = useSlots();

// 注入 RadioGroup 上下文
const radioGroup = inject(RADIO_GROUP_INJECTION_KEY, null);

// 是否在 RadioGroup 中
const isInGroup = computed(() => radioGroup !== null);

// 实际是否禁用
const isDisabled = computed(() => props.disabled || radioGroup?.disabled || false);

// 实际选中状态
const isChecked = computed(() => {
  if (isInGroup.value && radioGroup) {
    return radioGroup.modelValue === props.value;
  }
  return props.modelValue === props.value;
});

// 选项类型（按钮样式或默认）
const optionType = computed(() => radioGroup?.optionType || 'default');

// 尺寸
const size = computed(() => radioGroup?.size || 'medium');

// name 属性
const radioName = computed(() => props.name || radioGroup?.name);

// 是否有标签内容
const hasLabel = computed(() => !!slots.default);

// 计算样式类名
const radioClass = computed(() =>
  classNames('chips-radio', {
    'chips-radio--checked': isChecked.value,
    'chips-radio--disabled': isDisabled.value,
    'chips-radio--button': optionType.value === 'button',
    [`chips-radio--${size.value}`]: true,
  })
);

// 处理变化事件
const handleChange = () => {
  if (isDisabled.value) {
    return;
  }

  const value = props.value;

  if (isInGroup.value && radioGroup) {
    radioGroup.onChange(value);
  } else {
    emit('update:modelValue', value);
    emit('change', value);
  }
};
</script>

<template>
  <label
    :class="radioClass"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <!-- 隐藏的原生 input -->
    <input
      type="radio"
      class="chips-radio__input"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      :name="radioName"
      @change="handleChange"
    />

    <!-- 单选框视觉元素 -->
    <span
      class="chips-radio__inner"
      aria-hidden="true"
    />

    <!-- 标签文本 -->
    <span
      v-if="hasLabel"
      class="chips-radio__label"
    >
      <slot />
    </span>
  </label>
</template>

<!-- 不包含任何样式 -->
