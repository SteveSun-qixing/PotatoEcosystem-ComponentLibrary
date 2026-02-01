<script setup lang="ts">
/**
 * Image 图片组件
 *
 * 无样式图片组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-image              - 图片容器
 * - .chips-image--loading     - 加载中状态
 * - .chips-image--loaded      - 加载完成状态
 * - .chips-image--error       - 加载失败状态
 * - .chips-image--fit-contain - contain 适应模式
 * - .chips-image--fit-cover   - cover 适应模式
 * - .chips-image--fit-fill    - fill 适应模式
 * - .chips-image--fit-none    - none 适应模式
 * - .chips-image--fit-scale-down - scale-down 适应模式
 * - .chips-image--preview     - 可预览状态
 * - .chips-image__img         - 图片元素
 * - .chips-image__placeholder - 加载中占位
 * - .chips-image__error       - 加载失败占位
 * - .chips-image__preview     - 预览遮罩
 * - .chips-image__preview-mask - 预览蒙版
 */

import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import type { ImageProps, ImageEmits, ImageInstance, ImageStatus } from './types';
import { classNames, isNumber } from '@/utils';

// Props
const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  fit: 'fill',
  lazy: false,
  preview: false,
});

// Emits
const emit = defineEmits<ImageEmits>();

// Refs
const containerRef = ref<HTMLElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);

// 状态
const status = ref<ImageStatus>('loading');
const isPreviewVisible = ref(false);
const shouldLoad = ref(!props.lazy);

// 实际使用的 src
const currentSrc = computed(() => {
  if (!shouldLoad.value) return '';
  return props.src;
});

// 计算样式类名
const imageClass = computed(() =>
  classNames(
    'chips-image',
    `chips-image--${status.value}`,
    `chips-image--fit-${props.fit}`,
    {
      'chips-image--preview': props.preview,
    }
  )
);

// 计算容器样式
const containerStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.width !== undefined) {
    style.width = isNumber(props.width) ? `${props.width}px` : props.width;
  }

  if (props.height !== undefined) {
    style.height = isNumber(props.height) ? `${props.height}px` : props.height;
  }

  return style;
});

// 用于 fallback 的备用 src
const fallbackSrc = ref<string>('');

// 最终渲染的 src
const renderSrc = computed(() => fallbackSrc.value || currentSrc.value);

// IntersectionObserver 用于懒加载
let observer: IntersectionObserver | null = null;

// 加载图片
const loadImage = () => {
  if (!props.src) {
    status.value = 'error';
    return;
  }

  status.value = 'loading';
  shouldLoad.value = true;
};

// 图片加载成功
const handleLoad = (event: Event) => {
  status.value = 'loaded';
  emit('load', event);
};

// 图片加载失败
const handleError = (event: Event) => {
  // 尝试使用 fallback
  if (props.fallback && !fallbackSrc.value) {
    fallbackSrc.value = props.fallback;
    status.value = 'loading';
    return;
  }

  status.value = 'error';
  emit('error', event);
};

// 打开预览
const openPreview = () => {
  if (!props.preview || status.value !== 'loaded') return;
  isPreviewVisible.value = true;
  emit('preview', true);
};

// 关闭预览
const closePreview = () => {
  isPreviewVisible.value = false;
  emit('preview', false);
};

// 处理点击
const handleClick = () => {
  if (props.preview && status.value === 'loaded') {
    openPreview();
  }
};

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// 预览区域键盘事件
const handlePreviewKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePreview();
  }
};

// 设置懒加载
const setupLazyLoad = () => {
  if (!props.lazy) {
    loadImage();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage();
          observer?.disconnect();
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
};

// 监听 src 变化
watch(
  () => props.src,
  () => {
    fallbackSrc.value = '';
    if (!props.lazy || shouldLoad.value) {
      loadImage();
    }
  }
);

onMounted(() => {
  setupLazyLoad();
});

onUnmounted(() => {
  observer?.disconnect();
});

// 暴露实例方法
defineExpose<ImageInstance>({
  $el: containerRef.value,
  imgEl: imgRef.value,
  status: status.value,
  openPreview,
  closePreview,
});
</script>

<template>
  <div
    ref="containerRef"
    :class="imageClass"
    :style="containerStyle"
    :role="preview ? 'button' : undefined"
    :tabindex="preview ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 图片元素 -->
    <img
      v-if="renderSrc && status !== 'error'"
      ref="imgRef"
      :src="renderSrc"
      :alt="alt"
      class="chips-image__img"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 加载中占位 -->
    <div
      v-if="status === 'loading'"
      class="chips-image__placeholder"
      aria-label="Loading"
    >
      <slot name="placeholder" />
    </div>

    <!-- 加载失败占位 -->
    <div
      v-if="status === 'error'"
      class="chips-image__error"
      role="img"
      :aria-label="alt || 'Image failed to load'"
    >
      <slot name="error" />
    </div>

    <!-- 预览蒙版 -->
    <div
      v-if="preview && status === 'loaded'"
      class="chips-image__preview-mask"
      aria-hidden="true"
    />

    <!-- 预览弹窗 -->
    <Teleport to="body">
      <div
        v-if="isPreviewVisible"
        class="chips-image__preview"
        role="dialog"
        aria-modal="true"
        :aria-label="`Preview: ${alt}`"
        @click.self="closePreview"
        @keydown="handlePreviewKeydown"
      >
        <img
          :src="currentSrc"
          :alt="alt"
          class="chips-image__preview-img"
        />

        <!-- 预览操作区域 -->
        <div class="chips-image__preview-actions">
          <slot name="previewActions">
            <button
              class="chips-image__preview-close"
              type="button"
              aria-label="Close preview"
              @click="closePreview"
            />
          </slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<!-- 不包含任何样式 -->
