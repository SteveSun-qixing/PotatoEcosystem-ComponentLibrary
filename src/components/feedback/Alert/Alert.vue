<script setup lang="ts">
/**
 * Alert 警告提示组件
 *
 * 无样式警告提示组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-alert                    - 警告容器
 * - .chips-alert--info              - 信息类型
 * - .chips-alert--success           - 成功类型
 * - .chips-alert--warning           - 警告类型
 * - .chips-alert--error             - 错误类型
 * - .chips-alert--with-description  - 含描述信息
 * - .chips-alert--banner            - 顶部公告样式
 * - .chips-alert--closable          - 可关闭状态
 * - .chips-alert__icon              - 图标区域
 * - .chips-alert__content           - 内容容器
 * - .chips-alert__message           - 消息/标题
 * - .chips-alert__description       - 描述信息
 * - .chips-alert__action            - 操作区域
 * - .chips-alert__close             - 关闭按钮
 */

import { computed, ref, useSlots } from 'vue';
import type { AlertProps, AlertEmits, AlertInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  closable: false,
  showIcon: false,
  banner: false,
});

// Emits
const emit = defineEmits<AlertEmits>();

// Slots
const slots = useSlots();

// Refs
const alertRef = ref<HTMLElement | null>(null);
const visible = ref(true);

// 是否有描述内容
const hasDescription = computed(() => !!props.description || !!slots.description);

// 是否有图标
const hasIcon = computed(() => props.showIcon || !!slots.icon);

// 是否有操作区域
const hasAction = computed(() => !!slots.action);

// 计算样式类名
const alertClass = computed(() =>
  classNames('chips-alert', `chips-alert--${props.type}`, {
    'chips-alert--with-description': hasDescription.value,
    'chips-alert--banner': props.banner,
    'chips-alert--closable': props.closable,
  })
);

// 处理关闭
const handleClose = (event: MouseEvent) => {
  visible.value = false;
  emit('close', event);
  emit('afterClose');
};

// 暴露实例方法
defineExpose<AlertInstance>({
  $el: alertRef.value,
});
</script>

<template>
  <div
    v-if="visible"
    ref="alertRef"
    :class="alertClass"
    role="alert"
  >
    <!-- 图标区域 -->
    <span
      v-if="hasIcon"
      class="chips-alert__icon"
    >
      <slot name="icon" />
    </span>

    <!-- 内容区域 -->
    <div class="chips-alert__content">
      <!-- 消息/标题 -->
      <div class="chips-alert__message">
        <slot name="message">
          <slot>{{ message }}</slot>
        </slot>
      </div>

      <!-- 描述信息 -->
      <div
        v-if="hasDescription"
        class="chips-alert__description"
      >
        <slot name="description">{{ description }}</slot>
      </div>
    </div>

    <!-- 操作区域 -->
    <div
      v-if="hasAction"
      class="chips-alert__action"
    >
      <slot name="action" />
    </div>

    <!-- 关闭按钮 -->
    <span
      v-if="closable"
      class="chips-alert__close"
      role="button"
      tabindex="0"
      aria-label="Close alert"
      @click="handleClose"
      @keydown.enter="handleClose"
      @keydown.space.prevent="handleClose"
    >
      <slot name="closeIcon" />
    </span>
  </div>
</template>

<!-- 不包含任何样式 -->
