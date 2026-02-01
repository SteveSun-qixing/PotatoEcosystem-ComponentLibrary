<script setup lang="ts">
/**
 * Select 选择器组件
 *
 * 无样式选择器组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-select                      - 选择器容器
 * - .chips-select--small               - 小尺寸
 * - .chips-select--medium              - 中尺寸
 * - .chips-select--large               - 大尺寸
 * - .chips-select--open                - 下拉展开状态
 * - .chips-select--disabled            - 禁用状态
 * - .chips-select--multiple            - 多选模式
 * - .chips-select--loading             - 加载状态
 * - .chips-select--error               - 错误状态
 * - .chips-select--warning             - 警告状态
 * - .chips-select--focused             - 聚焦状态
 * - .chips-select__selector            - 选择框
 * - .chips-select__selection           - 已选区域
 * - .chips-select__placeholder         - 占位文本
 * - .chips-select__tag                 - 多选标签
 * - .chips-select__tag-text            - 标签文本
 * - .chips-select__tag-close           - 标签关闭按钮
 * - .chips-select__tag-rest            - 超出数量提示
 * - .chips-select__search              - 搜索输入框
 * - .chips-select__arrow               - 箭头图标
 * - .chips-select__clear               - 清除图标
 * - .chips-select__spinner             - 加载图标
 * - .chips-select__dropdown            - 下拉菜单
 * - .chips-select__option              - 选项
 * - .chips-select__option--selected    - 选中选项
 * - .chips-select__option--disabled    - 禁用选项
 * - .chips-select__option--active      - 高亮选项（键盘导航）
 * - .chips-select__empty               - 空状态
 * - .chips-select__loading             - 加载状态
 */

import { computed, ref, watch, nextTick, onMounted, onUnmounted, useSlots } from 'vue';
import type { SelectProps, SelectEmits, SelectInstance, SelectOption, SelectValue } from './types';
import { useControllableStateWithWatch } from '@/composables';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  placeholder: '',
  disabled: false,
  multiple: false,
  searchable: false,
  clearable: false,
  size: 'medium',
  loading: false,
});

// Emits
const emit = defineEmits<SelectEmits>();

// Slots
const slots = useSlots();

// Refs
const selectRef = ref<HTMLElement | null>(null);
const selectorRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

// 下拉展开状态
const isOpen = ref(false);

// 搜索关键字
const searchKeyword = ref('');

// 键盘导航高亮索引
const activeIndex = ref(-1);

// 是否聚焦
const isFocused = ref(false);

// 使用受控/非受控状态管理
const [selectedValue, setSelectedValue] = useControllableStateWithWatch<SelectValue>(
  () => props.modelValue,
  props.defaultValue ?? (props.multiple ? [] : ''),
  (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  }
);

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!searchKeyword.value || !props.searchable) {
    return props.options;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(keyword)
  );
});

// 可选选项（排除禁用项，用于键盘导航）
const selectableIndices = computed(() => {
  return filteredOptions.value
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !option.disabled)
    .map(({ index }) => index);
});

// 判断选项是否选中
const isSelected = (option: SelectOption): boolean => {
  if (props.multiple) {
    return Array.isArray(selectedValue.value) && selectedValue.value.includes(option.value);
  }
  return selectedValue.value === option.value;
};

// 获取选中的选项
const selectedOptions = computed<SelectOption[]>(() => {
  if (props.multiple) {
    if (!Array.isArray(selectedValue.value)) return [];
    return props.options.filter((option) =>
      (selectedValue.value as (string | number)[]).includes(option.value)
    );
  }
  const option = props.options.find((opt) => opt.value === selectedValue.value);
  return option ? [option] : [];
});

// 显示的标签（考虑 maxTagCount）
const displayTags = computed(() => {
  if (!props.multiple) return [];
  const tags = selectedOptions.value;
  if (props.maxTagCount !== undefined && tags.length > props.maxTagCount) {
    return tags.slice(0, props.maxTagCount);
  }
  return tags;
});

// 剩余标签数量
const restTagCount = computed(() => {
  if (!props.multiple || props.maxTagCount === undefined) return 0;
  return Math.max(0, selectedOptions.value.length - props.maxTagCount);
});

// 是否显示占位符
const showPlaceholder = computed(() => {
  if (props.multiple) {
    return !Array.isArray(selectedValue.value) || selectedValue.value.length === 0;
  }
  return selectedValue.value === '' || selectedValue.value === undefined;
});

