<script setup lang="ts">
/**
 * Message 消息提示组件
 *
 * 无样式消息提示组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-message              - 消息容器
 * - .chips-message__notice      - 单条消息
 * - .chips-message__content     - 消息内容区域
 * - .chips-message__icon        - 消息图标
 * - .chips-message__text        - 消息文本
 * - .chips-message__close       - 关闭按钮
 * - .chips-message--info        - 信息类型
 * - .chips-message--success     - 成功类型
 * - .chips-message--warning     - 警告类型
 * - .chips-message--error       - 错误类型
 * - .chips-message--loading     - 加载类型
 */

import { computed } from 'vue';
import type { MessageProps, MessageEmits } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<MessageProps>(), {
  closable: false,
});

// Emits
const emit = defineEmits<MessageEmits>();

// 计算样式类名
const messageClass = computed(() =>
  classNames('chips-message__notice', `chips-message--${props.type}`)
);

// 处理关闭
const handleClose = () => {
  emit('close', props.id);
};
</script>

<template>
  <div
    :class="messageClass"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="chips-message__content">
      <!-- 图标区域 -->
      <span class="chips-message__icon">
        <slot name="icon">
          <!-- 图标由主题包提供 -->
        </slot>
      </span>

      <!-- 文本内容 -->
      <span class="chips-message__text">
        <component
          :is="content"
          v-if="typeof content !== 'string'"
        />
        <template v-else>
          {{ content }}
        </template>
      </span>

      <!-- 关闭按钮 -->
      <button
        v-if="closable"
        type="button"
        class="chips-message__close"
        aria-label="Close"
        @click="handleClose"
      >
        <slot name="closeIcon">
          <!-- 关闭图标由主题包提供 -->
        </slot>
      </button>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
