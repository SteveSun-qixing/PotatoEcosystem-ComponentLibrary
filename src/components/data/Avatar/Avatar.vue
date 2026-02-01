<script setup lang="ts">
/**
 * Avatar 头像组件
 *
 * 无样式头像组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-avatar               - 头像容器
 * - .chips-avatar--circle       - 圆形头像
 * - .chips-avatar--square       - 方形头像
 * - .chips-avatar--small        - 小尺寸
 * - .chips-avatar--default      - 默认尺寸
 * - .chips-avatar--large        - 大尺寸
 * - .chips-avatar--image        - 图片模式
 * - .chips-avatar--icon         - 图标模式
 * - .chips-avatar--string       - 文字模式
 * - .chips-avatar__image        - 图片元素
 * - .chips-avatar__string       - 文字内容
 * - .chips-avatar__icon         - 图标内容
 *
 * CSS 变量:
 * - --chips-avatar-size         - 自定义尺寸
 * - --chips-avatar-gap          - 文字边距
 */

import { computed, ref, useSlots, onMounted, nextTick, watch } from 'vue';
import type { AvatarProps, AvatarEmits, AvatarInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'default',
  shape: 'circle',
  gap: 4,
});

// Emits
const emit = defineEmits<AvatarEmits>();

// Slots
const slots = useSlots();

// Refs
const avatarRef = ref<HTMLElement | null>(null);
const stringRef = ref<HTMLElement | null>(null);
const isImageError = ref(false);
const scale = ref(1);

// 是否为数字尺寸
const isNumericSize = computed(() => typeof props.size === 'number');

// 是否有图片
const hasImage = computed(() => !!props.src && !isImageError.value);

// 是否有图标
const hasIcon = computed(() => !!props.icon || !!slots.icon);

// 是否有文字
const hasString = computed(() => !!slots.default);

// 显示模式
const displayMode = computed(() => {
  if (hasImage.value) return 'image';
  if (hasIcon.value) return 'icon';
  return 'string';
});

// 计算文字缩放
const calcStringScale = async () => {
  if (!hasString.value || hasImage.value || hasIcon.value) {
    scale.value = 1;
    return;
  }

  await nextTick();

  if (!avatarRef.value || !stringRef.value) return;

  const avatarWidth = avatarRef.value.offsetWidth;
  const stringWidth = stringRef.value.offsetWidth;
  const gap = props.gap * 2;

  if (avatarWidth - gap < stringWidth) {
    scale.value = (avatarWidth - gap) / stringWidth;
  } else {
    scale.value = 1;
  }
};

// 监听相关属性变化
watch(() => [props.src, props.gap], () => {
  isImageError.value = false;
  calcStringScale();
});

onMounted(() => {
  calcStringScale();
});

// 计算尺寸类名
const sizeClass = computed(() => {
  if (isNumericSize.value) return '';
  return `chips-avatar--${props.size}`;
});

// 计算样式类名
const avatarClass = computed(() =>
  classNames('chips-avatar', `chips-avatar--${props.shape}`, sizeClass.value, {
    'chips-avatar--image': displayMode.value === 'image',
    'chips-avatar--icon': displayMode.value === 'icon',
    'chips-avatar--string': displayMode.value === 'string',
  })
);

// 计算样式
const avatarStyle = computed(() => {
  const style: Record<string, string> = {};

  if (isNumericSize.value) {
    style['--chips-avatar-size'] = `${props.size}px`;
  }

  if (props.gap !== 4) {
    style['--chips-avatar-gap'] = `${props.gap}px`;
  }

  return style;
});

// 文字样式
const stringStyle = computed(() => {
  if (scale.value === 1) return {};
  return {
    transform: `scale(${scale.value}) translateX(-50%)`,
  };
});

// 处理图片加载错误
const handleError = (event: Event) => {
  isImageError.value = true;
  emit('error', event);
  calcStringScale();
};

// 处理点击
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

// 暴露实例方法
defineExpose<AvatarInstance>({
  $el: avatarRef.value,
});
</script>

<template>
  <span
    ref="avatarRef"
    :class="avatarClass"
    :style="avatarStyle"
    @click="handleClick"
  >
    <!-- 图片模式 -->
    <img
      v-if="hasImage"
      :src="src"
      :alt="alt"
      class="chips-avatar__image"
      @error="handleError"
    >

    <!-- 图标模式 -->
    <span
      v-else-if="hasIcon"
      class="chips-avatar__icon"
    >
      <slot name="icon">
        <component
          :is="icon"
          v-if="icon"
        />
      </slot>
    </span>

    <!-- 文字模式 -->
    <span
      v-else
      ref="stringRef"
      class="chips-avatar__string"
      :style="stringStyle"
    >
      <slot />
    </span>
  </span>
</template>

<!-- 不包含任何样式 -->
