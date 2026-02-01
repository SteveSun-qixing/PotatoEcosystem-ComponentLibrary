<script setup lang="ts">
/**
 * Pagination 分页组件
 *
 * 无样式分页组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-pagination                     - 分页容器
 * - .chips-pagination__item               - 分页项
 * - .chips-pagination__item--active       - 激活状态
 * - .chips-pagination__item--disabled     - 禁用状态
 * - .chips-pagination__prev               - 上一页按钮
 * - .chips-pagination__next               - 下一页按钮
 * - .chips-pagination__jump-prev          - 向前跳转
 * - .chips-pagination__jump-next          - 向后跳转
 * - .chips-pagination__options            - 选项区域
 * - .chips-pagination__options-size-changer - 每页条数选择器
 * - .chips-pagination__options-quick-jumper - 快速跳转
 * - .chips-pagination__total              - 总数显示
 * - .chips-pagination--simple             - 简洁模式
 * - .chips-pagination--small              - 小尺寸
 * - .chips-pagination--disabled           - 禁用状态
 */

import { computed, ref } from 'vue';
import type { PaginationProps, PaginationEmits, PaginationInstance, PaginationItem } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<PaginationProps>(), {
  defaultCurrent: 1,
  total: 0,
  defaultPageSize: 10,
  pageSizeOptions: () => [10, 20, 50, 100],
  showSizeChanger: false,
  showQuickJumper: false,
  showTotal: false,
  disabled: false,
  simple: false,
  size: 'default',
  showLessItems: false,
  hideOnSinglePage: false,
});

// Emits
const emit = defineEmits<PaginationEmits>();

// Refs
const paginationRef = ref<HTMLElement | null>(null);

// 内部状态
const internalCurrent = ref(props.defaultCurrent);
const internalPageSize = ref(props.pageSize ?? props.defaultPageSize);
const jumpInputValue = ref('');

// 当前页码
const currentPage = computed({
  get: () => props.current ?? internalCurrent.value,
  set: (value: number) => {
    internalCurrent.value = value;
    emit('update:current', value);
    emit('change', value, currentPageSize.value);
  },
});

// 每页条数
const currentPageSize = computed({
  get: () => props.pageSize ?? internalPageSize.value,
  set: (value: number) => {
    internalPageSize.value = value;
    emit('update:pageSize', value);
    emit('pageSizeChange', currentPage.value, value);
  },
});

// 总页数
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / currentPageSize.value));
});

// 是否应该隐藏
const shouldHide = computed(() => {
  return props.hideOnSinglePage && totalPages.value <= 1;
});

// 是否在第一页
const isFirstPage = computed(() => currentPage.value <= 1);

// 是否在最后一页
const isLastPage = computed(() => currentPage.value >= totalPages.value);

// 显示范围
const displayRange = computed<[number, number]>(() => {
  const start = (currentPage.value - 1) * currentPageSize.value + 1;
  const end = Math.min(currentPage.value * currentPageSize.value, props.total);
  return [start, end];
});

// 总数显示文本
const totalText = computed(() => {
  if (typeof props.showTotal === 'function') {
    return props.showTotal(props.total, displayRange.value);
  }
  if (props.showTotal) {
    return `共 ${props.total} 条`;
  }
  return '';
});

