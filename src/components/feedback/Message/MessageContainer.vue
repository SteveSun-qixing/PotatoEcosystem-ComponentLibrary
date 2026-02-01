<script setup lang="ts">
/**
 * MessageContainer 消息容器组件
 *
 * 用于渲染消息列表的容器
 *
 * 样式接口点:
 * - .chips-message              - 消息容器
 */

import { computed, Teleport } from 'vue';
import Message from './Message.vue';
import type { MessageConfig } from './types';

// Props
const props = withDefaults(
  defineProps<{
    messages: MessageConfig[];
    top?: number | string;
    appendTo?: string | HTMLElement;
  }>(),
  {
    top: 24,
    appendTo: 'body',
  }
);

// Emits
const emit = defineEmits<{
  (e: 'close', id: string): void;
}>();

// 计算顶部距离样式
const containerStyle = computed(() => {
  const top = typeof props.top === 'number' ? `${props.top}px` : props.top;
  return { top };
});

// 处理消息关闭
const handleClose = (id: string) => {
  emit('close', id);
};
</script>

<template>
  <Teleport :to="appendTo">
    <div
      v-if="messages.length > 0"
      class="chips-message"
      :style="containerStyle"
    >
      <TransitionGroup name="chips-message">
        <Message
          v-for="msg in messages"
          :key="msg.id"
          :id="msg.id!"
          :type="msg.type"
          :content="msg.content"
          :closable="msg.closable"
          :icon="msg.icon"
          @close="handleClose"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<!-- 不包含任何样式 -->
