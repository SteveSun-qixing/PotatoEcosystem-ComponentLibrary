<script setup lang="ts">
/**
 * RadioGroup 单选框组组件
 *
 * 无样式单选框组组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-radio-group            - 单选框组容器
 * - .chips-radio-group--vertical  - 垂直排列
 * - .chips-radio-group--button    - 按钮样式模式
 * - .chips-radio-group--small     - 小尺寸
 * - .chips-radio-group--medium    - 中尺寸
 * - .chips-radio-group--large     - 大尺寸
 * - .chips-radio-group--disabled  - 禁用状态
 */

import { computed, provide, toRef, useSlots } from 'vue';
import type {
  RadioGroupProps,
  RadioGroupEmits,
  RadioGroupContext,
  RadioValue,
} from './types';
import { RADIO_GROUP_INJECTION_KEY } from './types';
import { classNames, generateId } from '@/utils';
import Radio from './Radio.vue';

// Props
const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  direction: 'horizontal',
  optionType: 'default',
  size: 'medium',
});

// Emits
const emit = defineEmits<RadioGroupEmits>();

// Slots
const slots = useSlots();

// 生成默认 name
const defaultName = `chips-radio-group-${generateId()}`;

// 处理选择变化
const handleChange = (value: RadioValue) => {
  emit('update:modelValue', value);
  emit('change', value);
};

// 提供上下文给子组件
const context: RadioGroupContext = {
  get modelValue() {
    return props.modelValue;
  },
  get disabled() {
    return props.disabled;
  },
  get optionType() {
    return props.optionType;
  },
  get size() {
    return props.size;
  },
  get name() {
    return props.name || defaultName;
  },
  onChange: handleChange,
};

provide(RADIO_GROUP_INJECTION_KEY, context);

// 是否有选项
const hasOptions = computed(() => props.options && props.options.length > 0);

// 是否有默认插槽内容
const hasSlotContent = computed(() => !!slots.default);

// 计算样式类名
const groupClass = computed(() =>
  classNames('chips-radio-group', {
    'chips-radio-group--vertical': props.direction === 'vertical',
    'chips-radio-group--button': props.optionType === 'button',
    'chips-radio-group--disabled': props.disabled,
    [`chips-radio-group--${props.size}`]: true,
  })
);
</script>

<template>
  <div
    :class="groupClass"
    role="radiogroup"
    :aria-disabled="disabled"
  >
    <!-- 使用 options 渲染 -->
    <template v-if="hasOptions">
      <Radio
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </Radio>
    </template>

    <!-- 使用插槽渲染 -->
    <slot v-else-if="hasSlotContent" />
  </div>
</template>

<!-- 不包含任何样式 -->
