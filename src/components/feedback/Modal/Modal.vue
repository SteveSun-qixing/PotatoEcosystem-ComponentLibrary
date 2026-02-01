<script setup lang="ts">
/**
 * Modal 对话框组件
 *
 * 无样式对话框组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-modal              - 对话框容器
 * - .chips-modal-root         - 根元素（Teleport 目标）
 * - .chips-modal-mask         - 遮罩层
 * - .chips-modal__content     - 内容容器
 * - .chips-modal__header      - 头部区域
 * - .chips-modal__title       - 标题
 * - .chips-modal__close       - 关闭按钮
 * - .chips-modal__body        - 主体区域
 * - .chips-modal__footer      - 底部区域
 * - .chips-modal--centered    - 垂直居中
 * - .chips-modal--visible     - 显示状态
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
import type { ModalProps, ModalEmits, ModalInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  closable: true,
  maskClosable: true,
  keyboard: true,
  centered: false,
  destroyOnClose: false,
  confirmLoading: false,
  okText: undefined,
  cancelText: undefined,
  footer: undefined,
  zIndex: undefined,
  appendTo: 'body',
  mask: true,
});

// Emits
const emit = defineEmits<ModalEmits>();

// 内部可见状态（用于动画控制）
const visible = ref(props.modelValue);
const rendered = ref(props.modelValue);

// 缓存原始 body 样式
let originalOverflow = '';
let originalPaddingRight = '';

// 计算宽度样式
const widthStyle = computed(() => {
  if (props.width === undefined) return undefined;
  return typeof props.width === 'number' ? `${props.width}px` : props.width;
});

// 计算 Modal 容器类名
const modalClass = computed(() =>
  classNames(
    'chips-modal',
    {
      'chips-modal--centered': props.centered,
      'chips-modal--visible': visible.value,
    },
    props.class
  )
);

// 计算内联样式（只有动态计算的布局值）
const contentStyle = computed(() => {
  const style: Record<string, string | number | undefined> = {};
  
  if (widthStyle.value) {
    style.width = widthStyle.value;
  }
  
  if (props.zIndex !== undefined) {
    style.zIndex = props.zIndex;
  }
  
  return style;
});

// 计算遮罩层样式
const maskStyle = computed(() => {
  if (props.zIndex !== undefined) {
    return { zIndex: props.zIndex };
  }
  return undefined;
});

// 是否显示默认底部
const hasFooter = computed(() => {
  return props.footer !== null;
});

// 阻止背景滚动
const lockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  
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
  if (typeof document === 'undefined') return;
  
  document.body.style.overflow = originalOverflow;
  document.body.style.paddingRight = originalPaddingRight;
};

// 打开对话框
const open = () => {
  emit('update:modelValue', true);
};

// 关闭对话框
const close = () => {
  emit('update:modelValue', false);
};

// 处理确定按钮点击
const handleOk = () => {
  emit('ok');
};

// 处理取消按钮点击
const handleCancel = () => {
  emit('cancel');
  close();
};

// 处理关闭按钮点击
const handleClose = () => {
  handleCancel();
};

// 处理遮罩点击
const handleMaskClick = () => {
  if (props.maskClosable) {
    handleCancel();
  }
};

// 处理内容区点击（阻止冒泡）
const handleContentClick = (event: MouseEvent) => {
  event.stopPropagation();
};

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.keyboard && visible.value) {
    handleCancel();
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
defineExpose<ModalInstance>({
  open,
  close,
});
</script>

<template>
  <Teleport :to="appendTo">
    <div
      v-if="rendered"
      class="chips-modal-root"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'chips-modal-title' : undefined"
    >
      <!-- 遮罩层 -->
      <div
        v-if="mask"
        class="chips-modal-mask"
        :class="{ 'chips-modal-mask--visible': visible }"
        :style="maskStyle"
        @click="handleMaskClick"
      />

      <!-- 对话框容器 -->
      <div
        :class="modalClass"
        @click="handleMaskClick"
      >
        <!-- 对话框内容 -->
        <div
          class="chips-modal__content"
          :style="contentStyle"
          @click="handleContentClick"
        >
          <!-- 头部 -->
          <div
            v-if="title || closable || $slots.title"
            class="chips-modal__header"
          >
            <div
              id="chips-modal-title"
              class="chips-modal__title"
            >
              <slot name="title">
                {{ title }}
              </slot>
            </div>

            <button
              v-if="closable"
              type="button"
              class="chips-modal__close"
              aria-label="Close"
              @click="handleClose"
            >
              <slot name="closeIcon">
                <!-- 关闭图标由主题包提供 -->
              </slot>
            </button>
          </div>

          <!-- 主体 -->
          <div class="chips-modal__body">
            <slot />
          </div>

          <!-- 底部 -->
          <div
            v-if="hasFooter"
            class="chips-modal__footer"
          >
            <slot name="footer">
              <button
                type="button"
                class="chips-modal__cancel-btn"
                @click="handleCancel"
              >
                {{ cancelText || 'Cancel' }}
              </button>
              <button
                type="button"
                class="chips-modal__ok-btn"
                :disabled="confirmLoading"
                :aria-busy="confirmLoading"
                @click="handleOk"
              >
                <span
                  v-if="confirmLoading"
                  class="chips-modal__loading-spinner"
                />
                {{ okText || 'OK' }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<!-- 不包含任何样式 -->
