<script setup lang="ts">
/**
 * Sider 布局侧边栏组件
 *
 * 无样式侧边栏组件，所有视觉效果由主题包提供
 * 支持可折叠和响应式断点功能
 *
 * 样式接口点:
 * - .chips-layout-sider             - 侧边栏容器
 * - .chips-layout-sider--collapsed  - 折叠状态
 * - .chips-layout-sider--collapsible - 可折叠状态
 * - .chips-layout-sider__children   - 子内容区域
 * - .chips-layout-sider__trigger    - 折叠触发器
 * - .chips-layout-sider__trigger--reverse - 翻转箭头方向
 */

import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  useSlots,
  watch,
} from 'vue';
import type { SiderProps, SiderEmits, SiderInstance } from './types';
import { SIDER_CONTEXT_KEY, BREAKPOINT_MAP } from './types';
import { classNames } from '@/utils';
import { useControllableStateWithWatch } from '@/composables';

// Props
const props = withDefaults(defineProps<SiderProps>(), {
  width: 200,
  collapsedWidth: 80,
  collapsed: undefined,
  collapsible: false,
  reverseArrow: false,
  breakpoint: undefined,
});

// Emits
const emit = defineEmits<SiderEmits>();

// Slots
const slots = useSlots();

// Refs
const siderRef = ref<HTMLElement | null>(null);

// 获取 Layout 上下文
const siderContext = inject(SIDER_CONTEXT_KEY, null);

// 使用可控状态管理 collapsed
const [isCollapsed, setIsCollapsed] = useControllableStateWithWatch(
  () => props.collapsed,
  false,
  (value) => emit('update:collapsed', value)
);

// 是否因响应式断点而折叠
const isBroken = ref(false);

// MediaQueryList 引用
let mql: MediaQueryList | null = null;

// 计算当前宽度
const siderWidth = computed(() => {
  const width = isCollapsed.value ? props.collapsedWidth : props.width;
  return typeof width === 'number' ? `${width}px` : width;
});

// 计算样式类名
const siderClass = computed(() =>
  classNames('chips-layout-sider', {
    'chips-layout-sider--collapsed': isCollapsed.value,
    'chips-layout-sider--collapsible': props.collapsible,
  })
);

// 计算动态样式
const siderStyle = computed(() => ({
  width: siderWidth.value,
  minWidth: siderWidth.value,
  maxWidth: siderWidth.value,
}));

// 计算触发器类名
const triggerClass = computed(() =>
  classNames('chips-layout-sider__trigger', {
    'chips-layout-sider__trigger--reverse': props.reverseArrow,
  })
);

// 是否显示触发器
const showTrigger = computed(() => {
  // 如果不可折叠，不显示触发器
  if (!props.collapsible) {
    return false;
  }
  // 如果提供了 trigger 插槽且返回 null，不显示触发器
  // 否则显示触发器
  return true;
});

// 点击触发器
const handleTriggerClick = () => {
  if (!props.collapsible) return;

  const newCollapsed = !isCollapsed.value;
  setIsCollapsed(newCollapsed);
  emit('collapse', newCollapsed, 'clickTrigger');
};

// 响应式断点处理
const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
  const matches = e.matches;
  isBroken.value = matches;
  emit('breakpoint', matches);

  // 如果断点触发，自动折叠/展开
  if (matches !== isCollapsed.value) {
    setIsCollapsed(matches);
    emit('collapse', matches, 'responsive');
  }
};

// 设置媒体查询监听
const setupMediaQuery = () => {
  if (typeof window === 'undefined' || !props.breakpoint) {
    return;
  }

  const breakpointValue = BREAKPOINT_MAP[props.breakpoint];
  const mediaQuery = `(max-width: ${breakpointValue}px)`;

  mql = window.matchMedia(mediaQuery);

  // 初始检查
  handleMediaQueryChange(mql);

  // 添加监听器
  if (mql.addEventListener) {
    mql.addEventListener('change', handleMediaQueryChange);
  } else {
    // 兼容旧版浏览器
    mql.addListener(handleMediaQueryChange);
  }
};

// 清理媒体查询监听
const cleanupMediaQuery = () => {
  if (!mql) return;

  if (mql.removeEventListener) {
    mql.removeEventListener('change', handleMediaQueryChange);
  } else {
    // 兼容旧版浏览器
    mql.removeListener(handleMediaQueryChange);
  }

  mql = null;
};

// 注册到 Layout 上下文
onMounted(() => {
  siderContext?.addSider();
  setupMediaQuery();
});

// 清理
onUnmounted(() => {
  siderContext?.removeSider();
  cleanupMediaQuery();
});

// 监听断点变化，重新设置媒体查询
watch(
  () => props.breakpoint,
  () => {
    cleanupMediaQuery();
    setupMediaQuery();
  }
);

// 暴露实例方法
defineExpose<SiderInstance>({
  $el: siderRef.value,
});
</script>

<template>
  <aside
    ref="siderRef"
    :class="siderClass"
    :style="siderStyle"
  >
    <!-- 子内容区域 -->
    <div class="chips-layout-sider__children">
      <slot />
    </div>

    <!-- 折叠触发器 -->
    <div
      v-if="showTrigger"
      :class="triggerClass"
      role="button"
      tabindex="0"
      :aria-expanded="!isCollapsed"
      @click="handleTriggerClick"
      @keydown.enter="handleTriggerClick"
      @keydown.space.prevent="handleTriggerClick"
    >
      <slot name="trigger">
        <!-- 默认触发器内容由主题包提供 -->
      </slot>
    </div>
  </aside>
</template>

<!-- 不包含任何样式 -->
