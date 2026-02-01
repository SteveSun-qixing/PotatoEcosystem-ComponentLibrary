<script setup lang="ts">
/**
 * Slider 滑块组件
 *
 * 无样式滑块组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-slider                   - 滑块容器
 * - .chips-slider__rail             - 轨道
 * - .chips-slider__track            - 已选择轨道
 * - .chips-slider__step             - 步长区域
 * - .chips-slider__handle           - 滑块手柄
 * - .chips-slider__handle--active   - 激活状态的手柄
 * - .chips-slider__handle--focus    - 聚焦状态的手柄
 * - .chips-slider__handle-1         - 第一个手柄（范围模式）
 * - .chips-slider__handle-2         - 第二个手柄（范围模式）
 * - .chips-slider__mark             - 刻度标记区域
 * - .chips-slider__mark-text        - 刻度标记文本
 * - .chips-slider__mark-text--active - 激活状态的刻度文本
 * - .chips-slider__dot              - 刻度点
 * - .chips-slider__dot--active      - 激活状态的刻度点
 * - .chips-slider__tooltip          - tooltip
 * - .chips-slider--vertical         - 垂直模式
 * - .chips-slider--disabled         - 禁用状态
 * - .chips-slider--with-marks       - 带刻度标记
 * - .chips-slider--range            - 范围模式
 */

import { computed, ref } from 'vue';
import type { SliderProps, SliderEmits, SliderInstance, SliderMark } from './types';
import { classNames } from '@/utils';

// Props
const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  range: false,
  vertical: false,
  showTooltip: true,
  dots: false,
  included: true,
  reverse: false,
});

// Emits
const emit = defineEmits<SliderEmits>();

// Refs
const sliderRef = ref<HTMLDivElement | null>(null);
const railRef = ref<HTMLDivElement | null>(null);
const handle1Ref = ref<HTMLDivElement | null>(null);
const handle2Ref = ref<HTMLDivElement | null>(null);

// 内部状态
const dragging = ref(false);
const activeHandle = ref<1 | 2 | null>(null);
const focusedHandle = ref<1 | 2 | null>(null);
const showTooltip1 = ref(false);
const showTooltip2 = ref(false);

// 获取默认值
const getDefaultValue = (): number | [number, number] => {
  if (props.defaultValue !== undefined) {
    return props.defaultValue;
  }
  return props.range ? [props.min, props.min] : props.min;
};

// 内部值
const internalValue = ref<number | [number, number]>(getDefaultValue());

// 当前值
const currentValue = computed({
  get: () => props.modelValue ?? internalValue.value,
  set: (value: number | [number, number]) => {
    internalValue.value = value;
    emit('update:modelValue', value);
  },
});

// 单值或范围值
const value1 = computed(() => {
  return Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value;
});

const value2 = computed(() => {
  return Array.isArray(currentValue.value) ? currentValue.value[1] : props.max;
});

// 计算百分比
const getPercent = (value: number): number => {
  const range = props.max - props.min;
  if (range === 0) return 0;
  const percent = ((value - props.min) / range) * 100;
  return props.reverse ? 100 - percent : percent;
};

// 百分比转值
const percentToValue = (percent: number): number => {
  const actualPercent = props.reverse ? 100 - percent : percent;
  const range = props.max - props.min;
  let value = props.min + (actualPercent / 100) * range;

  // 根据步长取整
  if (props.step > 0) {
    value = Math.round((value - props.min) / props.step) * props.step + props.min;
  }

  // 如果 dots 为 true，只能选择刻度值
  if (props.dots && props.marks) {
    const markValues = Object.keys(props.marks)
      .map(Number)
      .sort((a, b) => a - b);
    
    if (markValues.length > 0) {
      let closest = markValues[0]!;
      let minDistance = Math.abs(value - closest);

      for (const markValue of markValues) {
        const distance = Math.abs(value - markValue);
        if (distance < minDistance) {
          minDistance = distance;
          closest = markValue;
        }
      }
      value = closest;
    }
  }

  return Math.max(props.min, Math.min(props.max, value));
};

// track 样式位置
const trackStyle = computed(() => {
  if (props.range) {
    const start = getPercent(value1.value);
    const end = getPercent(value2.value);
    const low = Math.min(start, end);
    const high = Math.max(start, end);

    if (props.vertical) {
      return {
        [props.reverse ? 'top' : 'bottom']: `${low}%`,
        height: `${high - low}%`,
      };
    }
    return {
      [props.reverse ? 'right' : 'left']: `${low}%`,
      width: `${high - low}%`,
    };
  }

  const percent = getPercent(value1.value);
  if (props.vertical) {
    return {
      [props.reverse ? 'top' : 'bottom']: '0%',
      height: `${percent}%`,
    };
  }
  return {
    [props.reverse ? 'right' : 'left']: '0%',
    width: `${percent}%`,
  };
});

