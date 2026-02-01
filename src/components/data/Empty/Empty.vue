<script setup lang="ts">
/**
 * Empty 空状态组件
 *
 * 无样式空状态组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-empty               - 空状态容器
 * - .chips-empty__image        - 图片区域
 * - .chips-empty__description  - 描述文本
 * - .chips-empty__footer       - 底部内容（操作区域）
 */

import { computed, ref, useSlots, isVNode } from 'vue';
import type { EmptyProps, EmptyEmits, EmptyInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = defineProps<EmptyProps>();

// Emits
const emit = defineEmits<EmptyEmits>();

// Slots
const slots = useSlots();

// Refs
const emptyRef = ref<HTMLElement | null>(null);

// 是否有图片插槽或属性
const hasImage = computed(() => !!slots.image || !!props.image);

// 是否有描述插槽或属性
const hasDescription = computed(() => !!slots.description || props.description !== undefined);

// 是否有底部内容
const hasFooter = computed(() => !!slots.default);

// 图片是否为字符串（URL）
const isImageUrl = computed(() => typeof props.image === 'string');

// 图片是否为 VNode
const isImageVNode = computed(() => props.image && isVNode(props.image));

// 描述是否为字符串
const isDescriptionString = computed(() => typeof props.description === 'string');

// 描述是否为 VNode
const isDescriptionVNode = computed(() => props.description && isVNode(props.description));

// 计算样式类名
const emptyClass = computed(() => classNames('chips-empty'));

// 处理点击
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

// 暴露实例方法
defineExpose<EmptyInstance>({
  $el: emptyRef.value,
});
</script>

<template>
  <div
    ref="emptyRef"
    :class="emptyClass"
    @click="handleClick"
  >
    <!-- 图片区域 -->
    <div
      v-if="hasImage"
      class="chips-empty__image"
      :style="imageStyle"
    >
      <slot name="image">
        <img
          v-if="isImageUrl"
          :src="image as string"
          alt="empty"
        >
        <component
          :is="image"
          v-else-if="isImageVNode"
        />
      </slot>
    </div>

    <!-- 描述文本 -->
    <div
      v-if="hasDescription"
      class="chips-empty__description"
    >
      <slot name="description">
        <template v-if="isDescriptionString">{{ description }}</template>
        <component
          :is="description"
          v-else-if="isDescriptionVNode"
        />
      </slot>
    </div>

    <!-- 底部内容/操作区域 -->
    <div
      v-if="hasFooter"
      class="chips-empty__footer"
    >
      <slot />
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
