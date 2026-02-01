<script setup lang="ts">
/**
 * Drawer 抽屉组件
 *
 * 无样式抽屉组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-drawer              - 抽屉根容器
 * - .chips-drawer__mask        - 遮罩层
 * - .chips-drawer__wrapper     - 抽屉包装器
 * - .chips-drawer__content     - 内容容器
 * - .chips-drawer__header      - 头部区域
 * - .chips-drawer__title       - 标题
 * - .chips-drawer__close       - 关闭按钮
 * - .chips-drawer__body        - 主体区域
 * - .chips-drawer__footer      - 底部区域
 * - .chips-drawer__extra       - 额外内容区域
 * - .chips-drawer--open        - 打开状态
 * - .chips-drawer--left        - 左侧抽屉
 * - .chips-drawer--right       - 右侧抽屉
 * - .chips-drawer--top         - 顶部抽屉
 * - .chips-drawer--bottom      - 底部抽屉
 */

import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  Teleport,
} from 'vue';
import type { DrawerProps, DrawerEmits, DrawerInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  placement: 'right',
  closable: true,
  maskClosable: true,
  keyboard: true,
  destroyOnClose: false,
  zIndex: undefined,
  appendTo: 'body',
  mask: true,
  lockScroll: true,
});

// Emits
const emit = defineEmits<DrawerEmits>();

// 内部可见状态（用于动画控制）
const visible = ref(props.modelValue);
const rendered = ref(props.modelValue);

// 缓存原始 body 样式
let originalOverflow = '';
let originalPaddingRight = '';

// 计算宽度样式（left/right 方向）
const sizeStyle = computed(() => {
  const style: Record<string, string | undefined> = {};
  
  if (props.placement === 'left' || props.placement === 'right') {
    if (props.width !== undefined) {
      style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    }
  } else {
    if (props.height !== undefined) {
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    }
  }
  
  if (props.zIndex !== undefined) {
    style.zIndex = String(props.zIndex);
  }
  
  return style;
});

// 计算 Drawer 容器类名
const drawerClass = computed(() =>
  classNames(
    'chips-drawer',
    `chips-drawer--${props.placement}`,
    {
      'chips-drawer--open': visible.value,
    },
    props.class
  )
);

// 计算遮罩层样式
const maskStyle = computed(() => {
  if (props.zIndex !== undefined) {
    return { zIndex: props.zIndex };
  }
  return undefined;
});

// 阻止背景滚动
const lockBodyScroll = () => {
  if (typeof document === 'undefined' || !props.lockScroll) return;
  
  // 获取滚动条宽度
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  // 保存原始样式
  originalOverflow = document.body.style.overflow;
  originalPaddingRight = document.body.style.paddingRight;
  
  // 设置样式阻止滚动
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
};

// 恢复背景滚动
const unlockBodyScroll = () => {
  if (typeof document === 'undefined' || !props.lockScroll) return;
  
  document.body.style.overflow = originalOverflow;
  document.body.style.paddingRight = originalPaddingRight;
};

// 打开抽屉
const open = () => {
  emit('update:modelValue', true);
};

// 关闭抽屉
const close = () => {
  emit('update:modelValue', false);
};

// 处理关闭按钮点击
const handleClose = () => {
  emit('close');
  close();
};

// 处理遮罩点击
const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose();
  }
};

// 处理内容区点击（阻止冒泡）
const handleContentClick = (event: MouseEvent) => {
  event.stopPropagation();
};

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.keyboard && visible.value) {
    handleClose();
  }
};

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      rendered.value = true;
      nextTick(() => {
        visible.value = true;
        lockBodyScroll();
        emit('afterOpen');
      });
    } else {
      visible.value = false;
      nextTick(() => {
        unlockBodyScroll();
        emit('afterClose');
        if (props.destroyOnClose) {
          rendered.value = false;
        }
      });
    }
  },
  { immediate: true }
);

// 生命周期
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown);
    unlockBodyScroll();
  }
});

// 暴露实例方法
defineExpose<DrawerInstance>({
  open,
  close,
});
</script>

<template>
  <Teleport :to="appendTo">
    <div
      v-if="rendered"
      :class="drawerClass"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'chips-drawer-title' : undefined"
    >
      <!-- 遮罩层 -->
      <div
        v-if="mask"
        class="chips-drawer__mask"
        :class="{ 'chips-drawer__mask--visible': visible }"
        :style="maskStyle"
        @click="handleMaskClick"
      />

      <!-- 抽屉包装器 -->
      <div
        class="chips-drawer__wrapper"
        :style="sizeStyle"
        @click="handleContentClick"
      >
        <!-- 抽屉内容 -->
        <div class="chips-drawer__content">
          <!-- 头部 -->
          <div
            v-if="title || closable || $slots.title || $slots.extra"
            class="chips-drawer__header"
          >
            <div
              id="chips-drawer-title"
              class="chips-drawer__title"
            >
              <slot name="title">
                {{ title }}
              </slot>
            </div>

            <div
              v-if="$slots.extra"
              class="chips-drawer__extra"
            >
              <slot name="extra" />
            </div>

            <button
              v-if="closable"
              type="button"
              class="chips-drawer__close"
              aria-label="Close"
              @click="handleClose"
            >
              <slot name="closeIcon">
                <!-- 关闭图标由主题包提供 -->
              </slot>
            </button>
          </div>

          <!-- 主体 -->
          <div class="chips-drawer__body">
            <slot />
          </div>

          <!-- 底部 -->
          <div
            v-if="$slots.footer"
            class="chips-drawer__footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<!-- 不包含任何样式 -->
