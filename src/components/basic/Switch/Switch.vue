<script setup lang="ts">
/**
 * Switch 开关组件
 *
 * 无样式开关组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-switch              - 开关容器
 * - .chips-switch--checked     - 选中状态
 * - .chips-switch--disabled    - 禁用状态
 * - .chips-switch--loading     - 加载状态
 * - .chips-switch--small       - 小尺寸
 * - .chips-switch--medium      - 中尺寸
 * - .chips-switch--large       - 大尺寸
 * - .chips-switch__rail        - 轨道
 * - .chips-switch__handle      - 滑块
 * - .chips-switch__inner       - 内容区域
 * - .chips-switch__loading     - 加载图标
 */

import { computed, ref, useSlots, getCurrentInstance } from 'vue';
import type { SwitchProps, SwitchEmits, SwitchInstance, SwitchValue } from './types';
import { classNames } from '@/utils';

// Props - 注意不要为 modelValue 设置默认值，以便检测是否传入
const props = withDefaults(defineProps<SwitchProps>(), {
  defaultChecked: false,
  disabled: false,
  loading: false,
  size: 'medium',
  checkedValue: true,
  uncheckedValue: false,
});

// Emits
const emit = defineEmits<SwitchEmits>();

// Slots
const slots = useSlots();

// Refs
const switchRef = ref<HTMLButtonElement | null>(null);

// 获取当前组件实例来检测 modelValue 是否被显式传入
const instance = getCurrentInstance();
const hasExplicitModelValue = computed(() => {
  // 检查 vnode 的 props 中是否显式传入了 modelValue 或 v-model
  const vnode = instance?.vnode;
  if (!vnode) return false;
  const vnodeProps = vnode.props || {};
  return 'modelValue' in vnodeProps || 'onUpdate:modelValue' in vnodeProps;
});

// 内部状态（用于非受控模式）
const internalChecked = ref(props.defaultChecked);

// 检测是否为受控模式
const isControlled = computed(() => hasExplicitModelValue.value);

// 实际选中状态
const isChecked = computed(() => {
  if (isControlled.value) {
    return props.modelValue === props.checkedValue;
  }
  return internalChecked.value ?? false;
});

// 是否禁用（包括加载状态）
const isDisabled = computed(() => props.disabled || props.loading);

// 是否有选中状态内容
const hasCheckedSlot = computed(() => !!slots.checked);

// 是否有未选中状态内容
const hasUncheckedSlot = computed(() => !!slots.unchecked);

// 是否显示内容区域
const hasInnerContent = computed(() => hasCheckedSlot.value || hasUncheckedSlot.value);

// 计算样式类名
const switchClass = computed(() =>
  classNames('chips-switch', `chips-switch--${props.size}`, {
    'chips-switch--checked': isChecked.value,
    'chips-switch--disabled': isDisabled.value,
    'chips-switch--loading': props.loading,
  })
);

// 获取当前值
const getCurrentValue = (): SwitchValue => {
  return isChecked.value ? props.checkedValue : props.uncheckedValue;
};

// 点击事件处理
const handleClick = () => {
  if (isDisabled.value) {
    return;
  }

  const newChecked = !isChecked.value;
  const newValue = newChecked ? props.checkedValue : props.uncheckedValue;

  // 更新内部状态（非受控模式）
  if (!isControlled.value) {
    internalChecked.value = newChecked;
  }

  emit('update:modelValue', newValue);
  emit('change', newValue);
};

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// 聚焦
const focus = () => {
  switchRef.value?.focus();
};

// 失焦
const blur = () => {
  switchRef.value?.blur();
};

// 暴露实例方法
defineExpose<SwitchInstance>({
  $el: switchRef.value,
  focus,
  blur,
});
</script>

<template>
  <button
    ref="switchRef"
    type="button"
    role="switch"
    :class="switchClass"
    :disabled="isDisabled"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 轨道 -->
    <span
      class="chips-switch__rail"
      aria-hidden="true"
    >
      <!-- 内容区域 -->
      <span
        v-if="hasInnerContent"
        class="chips-switch__inner"
      >
        <slot
          v-if="isChecked"
          name="checked"
        />
        <slot
          v-else
          name="unchecked"
        />
      </span>
    </span>

    <!-- 滑块 -->
    <span
      class="chips-switch__handle"
      aria-hidden="true"
    >
      <!-- 加载图标 -->
      <span
        v-if="loading"
        class="chips-switch__loading"
      >
        <slot name="loading">
          <!-- 默认加载图标由主题包提供 -->
        </slot>
      </span>
    </span>
  </button>
</template>

<!-- 不包含任何样式 -->
