<script setup lang="ts">
/**
 * Tooltip 文字提示组件
 *
 * 无样式提示组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-tooltip                 - 容器
 * - .chips-tooltip__trigger        - 触发元素包装器
 * - .chips-tooltip__content        - 提示内容
 * - .chips-tooltip__arrow          - 箭头
 * - .chips-tooltip--top            - 上方位置
 * - .chips-tooltip--topLeft        - 上左位置
 * - .chips-tooltip--topRight       - 上右位置
 * - .chips-tooltip--bottom         - 下方位置
 * - .chips-tooltip--bottomLeft     - 下左位置
 * - .chips-tooltip--bottomRight    - 下右位置
 * - .chips-tooltip--left           - 左方位置
 * - .chips-tooltip--leftTop        - 左上位置
 * - .chips-tooltip--leftBottom     - 左下位置
 * - .chips-tooltip--right          - 右方位置
 * - .chips-tooltip--rightTop       - 右上位置
 * - .chips-tooltip--rightBottom    - 右下位置
 * - .chips-tooltip--visible        - 可见状态
 * - .chips-tooltip--hidden         - 隐藏状态
 */

import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  Teleport,
  nextTick,
  getCurrentInstance,
} from 'vue';
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types';
import { classNames } from '@/utils';

// Props - 注意 visible 不设置默认值，保持 undefined 以支持受控模式检测
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  trigger: 'hover',
  defaultVisible: false,
  disabled: false,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyOnHide: false,
});

// Emits
const emit = defineEmits<TooltipEmits>();

// 获取组件实例用于检测 visible 是否被显式传递
const instance = getCurrentInstance();

// Refs
const tooltipRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

// 内部显示状态（非受控模式）
const internalVisible = ref(props.defaultVisible);

// 延迟计时器
let enterTimer: ReturnType<typeof setTimeout> | null = null;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

// 是否为受控模式 - 检查 visible 是否在 vnode.props 中被显式传递
const isControlled = computed(() => {
  const vnodeProps = instance?.vnode?.props;
  return vnodeProps ? 'visible' in vnodeProps : false;
});

// 实际显示状态
const actualVisible = computed(() => {
  if (props.disabled) return false;
  return isControlled.value ? props.visible : internalVisible.value;
});

// 更新显示状态
const updateVisible = (visible: boolean) => {
  if (props.disabled) return;

  if (!isControlled.value) {
    internalVisible.value = visible;
  }
  emit('update:visible', visible);
  emit('visibleChange', visible);
};

// 清除计时器
const clearTimers = () => {
  if (enterTimer) {
    clearTimeout(enterTimer);
    enterTimer = null;
  }
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
};

// 显示提示
const show = () => {
  clearTimers();

  if (props.mouseEnterDelay > 0) {
    enterTimer = setTimeout(() => {
      updateVisible(true);
    }, props.mouseEnterDelay);
  } else {
    updateVisible(true);
  }
};

// 隐藏提示
const hide = () => {
  clearTimers();

  if (props.mouseLeaveDelay > 0) {
    leaveTimer = setTimeout(() => {
      updateVisible(false);
    }, props.mouseLeaveDelay);
  } else {
    updateVisible(false);
  }
};

// 切换显示状态
const toggle = () => {
  if (actualVisible.value) {
    hide();
  } else {
    show();
  }
};

// 事件处理
const handleMouseEnter = () => {
  if (props.trigger === 'hover') {
    show();
  }
};

const handleMouseLeave = () => {
  if (props.trigger === 'hover') {
    hide();
  }
};

const handleClick = () => {
  if (props.trigger === 'click') {
    toggle();
  }
};

const handleFocus = () => {
  if (props.trigger === 'focus') {
    show();
  }
};

const handleBlur = () => {
  if (props.trigger === 'focus') {
    hide();
  }
};

// 点击外部关闭（click 触发模式）
const handleClickOutside = (event: MouseEvent) => {
  if (
    props.trigger === 'click' &&
    actualVisible.value &&
    triggerRef.value &&
    contentRef.value
  ) {
    const target = event.target as Node;
    if (
      !triggerRef.value.contains(target) &&
      !contentRef.value.contains(target)
    ) {
      hide();
    }
  }
};

// 监听外部点击
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  clearTimers();
});

// 计算容器类名
const tooltipClass = computed(() =>
  classNames('chips-tooltip', `chips-tooltip--${props.placement}`, {
    'chips-tooltip--visible': actualVisible.value,
    'chips-tooltip--hidden': !actualVisible.value,
  })
);

// 计算内容类名
const contentClass = computed(() =>
  classNames('chips-tooltip__content', `chips-tooltip__content--${props.placement}`)
);

// 是否应该渲染内容
const shouldRender = computed(() => {
  if (props.destroyOnHide) {
    return actualVisible.value;
  }
  return true;
});

// 获取挂载容器
const getContainer = computed(() => {
  if (props.getPopupContainer) {
    return props.getPopupContainer();
  }
  return document.body;
});

// 暴露实例方法
defineExpose<TooltipInstance>({
  $el: tooltipRef.value,
  show: () => {
    clearTimers();
    updateVisible(true);
  },
  hide: () => {
    clearTimers();
    updateVisible(false);
  },
  toggle,
});
</script>

<template>
  <div
    ref="tooltipRef"
    :class="tooltipClass"
  >
    <!-- 触发元素 -->
    <div
      ref="triggerRef"
      class="chips-tooltip__trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <slot />
    </div>

    <!-- 提示内容 -->
    <Teleport :to="getContainer">
      <div
        v-if="shouldRender"
        v-show="actualVisible"
        ref="contentRef"
        :class="contentClass"
        :style="zIndex !== undefined ? { zIndex } : undefined"
        role="tooltip"
        :aria-hidden="!actualVisible"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div class="chips-tooltip__arrow" />
        <div class="chips-tooltip__inner">
          <slot name="content">{{ content }}</slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<!-- 不包含任何样式 -->