// 计算显示的页码列表
const pageList = computed<PaginationItem[]>(() => {
  const items: PaginationItem[] = [];
  const current = currentPage.value;
  const total = totalPages.value;

  // 简洁模式不显示页码列表
  if (props.simple) {
    return items;
  }

  // 始终显示的页码数量
  const showCount = props.showLessItems ? 5 : 7;
  // 中间页码数量
  const sideCount = Math.floor((showCount - 3) / 2);

  // 如果总页数小于等于 showCount，全部显示
  if (total <= showCount) {
    for (let i = 1; i <= total; i++) {
      items.push({
        type: 'page',
        page: i,
        active: i === current,
        disabled: props.disabled,
      });
    }
    return items;
  }

  // 始终显示第一页
  items.push({
    type: 'page',
    page: 1,
    active: current === 1,
    disabled: props.disabled,
  });

  // 计算中间页码范围
  let left = Math.max(2, current - sideCount);
  let right = Math.min(total - 1, current + sideCount);

  // 调整范围以确保显示足够的页码
  if (current - 1 <= sideCount + 1) {
    right = showCount - 2;
  }
  if (total - current <= sideCount + 1) {
    left = total - showCount + 3;
  }

  // 添加前省略号
  if (left > 2) {
    items.push({
      type: 'jump-prev',
      disabled: props.disabled,
    });
  }

  // 添加中间页码
  for (let i = left; i <= right; i++) {
    items.push({
      type: 'page',
      page: i,
      active: i === current,
      disabled: props.disabled,
    });
  }

  // 添加后省略号
  if (right < total - 1) {
    items.push({
      type: 'jump-next',
      disabled: props.disabled,
    });
  }

  // 始终显示最后一页
  items.push({
    type: 'page',
    page: total,
    active: current === total,
    disabled: props.disabled,
  });

  return items;
});

// 计算样式类名
const paginationClass = computed(() =>
  classNames('chips-pagination', {
    'chips-pagination--simple': props.simple,
    'chips-pagination--small': props.size === 'small',
    'chips-pagination--disabled': props.disabled,
  })
);

// 获取分页项类名
const getItemClass = (item: PaginationItem) =>
  classNames('chips-pagination__item', `chips-pagination__${item.type}`, {
    'chips-pagination__item--active': item.active,
    'chips-pagination__item--disabled': item.disabled || props.disabled,
  });

// 跳转到指定页
const goToPage = (page: number) => {
  if (props.disabled) return;

  const targetPage = Math.max(1, Math.min(page, totalPages.value));
  if (targetPage !== currentPage.value) {
    currentPage.value = targetPage;
  }
};

// 上一页
const handlePrev = () => {
  if (!isFirstPage.value && !props.disabled) {
    goToPage(currentPage.value - 1);
  }
};

// 下一页
const handleNext = () => {
  if (!isLastPage.value && !props.disabled) {
    goToPage(currentPage.value + 1);
  }
};

// 向前跳转 5 页
const handleJumpPrev = () => {
  if (!props.disabled) {
    goToPage(currentPage.value - 5);
  }
};

// 向后跳转 5 页
const handleJumpNext = () => {
  if (!props.disabled) {
    goToPage(currentPage.value + 5);
  }
};

// 点击页码
const handlePageClick = (item: PaginationItem) => {
  if (item.disabled || props.disabled) return;

  if (item.type === 'page' && item.page) {
    goToPage(item.page);
  } else if (item.type === 'jump-prev') {
    handleJumpPrev();
  } else if (item.type === 'jump-next') {
    handleJumpNext();
  }
};

// 每页条数改变
const handleSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newSize = parseInt(target.value, 10);
  if (!isNaN(newSize)) {
    currentPageSize.value = newSize;
    // 如果当前页超出范围，调整到最后一页
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  }
};

// 快速跳转
const handleJumpKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const page = parseInt(jumpInputValue.value, 10);
    if (!isNaN(page)) {
      goToPage(page);
      jumpInputValue.value = '';
    }
  }
};

// 快速跳转输入
const handleJumpInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  jumpInputValue.value = target.value;
};

// 简洁模式输入
const simpleInputValue = computed(() => String(currentPage.value));

const handleSimpleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const page = parseInt(target.value, 10);
  if (!isNaN(page)) {
    goToPage(page);
  }
};

// 暴露实例方法
defineExpose<PaginationInstance>({
  $el: paginationRef.value,
});
</script>

