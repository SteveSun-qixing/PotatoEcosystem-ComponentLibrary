<script setup lang="ts">
/**
 * Dropdown 下拉菜单组件
 *
 * 无样式下拉菜单组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-dropdown                 - 容器
 * - .chips-dropdown__trigger        - 触发元素包装器
 * - .chips-dropdown__overlay        - 下拉菜单内容
 * - .chips-dropdown--top            - 上方位置
 * - .chips-dropdown--topLeft        - 上左位置
 * - .chips-dropdown--topRight       - 上右位置
 * - .chips-dropdown--bottom         - 下方位置
 * - .chips-dropdown--bottomLeft     - 下左位置
 * - .chips-dropdown--bottomRight    - 下右位置
 * - .chips-dropdown--left           - 左方位置
 * - .chips-dropdown--leftTop        - 左上位置
 * - .chips-dropdown--leftBottom     - 左下位置
 * - .chips-dropdown--right          - 右方位置
 * - .chips-dropdown--rightTop       - 右上位置
 * - .chips-dropdown--rightBottom    - 右下位置
 * - .chips-dropdown--open           - 展开状态
 * - .chips-dropdown--disabled       - 禁用状态
 */

import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  Teleport,
  getCurrentInstance,
} from 'vue';
import type { DropdownProps, DropdownEmits, DropdownInstance } from './types';
import { classNames } from '@/utils';

// Props - 注意 visible 不设置默认值，保持 undefined 以支持受控模式检测
const props = withDefaults(defineProps<DropdownProps>(), {
  placement: 'bottomLeft',
  trigger: 'hover',
  defaultVisible: false,
  disabled: false,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyOnHide: false,
});

// Emits
const emit = defineEmits<DropdownEmits>();

// 获取组件实例用于检测 visible 是否被显式传递
const instance = getCurrentInstance();

// Refs
const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);

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

// 显示下拉菜单
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

// 隐藏下拉菜单
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

const handleClick = (event: MouseEvent) => {
  if (props.trigger === 'click') {
    event.preventDefault();
    toggle();
  }
};

const handleContextMenu = (event: MouseEvent) => {
  if (props.trigger === 'contextmenu') {
    event.preventDefault();
    toggle();
  }
};

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (
    (props.trigger === 'click' || props.trigger === 'contextmenu') &&
    actualVisible.value &&
    triggerRef.value &&
    overlayRef.value
  ) {
    const target = event.target as Node;
    if (
      !triggerRef.value.contains(target) &&
      !overlayRef.value.contains(target)
    ) {
      clearTimers();
      updateVisible(false);
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
const dropdownClass = computed(() =>
  classNames('chips-dropdown', `chips-dropdown--${props.placement}`, {
    'chips-dropdown--open': actualVisible.value,
    'chips-dropdown--disabled': props.disabled,
  })
);

// 计算内容类名
const overlayClass = computed(() =>
  classNames('chips-dropdown__overlay', `chips-dropdown__overlay--${props.placement}`)
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
defineExpose<DropdownInstance>({
  $el: dropdownRef.value,
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
    ref="dropdownRef"
    :class="dropdownClass"
  >
    <!-- 触发元素 -->
    <div
      ref="triggerRef"
      class="chips-dropdown__trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @contextmenu="handleContextMenu"
    >
      <slot />
    </div>

    <!-- 下拉内容 -->
    <Teleport :to="getContainer">
      <div
        v-if="shouldRender"
        v-show="actualVisible"
        ref="overlayRef"
        :class="overlayClass"
        :style="zIndex !== undefined ? { zIndex } : undefined"
        role="menu"
        :aria-hidden="!actualVisible"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <slot name="overlay" />
      </div>
    </Teleport>
  </div>
</template>

<!-- 不包含任何样式 -->
