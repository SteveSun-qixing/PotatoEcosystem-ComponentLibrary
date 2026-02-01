<script setup lang="ts">
/**
 * CheckboxGroup 复选框组组件
 *
 * 无样式复选框组组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-checkbox-group            - 复选框组容器
 * - .chips-checkbox-group--vertical  - 垂直排列
 * - .chips-checkbox-group--disabled  - 禁用状态
 */

import { computed, ref, provide, reactive, toRefs, watch } from 'vue';
import type { CheckboxGroupProps, CheckboxGroupEmits, CheckboxGroupContext } from './types';
import { CHECKBOX_GROUP_KEY } from './types';
import Checkbox from './Checkbox.vue';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: undefined,
  defaultValue: () => [],
  options: () => [],
  disabled: false,
  direction: 'horizontal',
  name: undefined,
});

// Emits
const emit = defineEmits<CheckboxGroupEmits>();

// 内部状态（非受控模式）
const internalValue = ref<(string | number)[]>([...props.defaultValue]);

// 注册的值集合
const registeredValues = ref<Set<string | number>>(new Set());

// 计算当前选中值
const currentValue = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue;
  }
  return internalValue.value;
});

// 计算样式类名
const groupClass = computed(() =>
  classNames('chips-checkbox-group', {
    'chips-checkbox-group--vertical': props.direction === 'vertical',
    'chips-checkbox-group--disabled': props.disabled,
  })
);

// 注册 Checkbox 值
const registerValue = (value: string | number) => {
  registeredValues.value.add(value);
};

// 注销 Checkbox 值
const unregisterValue = (value: string | number) => {
  registeredValues.value.delete(value);
};

// 切换选中状态
const toggleValue = (value: string | number, checked: boolean) => {
  const newValues = [...currentValue.value];
  const index = newValues.indexOf(value);

  if (checked && index === -1) {
    newValues.push(value);
  } else if (!checked && index !== -1) {
    newValues.splice(index, 1);
  }

  if (props.modelValue === undefined) {
    // 非受控模式
    internalValue.value = newValues;
  }

  emit('update:modelValue', newValues);
  emit('change', newValues);
};

// 提供上下文给子 Checkbox
const context = reactive<CheckboxGroupContext>({
  name: props.name,
  modelValue: currentValue.value,
  disabled: props.disabled,
  registerValue,
  unregisterValue,
  toggleValue,
});

// 监听 props 变化更新 context
watch(
  () => currentValue.value,
  (val) => {
    context.modelValue = val;
  }
);

watch(
  () => props.disabled,
  (val) => {
    context.disabled = val;
  }
);

watch(
  () => props.name,
  (val) => {
    context.name = val;
  }
);

provide(CHECKBOX_GROUP_KEY, context);
</script>

<template>
  <div
    :class="groupClass"
    role="group"
    :aria-disabled="disabled"
  >
    <!-- 使用 options 渲染 -->
    <template v-if="options && options.length > 0">
      <Checkbox
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        <template v-if="typeof option.label === 'string'">
          {{ option.label }}
        </template>
        <component
          :is="option.label"
          v-else
        />
      </Checkbox>
    </template>

    <!-- 使用插槽渲染 -->
    <slot v-else />
  </div>
</template>

<!-- 不包含任何样式 -->
