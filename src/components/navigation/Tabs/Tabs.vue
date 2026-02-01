<script setup lang="ts">
/**
 * Tabs 标签页组件
 *
 * 无样式标签页组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-tabs                   - 标签页容器
 * - .chips-tabs__nav              - 导航区域
 * - .chips-tabs__nav-wrap         - 导航包装器
 * - .chips-tabs__nav-list         - 标签列表
 * - .chips-tabs__tab              - 单个标签
 * - .chips-tabs__tab--active      - 激活状态
 * - .chips-tabs__tab--disabled    - 禁用状态
 * - .chips-tabs__tab-btn          - 标签按钮
 * - .chips-tabs__tab-close        - 关闭按钮（editable-card）
 * - .chips-tabs__ink-bar          - 指示条
 * - .chips-tabs__extra-content    - 附加内容区域
 * - .chips-tabs__add-btn          - 新增按钮（editable-card）
 * - .chips-tabs__content          - 内容区域
 * - .chips-tabs__tabpane          - 单个面板
 * - .chips-tabs--line             - 线条类型
 * - .chips-tabs--card             - 卡片类型
 * - .chips-tabs--editable-card    - 可编辑卡片类型
 * - .chips-tabs--top              - 顶部位置
 * - .chips-tabs--right            - 右侧位置
 * - .chips-tabs--bottom           - 底部位置
 * - .chips-tabs--left             - 左侧位置
 * - .chips-tabs--small            - 小尺寸
 * - .chips-tabs--medium           - 中尺寸
 * - .chips-tabs--large            - 大尺寸
 * - .chips-tabs--centered         - 居中对齐
 */

import { computed, provide, ref, onMounted } from 'vue';
import type {
  TabsProps,
  TabsEmits,
  TabsInstance,
  TabsContext,
  TabPaneConfig,
} from './types';
import { TABS_INJECTION_KEY } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<TabsProps>(), {
  type: 'line',
  size: 'medium',
  centered: false,
  tabPosition: 'top',
  destroyInactiveTabPane: false,
  keyboard: true,
});

// Emits
const emit = defineEmits<TabsEmits>();

// Refs
const tabsRef = ref<HTMLDivElement | null>(null);
const navRef = ref<HTMLDivElement | null>(null);

// 内部状态
const internalActiveKey = ref<string>(props.defaultActiveKey || '');
const panes = ref<Map<string, TabPaneConfig>>(new Map());

// 计算当前激活的 key
const activeKey = computed({
  get: () => props.activeKey ?? internalActiveKey.value,
  set: (value: string) => {
    internalActiveKey.value = value;
    emit('update:activeKey', value);
  },
});

// 获取有序的 panes 列表
const orderedPanes = computed(() => {
  return Array.from(panes.value.values());
});

// 监听 defaultActiveKey 设置初始值
onMounted(() => {
  if (!activeKey.value && orderedPanes.value.length > 0) {
    const firstEnabled = orderedPanes.value.find((p) => !p.disabled);
    if (firstEnabled) {
      activeKey.value = firstEnabled.key;
    }
  }
});

// 注册 TabPane
const registerPane = (pane: TabPaneConfig) => {
  panes.value.set(pane.key, pane);
  // 如果是第一个 pane 且没有激活项，则自动激活
  if (!activeKey.value && !pane.disabled) {
    activeKey.value = pane.key;
  }
};

// 注销 TabPane
const unregisterPane = (key: string) => {
  panes.value.delete(key);
};

// 提供上下文
provide<TabsContext>(TABS_INJECTION_KEY, {
  activeKey,
  registerPane,
  unregisterPane,
  destroyInactiveTabPane: props.destroyInactiveTabPane,
});

// 计算样式类名
const tabsClass = computed(() =>
  classNames(
    'chips-tabs',
    `chips-tabs--${props.type}`,
    `chips-tabs--${props.tabPosition}`,
    `chips-tabs--${props.size}`,
    {
      'chips-tabs--centered': props.centered,
    }
  )
);

// 判断是否为垂直布局
const isVertical = computed(() => props.tabPosition === 'left' || props.tabPosition === 'right');

// 处理 tab 点击
const handleTabClick = (key: string, event: MouseEvent) => {
  const pane = panes.value.get(key);
  if (pane?.disabled) {
    return;
  }

  emit('tabClick', key, event);

  if (key !== activeKey.value) {
    const oldKey = activeKey.value;
    activeKey.value = key;
    emit('change', key, oldKey);
  }
};