// 是否显示清除按钮
const showClear = computed(() => {
  if (!props.clearable || props.disabled || props.loading) return false;
  if (props.multiple) {
    return Array.isArray(selectedValue.value) && selectedValue.value.length > 0;
  }
  return selectedValue.value !== '' && selectedValue.value !== undefined;
});

// 计算样式类名
const selectClass = computed(() =>
  classNames(
    'chips-select',
    `chips-select--${props.size}`,
    {
      'chips-select--open': isOpen.value,
      'chips-select--disabled': props.disabled,
      'chips-select--multiple': props.multiple,
      'chips-select--loading': props.loading,
      'chips-select--focused': isFocused.value,
      'chips-select--error': props.status === 'error',
      'chips-select--warning': props.status === 'warning',
    }
  )
);

// 打开下拉菜单
const openDropdown = () => {
  if (props.disabled || props.loading) return;
  isOpen.value = true;
  activeIndex.value = -1;
  
  // 聚焦搜索框
  nextTick(() => {
    if (props.searchable && searchInputRef.value) {
      searchInputRef.value.focus();
    }
  });
};

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false;
  searchKeyword.value = '';
  activeIndex.value = -1;
};

// 切换下拉菜单
const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

// 选择选项
const selectOption = (option: SelectOption) => {
  if (option.disabled) return;

  if (props.multiple) {
    const currentValue = Array.isArray(selectedValue.value) ? [...selectedValue.value] : [];
    const index = currentValue.indexOf(option.value);
    
    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(option.value);
    }
    
    setSelectedValue(currentValue);
  } else {
    setSelectedValue(option.value);
    closeDropdown();
  }
};

// 移除标签
const removeTag = (option: SelectOption, event: MouseEvent) => {
  event.stopPropagation();
  if (props.disabled) return;

  if (props.multiple && Array.isArray(selectedValue.value)) {
    const newValue = selectedValue.value.filter((v) => v !== option.value);
    setSelectedValue(newValue);
  }
};

// 清除选择
const handleClear = (event: MouseEvent) => {
  event.stopPropagation();
  if (props.disabled) return;

  if (props.multiple) {
    setSelectedValue([]);
  } else {
    setSelectedValue('');
  }
  emit('clear');
};

// 搜索输入处理
const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchKeyword.value = target.value;
  activeIndex.value = -1;
  emit('search', target.value);
};

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else if (activeIndex.value >= 0 && activeIndex.value < filteredOptions.value.length) {
        const option = filteredOptions.value[activeIndex.value];
        if (option && !option.disabled) {
          selectOption(option);
        }
      }
      break;

    case 'Escape':
      event.preventDefault();
      closeDropdown();
      break;

    case 'ArrowDown':
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else {
        // 移动到下一个可选项
        const currentSelectableIndex = selectableIndices.value.indexOf(activeIndex.value);
        if (currentSelectableIndex < selectableIndices.value.length - 1) {
          activeIndex.value = selectableIndices.value[currentSelectableIndex + 1];
        } else if (selectableIndices.value.length > 0) {
          activeIndex.value = selectableIndices.value[0];
        }
      }
      break;

    case 'ArrowUp':
      event.preventDefault();
      if (isOpen.value) {
        // 移动到上一个可选项
        const currentSelectableIndex = selectableIndices.value.indexOf(activeIndex.value);
        if (currentSelectableIndex > 0) {
          activeIndex.value = selectableIndices.value[currentSelectableIndex - 1];
        } else if (selectableIndices.value.length > 0) {
          activeIndex.value = selectableIndices.value[selectableIndices.value.length - 1];
        }
      }
      break;

    case 'Tab':
      closeDropdown();
      break;
  }
};

// 聚焦处理
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

// 失焦处理
const handleBlur = (event: FocusEvent) => {
  // 检查新的焦点目标是否在组件内
  const relatedTarget = event.relatedTarget as HTMLElement;
  if (selectRef.value?.contains(relatedTarget)) {
    return;
  }
  
  isFocused.value = false;
  closeDropdown();
  emit('blur', event);
};

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    closeDropdown();
    isFocused.value = false;
  }
};

// 选择框点击
const handleSelectorClick = () => {
  if (props.disabled) return;
  toggleDropdown();
};

// 聚焦方法
const focus = () => {
  if (props.searchable && searchInputRef.value) {
    searchInputRef.value.focus();
  } else {
    selectorRef.value?.focus();
  }
};

// 失焦方法
const blur = () => {
  if (props.searchable && searchInputRef.value) {
    searchInputRef.value.blur();
  } else {
    selectorRef.value?.blur();
  }
};

