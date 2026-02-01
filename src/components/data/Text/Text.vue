<script setup lang="ts">
/**
 * Text 文本组件
 *
 * 无样式文本组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-text              - 文本容器
 * - .chips-text--default     - 默认类型
 * - .chips-text--primary     - 主要类型
 * - .chips-text--secondary   - 次要类型
 * - .chips-text--success     - 成功类型
 * - .chips-text--warning     - 警告类型
 * - .chips-text--danger      - 危险类型
 * - .chips-text--strong      - 加粗
 * - .chips-text--italic      - 斜体
 * - .chips-text--underline   - 下划线
 * - .chips-text--delete      - 删除线
 * - .chips-text--code        - 代码样式
 * - .chips-text--mark        - 标记样式
 * - .chips-text--keyboard    - 键盘样式
 * - .chips-text--ellipsis    - 省略模式
 * - .chips-text--expanded    - 已展开状态
 * - .chips-text__content     - 内容区域
 * - .chips-text__copy        - 复制按钮
 * - .chips-text__copy--copied - 已复制状态
 * - .chips-text__expand      - 展开/收起按钮
 */

import { computed, ref, useSlots, onMounted, watch } from 'vue';
import type { TextProps, TextEmits, TextInstance, EllipsisConfig, CopyableConfig } from './types';
import { classNames, isObject } from '@/utils';

// Props
const props = withDefaults(defineProps<TextProps>(), {
  type: 'default',
  strong: false,
  italic: false,
  underline: false,
  delete: false,
  code: false,
  mark: false,
  keyboard: false,
  ellipsis: false,
  copyable: false,
});

// Emits
const emit = defineEmits<TextEmits>();

// Slots
const slots = useSlots();

// Refs
const textRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

// 状态
const isExpanded = ref(false);
const isCopied = ref(false);
const isOverflow = ref(false);

// 解析省略配置
const ellipsisConfig = computed<EllipsisConfig | null>(() => {
  if (props.ellipsis === false) return null;
  if (props.ellipsis === true) return { rows: 1, expandable: false };
  return props.ellipsis;
});

// 解析复制配置
const copyableConfig = computed<CopyableConfig | null>(() => {
  if (props.copyable === false) return null;
  if (props.copyable === true) return {};
  return props.copyable;
});

// 是否启用省略
const isEllipsis = computed(() => ellipsisConfig.value !== null);

// 是否可复制
const isCopyable = computed(() => copyableConfig.value !== null);

// 是否可展开
const isExpandable = computed(() => ellipsisConfig.value?.expandable === true);

// 计算样式类名
const textClass = computed(() =>
  classNames('chips-text', `chips-text--${props.type}`, {
    'chips-text--strong': props.strong,
    'chips-text--italic': props.italic,
    'chips-text--underline': props.underline,
    'chips-text--delete': props.delete,
    'chips-text--code': props.code,
    'chips-text--mark': props.mark,
    'chips-text--keyboard': props.keyboard,
    'chips-text--ellipsis': isEllipsis.value && !isExpanded.value,
    'chips-text--expanded': isExpanded.value,
  })
);

// 省略行数的 CSS 变量
const ellipsisStyle = computed(() => {
  if (!isEllipsis.value || isExpanded.value) return {};
  const rows = ellipsisConfig.value?.rows ?? 1;
  return {
    '--chips-text-ellipsis-rows': rows,
  };
});

// 复制按钮类名
const copyClass = computed(() =>
  classNames('chips-text__copy', {
    'chips-text__copy--copied': isCopied.value,
  })
);

// 获取文本内容
const getTextContent = () => {
  if (copyableConfig.value?.text) {
    return copyableConfig.value.text;
  }
  return contentRef.value?.textContent || '';
};

// 复制文本
const copy = async () => {
  const text = getTextContent();

  try {
    await navigator.clipboard.writeText(text);
    isCopied.value = true;

    // 触发回调
    copyableConfig.value?.onCopy?.();
    emit('copy', text);

    // 重置复制状态
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
};

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  emit('expand', isExpanded.value);
};

// 检测内容是否溢出
const checkOverflow = () => {
  if (!contentRef.value || !isEllipsis.value) {
    isOverflow.value = false;
    return;
  }

  const el = contentRef.value;
  isOverflow.value = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
};

// 监听内容变化
onMounted(() => {
  checkOverflow();
});

watch(isExpanded, () => {
  // 收起时重新检测溢出
  if (!isExpanded.value) {
    setTimeout(checkOverflow, 0);
  }
});

// 暴露实例方法
defineExpose<TextInstance>({
  $el: textRef.value,
  copy,
  toggleExpand,
});
</script>

<template>
  <span
    ref="textRef"
    :class="textClass"
    :style="ellipsisStyle"
  >
    <!-- 内容区域 -->
    <span
      ref="contentRef"
      class="chips-text__content"
    >
      <slot />
    </span>

    <!-- 展开/收起按钮 -->
    <span
      v-if="isExpandable && (isOverflow || isExpanded)"
      class="chips-text__expand"
      role="button"
      tabindex="0"
      :aria-expanded="isExpanded"
      @click="toggleExpand"
      @keydown.enter="toggleExpand"
      @keydown.space.prevent="toggleExpand"
    >
      <slot
        name="expand"
        :expanded="isExpanded"
      />
    </span>

    <!-- 复制按钮 -->
    <span
      v-if="isCopyable"
      :class="copyClass"
      role="button"
      tabindex="0"
      :aria-label="isCopied ? 'Copied' : 'Copy'"
      @click="copy"
      @keydown.enter="copy"
      @keydown.space.prevent="copy"
    >
      <slot
        v-if="isCopied"
        name="copiedIcon"
      />
      <slot
        v-else
        name="copyIcon"
      />
    </span>
  </span>
</template>

<!-- 不包含任何样式 -->