// 处理关闭 tab
const handleTabClose = (key: string, event: MouseEvent) => {
  event.stopPropagation();
  emit('edit', key, 'remove');
};

// 处理新增 tab
const handleAdd = (event: MouseEvent) => {
  emit('edit', event, 'add');
};

// 处理键盘导航
const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.keyboard) return;

  const panesArray = orderedPanes.value.filter((p) => !p.disabled);
  const currentIndex = panesArray.findIndex((p) => p.key === activeKey.value);

  if (currentIndex === -1) return;

  let newIndex = currentIndex;
  const isVerticalNav = isVertical.value;

  switch (event.key) {
    case 'ArrowLeft':
      if (!isVerticalNav) {
        newIndex = currentIndex > 0 ? currentIndex - 1 : panesArray.length - 1;
      }
      break;
    case 'ArrowRight':
      if (!isVerticalNav) {
        newIndex = currentIndex < panesArray.length - 1 ? currentIndex + 1 : 0;
      }
      break;
    case 'ArrowUp':
      if (isVerticalNav) {
        newIndex = currentIndex > 0 ? currentIndex - 1 : panesArray.length - 1;
      }
      break;
    case 'ArrowDown':
      if (isVerticalNav) {
        newIndex = currentIndex < panesArray.length - 1 ? currentIndex + 1 : 0;
      }
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = panesArray.length - 1;
      break;
    default:
      return;
  }

  if (newIndex !== currentIndex && panesArray[newIndex]) {
    event.preventDefault();
    const newPane = panesArray[newIndex]!;
    const oldKey = activeKey.value;
    activeKey.value = newPane.key;
    emit('change', newPane.key, oldKey);
  }
};

// 获取 tab 类名
const getTabClass = (pane: TabPaneConfig) =>
  classNames('chips-tabs__tab', {
    'chips-tabs__tab--active': activeKey.value === pane.key,
    'chips-tabs__tab--disabled': pane.disabled,
  });

// 暴露实例方法
defineExpose<TabsInstance>({
  $el: tabsRef.value,
});
</script>

<template>
  <div
    ref="tabsRef"
    :class="tabsClass"
    role="tablist"
    :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
  >
    <!-- 导航区域 -->
    <div
      ref="navRef"
      class="chips-tabs__nav"
    >
      <!-- 左侧附加内容 -->
      <div
        v-if="$slots.leftExtra"
        class="chips-tabs__extra-content chips-tabs__extra-content--left"
      >
        <slot name="leftExtra" />
      </div>

      <!-- 导航包装器 -->
      <div class="chips-tabs__nav-wrap">
        <!-- 标签列表 -->
        <div
          class="chips-tabs__nav-list"
          role="presentation"
          @keydown="handleKeyDown"
        >
          <div
            v-for="pane in orderedPanes"
            :key="pane.key"
            :class="getTabClass(pane)"
            role="tab"
            :tabindex="activeKey === pane.key ? 0 : -1"
            :aria-selected="activeKey === pane.key"
            :aria-disabled="pane.disabled"
            @click="handleTabClick(pane.key, $event)"
          >
            <!-- 标签按钮 -->
            <button
              type="button"
              class="chips-tabs__tab-btn"
              :disabled="pane.disabled"
              :tabindex="-1"
            >
              <component
                :is="pane.tab"
                v-if="typeof pane.tab !== 'string'"
              />
              <template v-else>
                {{ pane.tab }}
              </template>
            </button>

            <!-- 关闭按钮 -->
            <button
              v-if="type === 'editable-card' && pane.closable !== false"
              type="button"
              class="chips-tabs__tab-close"
              aria-label="Remove tab"
              @click="handleTabClose(pane.key, $event)"
            >
              <slot name="removeIcon">×</slot>
            </button>
          </div>

          <!-- 指示条（仅 line 类型） -->
          <div
            v-if="type === 'line'"
            class="chips-tabs__ink-bar"
            aria-hidden="true"
          />
        </div>
      </div>

      <!-- 右侧附加内容 -->
      <div
        v-if="$slots.rightExtra"
        class="chips-tabs__extra-content chips-tabs__extra-content--right"
      >
        <slot name="rightExtra" />
      </div>

      <!-- 新增按钮（editable-card） -->
      <button
        v-if="type === 'editable-card'"
        type="button"
        class="chips-tabs__add-btn"
        aria-label="Add tab"
        @click="handleAdd"
      >
        <slot name="addIcon">+</slot>
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="chips-tabs__content">
      <slot />
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