// handle 1 位置
const handle1Style = computed(() => {
  const percent = getPercent(value1.value);
  if (props.vertical) {
    return { [props.reverse ? 'top' : 'bottom']: `${percent}%` };
  }
  return { [props.reverse ? 'right' : 'left']: `${percent}%` };
});

// handle 2 位置
const handle2Style = computed(() => {
  const percent = getPercent(value2.value);
  if (props.vertical) {
    return { [props.reverse ? 'top' : 'bottom']: `${percent}%` };
  }
  return { [props.reverse ? 'right' : 'left']: `${percent}%` };
});

// 计算样式类名
const sliderClass = computed(() =>
  classNames('chips-slider', {
    'chips-slider--vertical': props.vertical,
    'chips-slider--disabled': props.disabled,
    'chips-slider--with-marks': !!props.marks,
    'chips-slider--range': props.range,
  })
);

// handle 类名
const getHandleClass = (index: 1 | 2) =>
  classNames('chips-slider__handle', `chips-slider__handle-${index}`, {
    'chips-slider__handle--active': activeHandle.value === index,
    'chips-slider__handle--focus': focusedHandle.value === index,
  });

// 格式化 tooltip
const formatTooltip = (value: number): string => {
  if (props.tooltipFormatter) {
    return props.tooltipFormatter(value);
  }
  return String(value);
};

// 是否显示 tooltip
const shouldShowTooltip = (index: 1 | 2): boolean => {
  if (props.showTooltip === 'always') return true;
  if (!props.showTooltip) return false;
  return index === 1 ? showTooltip1.value : showTooltip2.value;
};

// 获取刻度标记
const markList = computed(() => {
  if (!props.marks) return [];

  return Object.entries(props.marks).map(([key, value]) => {
    const numKey = Number(key);
    const isString = typeof value === 'string';
    return {
      value: numKey,
      label: isString ? value : (value as SliderMark).label,
      style: isString ? undefined : (value as SliderMark).style,
      percent: getPercent(numKey),
      active: props.included
        ? props.range
          ? numKey >= value1.value && numKey <= value2.value
          : numKey <= value1.value
        : false,
    };
  });
});

// 获取鼠标/触摸位置对应的百分比
const getPositionPercent = (event: MouseEvent | TouchEvent): number => {
  if (!railRef.value) return 0;

  const rect = railRef.value.getBoundingClientRect();
  let position: number = 0;

  if ('touches' in event && event.touches[0]) {
    position = props.vertical ? event.touches[0].clientY : event.touches[0].clientX;
  } else if ('clientX' in event) {
    position = props.vertical ? event.clientY : event.clientX;
  }

  if (props.vertical) {
    const percent = ((rect.bottom - position) / rect.height) * 100;
    return Math.max(0, Math.min(100, percent));
  }

  const percent = ((position - rect.left) / rect.width) * 100;
  return Math.max(0, Math.min(100, percent));
};

// 更新值
const updateValue = (newValue: number, handleIndex: 1 | 2) => {
  if (props.disabled) return;

  if (props.range) {
    const currentValues = [value1.value, value2.value];
    currentValues[handleIndex - 1] = newValue;

    // 确保值的顺序正确
    const sorted = [...currentValues].sort((a, b) => a - b) as [number, number];
    currentValue.value = sorted;
  } else {
    currentValue.value = newValue;
  }
};

// 开始拖拽
const handleDragStart = (event: MouseEvent | TouchEvent, handleIndex: 1 | 2) => {
  if (props.disabled) return;

  event.preventDefault();
  dragging.value = true;
  activeHandle.value = handleIndex;

  if (handleIndex === 1) {
    showTooltip1.value = true;
  } else {
    showTooltip2.value = true;
  }

  emit('dragStart', currentValue.value);

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.value) return;

    const percent = getPositionPercent(e);
    const newValue = percentToValue(percent);
    updateValue(newValue, handleIndex);
    emit('input', currentValue.value);
  };

  const onEnd = () => {
    dragging.value = false;
    activeHandle.value = null;
    showTooltip1.value = false;
    showTooltip2.value = false;

    emit('change', currentValue.value);
    emit('dragEnd', currentValue.value);

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('touchend', onEnd);
};

// 点击轨道
const handleRailClick = (event: MouseEvent) => {
  if (props.disabled) return;

  const percent = getPositionPercent(event);
  const newValue = percentToValue(percent);

  if (props.range) {
    // 判断应该移动哪个手柄
    const dist1 = Math.abs(newValue - value1.value);
    const dist2 = Math.abs(newValue - value2.value);
    updateValue(newValue, dist1 <= dist2 ? 1 : 2);
  } else {
    currentValue.value = newValue;
  }

  emit('change', currentValue.value);
};

