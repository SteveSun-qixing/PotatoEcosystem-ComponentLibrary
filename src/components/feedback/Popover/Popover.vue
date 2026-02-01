<script setup lang="ts">
/**
 * Popover 气泡卡片组件
 *
 * 无样式气泡组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-popover                   - 容器
 * - .chips-popover__trigger          - 触发元素包装器
 * - .chips-popover__content          - 内容容器
 * - .chips-popover__title            - 标题
 * - .chips-popover__inner-content    - 内容区域
 * - .chips-popover__arrow            - 箭头
 * - .chips-popover--top              - 上方位置
 * - .chips-popover--topLeft          - 上左位置
 * - .chips-popover--topRight         - 上右位置
 * - .chips-popover--bottom           - 下方位置
 * - .chips-popover--bottomLeft       - 下左位置
 * - .chips-popover--bottomRight      - 下右位置
 * - .chips-popover--left             - 左方位置
 * - .chips-popover--leftTop          - 左上位置
 * - .chips-popover--leftBottom       - 左下位置
 * - .chips-popover--right            - 右方位置
 * - .chips-popover--rightTop         - 右上位置
 * - .chips-popover--rightBottom      - 右下位置
 * - .chips-popover--visible          - 可见状态
 * - .chips-popover--hidden           - 隐藏状态
 */

import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  Teleport,
  getCurrentInstance,
} from 'vue';
import type { PopoverProps, PopoverEmits, PopoverInstance } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'top',
  trigger: 'hover',
  defaultVisible: false,
  disabled: false,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyOnHide: false,
  arrow: true,
});

// Emits
const emit = defineEmits<PopoverEmits>();

// 获取组件实例用于检测 visible 是否被显式传递
const instance = getCurrentInstance();

// Refs
const popoverRef = ref<HTMLElement | null>(null);
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

// 显示气泡
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

// 隐藏气泡
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
const popoverClass = computed(() =>
  classNames(
    'chips-popover',
    `chips-popover--${props.placement}`,
    {
      'chips-popover--visible': actualVisible.value,
      'chips-popover--hidden': !actualVisible.value,
    },
    props.class
  )
);

// 计算内容类名
const contentClass = computed(() =>
  classNames('chips-popover__content', `chips-popover__content--${props.placement}`)
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

// 是否有标题
const hasTitle = computed(() => {
  return props.title !== undefined || !!instance?.slots?.title;
});

// 是否有内容
const hasContent = computed(() => {
  return props.content !== undefined || !!instance?.slots?.content;
});

// 暴露实例方法
defineExpose<PopoverInstance>({
  $el: popoverRef.value,
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
    ref="popoverRef"
    :class="popoverClass"
  >
    <!-- 触发元素 -->
    <div
      ref="triggerRef"
      class="chips-popover__trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <slot />
    </div>

    <!-- 气泡内容 -->
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
        <!-- 箭头 -->
        <div
          v-if="arrow"
          class="chips-popover__arrow"
        />
        
        <!-- 标题 -->
        <div
          v-if="hasTitle"
          class="chips-popover__title"
        >
          <slot name="title">
            <template v-if="typeof title === 'string'">
              {{ title }}
            </template>
            <component
              v-else-if="title"
              :is="() => title"
            />
          </slot>
        </div>
        
        <!-- 内容 -->
        <div
          v-if="hasContent"
          class="chips-popover__inner-content"
        >
          <slot name="content">
            <template v-if="typeof content === 'string'">
              {{ content }}
            </template>
            <component
              v-else-if="content"
              :is="() => content"
            />
          </slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<!-- 不包含任何样式 -->
