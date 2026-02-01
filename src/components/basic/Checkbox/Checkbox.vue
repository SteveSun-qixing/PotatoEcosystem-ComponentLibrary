<script setup lang="ts">
/**
 * Checkbox 复选框组件
 *
 * 无样式复选框组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-checkbox              - 复选框容器
 * - .chips-checkbox--checked     - 选中状态
 * - .chips-checkbox--disabled    - 禁用状态
 * - .chips-checkbox--indeterminate - 半选状态
 * - .chips-checkbox__input       - 隐藏的原生 input
 * - .chips-checkbox__inner       - 复选框样式元素
 * - .chips-checkbox__icon        - 勾选图标
 * - .chips-checkbox__label       - 标签内容
 */

import { computed, ref, inject, onMounted, onUnmounted, useSlots, watch } from 'vue';
import type { CheckboxProps, CheckboxEmits, CheckboxInstance } from './types';
import { CHECKBOX_GROUP_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: undefined,
  defaultChecked: false,
  disabled: false,
  indeterminate: false,
  value: undefined,
  name: undefined,
});

// Emits
const emit = defineEmits<CheckboxEmits>();

// Slots
const slots = useSlots();

// 注入 CheckboxGroup 上下文
const checkboxGroup = inject(CHECKBOX_GROUP_KEY, null);

// Refs
const labelRef = ref<HTMLLabelElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// 内部状态（非受控模式）
const internalChecked = ref(props.defaultChecked);

// 判断是否处于 group 中
const isInGroup = computed(() => checkboxGroup !== null && props.value !== undefined);

// 计算是否选中
const isChecked = computed(() => {
  if (isInGroup.value && props.value !== undefined) {
    return checkboxGroup!.modelValue.includes(props.value);
  }
  // 受控模式
  if (props.modelValue !== undefined) {
    return props.modelValue;
  }
  // 非受控模式
  return internalChecked.value;
});

// 计算是否禁用
const isDisabled = computed(() => {
  if (checkboxGroup?.disabled) {
    return true;
  }
  return props.disabled;
});

// 计算样式类名
const checkboxClass = computed(() =>
  classNames('chips-checkbox', {
    'chips-checkbox--checked': isChecked.value,
    'chips-checkbox--disabled': isDisabled.value,
    'chips-checkbox--indeterminate': props.indeterminate,
  })
);

// 计算 name 属性
const inputName = computed(() => {
  if (checkboxGroup?.name) {
    return checkboxGroup.name;
  }
  return props.name;
});

// 是否有标签内容
const hasLabel = computed(() => !!slots.default);

// 处理变化事件
const handleChange = (event: Event) => {
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }

  const target = event.target as HTMLInputElement;
  const checked = target.checked;

  if (isInGroup.value && props.value !== undefined) {
    // 在 group 中，通知 group 更新
    checkboxGroup!.toggleValue(props.value, checked);
  } else {
    // 独立使用
    if (props.modelValue === undefined) {
      // 非受控模式
      internalChecked.value = checked;
    }
    emit('update:modelValue', checked);
    emit('change', checked, event);
  }
};

// 监听 indeterminate 变化，同步到 input 元素
watch(
  () => props.indeterminate,
  (val) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = val;
    }
  }
);

// 挂载时设置 indeterminate
onMounted(() => {
  if (inputRef.value && props.indeterminate) {
    inputRef.value.indeterminate = props.indeterminate;
  }

  // 注册到 group
  if (isInGroup.value && props.value !== undefined) {
    checkboxGroup!.registerValue(props.value);
  }
});

// 卸载时从 group 注销
onUnmounted(() => {
  if (isInGroup.value && props.value !== undefined) {
    checkboxGroup!.unregisterValue(props.value);
  }
});

// 聚焦
const focus = () => {
  inputRef.value?.focus();
};

// 失焦
const blur = () => {
  inputRef.value?.blur();
};

// 获取选中状态
const getIsChecked = () => isChecked.value;

// 暴露实例方法
defineExpose<CheckboxInstance>({
  $el: labelRef.value,
  focus,
  blur,
  isChecked: getIsChecked,
});
</script>

<template>
  <label
    ref="labelRef"
    :class="checkboxClass"
    :aria-disabled="isDisabled"
  >
    <!-- 隐藏的原生 input -->
    <input
      ref="inputRef"
      type="checkbox"
      class="chips-checkbox__input"
      :checked="isChecked"
      :disabled="isDisabled"
      :name="inputName"
      :value="value"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      @change="handleChange"
    >

    <!-- 复选框样式元素 -->
    <span class="chips-checkbox__inner">
      <!-- 勾选图标 -->
      <span
        v-if="isChecked || indeterminate"
        class="chips-checkbox__icon"
        aria-hidden="true"
      />
    </span>

    <!-- 标签内容 -->
    <span
      v-if="hasLabel"
      class="chips-checkbox__label"
    >
      <slot />
    </span>
  </label>
</template>

<!-- 不包含任何样式 -->