// 滚动高亮项到视图
watch(activeIndex, (newIndex) => {
  if (newIndex >= 0 && dropdownRef.value) {
    const activeOption = dropdownRef.value.querySelector(
      `.chips-select__option:nth-child(${newIndex + 1})`
    );
    activeOption?.scrollIntoView({ block: 'nearest' });
  }
});

// 监听点击外部
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

// 暴露实例方法
defineExpose<SelectInstance>({
  $el: selectRef.value,
  focus,
  blur,
  open: openDropdown,
  close: closeDropdown,
});
</script>

<template>
  <div
    ref="selectRef"
    :class="selectClass"
    @keydown="handleKeydown"
  >
    <!-- 选择框 -->
    <div
      ref="selectorRef"
      class="chips-select__selector"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-disabled="disabled"
      :aria-controls="isOpen ? 'select-dropdown' : undefined"
      @click="handleSelectorClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- 已选区域 -->
      <div class="chips-select__selection">
        <!-- 多选模式：显示标签 -->
        <template v-if="multiple">
          <span
            v-for="option in displayTags"
            :key="option.value"
            class="chips-select__tag"
          >
            <span class="chips-select__tag-text">
              <slot name="tag" :option="option">
                {{ option.label }}
              </slot>
            </span>
            <span
              v-if="!disabled"
              class="chips-select__tag-close"
              role="button"
              :aria-label="`移除 ${option.label}`"
              @click="removeTag(option, $event)"
            >
              <slot name="clearIcon">
                <!-- 默认关闭图标由主题包提供 -->
              </slot>
            </span>
          </span>
          
          <!-- 剩余数量提示 -->
          <span
            v-if="restTagCount > 0"
            class="chips-select__tag chips-select__tag-rest"
          >
            +{{ restTagCount }}
          </span>
        </template>

        <!-- 单选模式：显示选中文本 -->
        <template v-else-if="selectedOptions.length > 0">
          <span class="chips-select__value">
            {{ selectedOptions[0].label }}
          </span>
        </template>

        <!-- 搜索输入框 -->
        <input
          v-if="searchable"
          ref="searchInputRef"
          class="chips-select__search"
          type="text"
          :value="searchKeyword"
          :disabled="disabled"
          :placeholder="showPlaceholder ? placeholder : ''"
          autocomplete="off"
          aria-autocomplete="list"
          @input="handleSearch"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <!-- 占位符 -->
        <span
          v-if="showPlaceholder && !searchable"
          class="chips-select__placeholder"
        >
          {{ placeholder }}
        </span>
      </div>

      <!-- 后缀图标区域 -->
      <span class="chips-select__suffix">
        <!-- 加载图标 -->
        <span
          v-if="loading"
          class="chips-select__spinner"
          aria-hidden="true"
        >
          <slot name="loading">
            <!-- 默认加载图标由主题包提供 -->
          </slot>
        </span>

        <!-- 清除图标 -->
        <span
          v-else-if="showClear"
          class="chips-select__clear"
          role="button"
          aria-label="清除"
          @click="handleClear"
        >
          <slot name="clearIcon">
            <!-- 默认清除图标由主题包提供 -->
          </slot>
        </span>

        <!-- 箭头图标 -->
        <span
          v-else
          class="chips-select__arrow"
          aria-hidden="true"
        >
          <slot name="arrow">
            <!-- 默认箭头图标由主题包提供 -->
          </slot>
        </span>
      </span>
    </div>

    <!-- 下拉菜单 -->
    <div
      v-show="isOpen"
      id="select-dropdown"
      ref="dropdownRef"
      class="chips-select__dropdown"
      role="listbox"
      :aria-multiselectable="multiple"
    >
      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="chips-select__loading"
      >
        <slot name="loading">
          <!-- 加载内容由主题包提供 -->
        </slot>
      </div>

      <!-- 空状态 -->
      <div
        v-else-if="filteredOptions.length === 0"
        class="chips-select__empty"
      >
        <slot name="empty">
          <!-- 空状态内容由主题包提供 -->
        </slot>
      </div>

      <!-- 选项列表 -->
      <template v-else>
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          :class="classNames('chips-select__option', {
            'chips-select__option--selected': isSelected(option),
            'chips-select__option--disabled': option.disabled,
            'chips-select__option--active': activeIndex === index,
          })"
          role="option"
          :aria-selected="isSelected(option)"
          :aria-disabled="option.disabled"
          @click="selectOption(option)"
          @mouseenter="activeIndex = index"
        >
          <slot name="option" :option="option" :selected="isSelected(option)">
            {{ option.label }}
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