<template>
  <nav
    v-if="!shouldHide"
    ref="paginationRef"
    :class="paginationClass"
    role="navigation"
    aria-label="Pagination"
  >
    <!-- 总数显示 -->
    <span
      v-if="showTotal && !simple"
      class="chips-pagination__total"
    >
      {{ totalText }}
    </span>

    <!-- 简洁模式 -->
    <template v-if="simple">
      <!-- 上一页 -->
      <button
        type="button"
        :class="[
          'chips-pagination__item',
          'chips-pagination__prev',
          { 'chips-pagination__item--disabled': isFirstPage || disabled },
        ]"
        :disabled="isFirstPage || disabled"
        aria-label="Previous page"
        @click="handlePrev"
      >
        <slot name="prevIcon">‹</slot>
      </button>

      <!-- 页码输入 -->
      <span class="chips-pagination__simple-pager">
        <input
          type="text"
          class="chips-pagination__simple-input"
          :value="simpleInputValue"
          :disabled="disabled"
          aria-label="Current page"
          @change="handleSimpleInput"
        />
        <span class="chips-pagination__simple-separator">/</span>
        <span class="chips-pagination__simple-total">{{ totalPages }}</span>
      </span>

      <!-- 下一页 -->
      <button
        type="button"
        :class="[
          'chips-pagination__item',
          'chips-pagination__next',
          { 'chips-pagination__item--disabled': isLastPage || disabled },
        ]"
        :disabled="isLastPage || disabled"
        aria-label="Next page"
        @click="handleNext"
      >
        <slot name="nextIcon">›</slot>
      </button>
    </template>

    <!-- 正常模式 -->
    <template v-else>
      <!-- 上一页 -->
      <button
        type="button"
        :class="[
          'chips-pagination__item',
          'chips-pagination__prev',
          { 'chips-pagination__item--disabled': isFirstPage || disabled },
        ]"
        :disabled="isFirstPage || disabled"
        aria-label="Previous page"
        @click="handlePrev"
      >
        <slot name="prevIcon">‹</slot>
      </button>

      <!-- 页码列表 -->
      <button
        v-for="(item, index) in pageList"
        :key="`${item.type}-${item.page || index}`"
        type="button"
        :class="getItemClass(item)"
        :disabled="item.disabled || disabled"
        :aria-label="item.type === 'page' ? `Page ${item.page}` : item.type"
        :aria-current="item.active ? 'page' : undefined"
        @click="handlePageClick(item)"
      >
        <template v-if="item.type === 'page'">
          {{ item.page }}
        </template>
        <template v-else-if="item.type === 'jump-prev'">
          <slot name="jumpPrevIcon">•••</slot>
        </template>
        <template v-else-if="item.type === 'jump-next'">
          <slot name="jumpNextIcon">•••</slot>
        </template>
      </button>

      <!-- 下一页 -->
      <button
        type="button"
        :class="[
          'chips-pagination__item',
          'chips-pagination__next',
          { 'chips-pagination__item--disabled': isLastPage || disabled },
        ]"
        :disabled="isLastPage || disabled"
        aria-label="Next page"
        @click="handleNext"
      >
        <slot name="nextIcon">›</slot>
      </button>

      <!-- 选项区域 -->
      <div
        v-if="showSizeChanger || showQuickJumper"
        class="chips-pagination__options"
      >
        <!-- 每页条数选择器 -->
        <div
          v-if="showSizeChanger"
          class="chips-pagination__options-size-changer"
        >
          <select
            :value="currentPageSize"
            :disabled="disabled"
            aria-label="Page size"
            @change="handleSizeChange"
          >
            <option
              v-for="size in pageSizeOptions"
              :key="size"
              :value="size"
            >
              {{ size }} 条/页
            </option>
          </select>
        </div>

        <!-- 快速跳转 -->
        <div
          v-if="showQuickJumper"
          class="chips-pagination__options-quick-jumper"
        >
          <span>跳至</span>
          <input
            type="text"
            :value="jumpInputValue"
            :disabled="disabled"
            aria-label="Go to page"
            @input="handleJumpInput"
            @keydown="handleJumpKeyDown"
          />
          <span>页</span>
        </div>
      </div>
    </template>
  </nav>
</template>

<!-- 不包含任何样式 -->