// 键盘处理
const handleKeyDown = (event: KeyboardEvent, handleIndex: 1 | 2) => {
  if (props.disabled) return;

  let delta = 0;
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowRight':
      delta = props.step;
      break;
    case 'ArrowDown':
    case 'ArrowLeft':
      delta = -props.step;
      break;
    case 'PageUp':
      delta = props.step * 10;
      break;
    case 'PageDown':
      delta = -props.step * 10;
      break;
    case 'Home':
      updateValue(props.min, handleIndex);
      emit('change', currentValue.value);
      return;
    case 'End':
      updateValue(props.max, handleIndex);
      emit('change', currentValue.value);
      return;
    default:
      return;
  }

  event.preventDefault();
  const currentVal = handleIndex === 1 ? value1.value : value2.value;
  const newValue = Math.max(props.min, Math.min(props.max, currentVal + delta));
  updateValue(newValue, handleIndex);
  emit('change', currentValue.value);
};

// 聚焦处理
const handleFocus = (handleIndex: 1 | 2) => {
  focusedHandle.value = handleIndex;
  if (handleIndex === 1) {
    showTooltip1.value = true;
  } else {
    showTooltip2.value = true;
  }
};

// 失焦处理
const handleBlur = (handleIndex: 1 | 2) => {
  if (focusedHandle.value === handleIndex) {
    focusedHandle.value = null;
  }
  if (handleIndex === 1) {
    showTooltip1.value = false;
  } else {
    showTooltip2.value = false;
  }
};

// 聚焦
const focus = () => {
  handle1Ref.value?.focus();
};

// 失焦
const blur = () => {
  handle1Ref.value?.blur();
  handle2Ref.value?.blur();
};

// 暴露实例方法
defineExpose<SliderInstance>({
  $el: sliderRef.value,
  focus,
  blur,
});
</script>

<template>
  <div
    ref="sliderRef"
    :class="sliderClass"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="!range ? value1 : undefined"
    :aria-disabled="disabled"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <!-- 轨道 -->
    <div
      ref="railRef"
      class="chips-slider__rail"
      @click="handleRailClick"
    >
      <!-- 已选择轨道 -->
      <div
        class="chips-slider__track"
        :style="trackStyle"
      />

      <!-- 刻度点 -->
      <div
        v-if="marks"
        class="chips-slider__step"
      >
        <span
          v-for="mark in markList"
          :key="mark.value"
          :class="[
            'chips-slider__dot',
            { 'chips-slider__dot--active': mark.active },
          ]"
          :style="{
            [vertical ? (reverse ? 'top' : 'bottom') : (reverse ? 'right' : 'left')]: `${mark.percent}%`,
          }"
        />
      </div>

      <!-- 手柄 1 -->
      <div
        ref="handle1Ref"
        :class="getHandleClass(1)"
        :style="handle1Style"
        tabindex="0"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="range ? value2 : max"
        :aria-valuenow="value1"
        :aria-disabled="disabled"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        @mousedown="handleDragStart($event, 1)"
        @touchstart="handleDragStart($event, 1)"
        @keydown="handleKeyDown($event, 1)"
        @focus="handleFocus(1)"
        @blur="handleBlur(1)"
      >
        <!-- Tooltip 1 -->
        <div
          v-if="shouldShowTooltip(1)"
          class="chips-slider__tooltip"
        >
          <slot
            name="tooltip"
            :value="value1"
          >
            {{ formatTooltip(value1) }}
          </slot>
        </div>
      </div>

      <!-- 手柄 2（范围模式） -->
      <div
        v-if="range"
        ref="handle2Ref"
        :class="getHandleClass(2)"
        :style="handle2Style"
        tabindex="0"
        role="slider"
        :aria-valuemin="value1"
        :aria-valuemax="max"
        :aria-valuenow="value2"
        :aria-disabled="disabled"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        @mousedown="handleDragStart($event, 2)"
        @touchstart="handleDragStart($event, 2)"
        @keydown="handleKeyDown($event, 2)"
        @focus="handleFocus(2)"
        @blur="handleBlur(2)"
      >
        <!-- Tooltip 2 -->
        <div
          v-if="shouldShowTooltip(2)"
          class="chips-slider__tooltip"
        >
          <slot
            name="tooltip"
            :value="value2"
          >
            {{ formatTooltip(value2) }}
          </slot>
        </div>
      </div>
    </div>

    <!-- 刻度标记 -->
    <div
      v-if="marks"
      class="chips-slider__mark"
    >
      <span
        v-for="mark in markList"
        :key="mark.value"
        :class="[
          'chips-slider__mark-text',
          { 'chips-slider__mark-text--active': mark.active },
        ]"
        :style="{
          [vertical ? (reverse ? 'top' : 'bottom') : (reverse ? 'right' : 'left')]: `${mark.percent}%`,
          ...mark.style,
        }"
      >
        <slot
          name="mark"
          :label="mark.label"
          :value="mark.value"
        >
          {{ mark.label }}
        </slot>
      </span>
    </div>
  </div>
</template>

<!-- 不包含任何样式 -->
