<script setup lang="ts">
/**
 * TabPane 标签面板组件
 *
 * 无样式标签面板组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-tabs__tabpane          - 面板容器
 * - .chips-tabs__tabpane--active  - 激活状态
 * - .chips-tabs__tabpane--hidden  - 隐藏状态
 */

import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
  useSlots,
  getCurrentInstance,
} from 'vue';
import type { TabPaneProps, TabPaneInstance, TabsContext, TabPaneConfig } from './types';
import { TABS_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<TabPaneProps>(), {
  disabled: false,
  closable: true,
  forceRender: false,
});

// Slots
const slots = useSlots();

// Refs
const paneRef = ref<HTMLDivElement | null>(null);

// 获取实例
const instance = getCurrentInstance();

// 注入 Tabs 上下文
const tabsContext = inject<TabsContext>(TABS_INJECTION_KEY);

// 获取 key（从 name prop 或 vnode.key）
const paneKey = computed(() => {
  return props.name || (instance?.vnode.key as string) || '';
});

// 是否激活
const isActive = computed(() => {
  return tabsContext?.activeKey.value === paneKey.value;
});

// 是否已经渲染过
const hasBeenActive = ref(false);

// 监听激活状态
watch(
  isActive,
  (active) => {
    if (active) {
      hasBeenActive.value = true;
    }
  },
  { immediate: true }
);

// 是否应该渲染内容
const shouldRender = computed(() => {
  if (props.forceRender) return true;
  if (tabsContext?.destroyInactiveTabPane) {
    return isActive.value;
  }
  return hasBeenActive.value;
});

// 计算样式类名
const paneClass = computed(() =>
  classNames('chips-tabs__tabpane', {
    'chips-tabs__tabpane--active': isActive.value,
    'chips-tabs__tabpane--hidden': !isActive.value,
  })
);

// 获取标签标题
const getTabContent = (): string => {
  if (slots.tab) {
    const tabSlot = slots.tab();
    if (tabSlot && tabSlot[0]) {
      // 返回插槽内容的文本表示
      return String(tabSlot[0].children || '');
    }
  }
  return props.tab || '';
};

// 注册到 Tabs
onMounted(() => {
  if (tabsContext && paneKey.value) {
    const config: TabPaneConfig = {
      key: paneKey.value,
      tab: getTabContent(),
      disabled: props.disabled,
      closable: props.closable,
      forceRender: props.forceRender,
    };
    tabsContext.registerPane(config);
  }
});

// 监听 props 变化更新注册
watch(
  () => [props.tab, props.disabled, props.closable, props.forceRender],
  () => {
    if (tabsContext && paneKey.value) {
      const config: TabPaneConfig = {
        key: paneKey.value,
        tab: getTabContent(),
        disabled: props.disabled,
        closable: props.closable,
        forceRender: props.forceRender,
      };
      tabsContext.registerPane(config);
    }
  }
);

// 注销
onUnmounted(() => {
  if (tabsContext && paneKey.value) {
    tabsContext.unregisterPane(paneKey.value);
  }
});

// 暴露实例方法
defineExpose<TabPaneInstance>({
  $el: paneRef.value,
});
</script>

<template>
  <div
    v-if="shouldRender"
    ref="paneRef"
    :class="paneClass"
    role="tabpanel"
    :aria-hidden="!isActive"
    :tabindex="isActive ? 0 : -1"
  >
    <slot />
  </div>
</template>

<!-- 不包含任何样式 -->
