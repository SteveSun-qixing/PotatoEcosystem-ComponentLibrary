<script setup lang="ts">
/**
 * Progress 进度条组件
 *
 * 无样式进度条组件，所有视觉效果由主题包提供
 *
 * 样式接口点:
 * - .chips-progress              - 进度条容器
 * - .chips-progress__outer       - 外层容器（line 类型）
 * - .chips-progress__inner       - 内层容器（line 类型）
 * - .chips-progress__bg          - 进度条背景
 * - .chips-progress__text        - 进度文本
 * - .chips-progress__circle      - 圆形进度条容器
 * - .chips-progress__circle-trail - 圆形背景轨道
 * - .chips-progress__circle-path - 圆形进度路径
 * - .chips-progress--line        - 线性进度条
 * - .chips-progress--circle      - 圆形进度条
 * - .chips-progress--dashboard   - 仪表盘进度条
 * - .chips-progress--normal      - 正常状态
 * - .chips-progress--success     - 成功状态
 * - .chips-progress--exception   - 异常状态
 * - .chips-progress--active      - 活动状态
 * - .chips-progress--small       - 小尺寸
 */

import { computed } from 'vue';
import type { ProgressProps, ProgressEmits } from './types';
import { classNames, clamp } from '@/utils';

// Props
const props = withDefaults(defineProps<ProgressProps>(), {
  percent: 0,
  type: 'line',
  status: 'normal',
  strokeWidth: 8,
  showInfo: true,
  size: 'default',
  width: 120,
  strokeLinecap: 'round',
  gapDegree: 75,
  gapPosition: 'bottom',
});

// Emits
const emit = defineEmits<ProgressEmits>();

// 计算有效百分比（0-100 范围内）
const validPercent = computed(() => clamp(props.percent, 0, 100));

// 计算进度条容器类名
const progressClass = computed(() =>
  classNames(
    'chips-progress',
    `chips-progress--${props.type}`,
    `chips-progress--${computedStatus.value}`,
    {
      'chips-progress--small': props.size === 'small',
    },
    props.class
  )
);

// 计算实际状态（100% 时自动设为 success）
const computedStatus = computed(() => {
  if (validPercent.value === 100 && props.status === 'normal') {
    return 'success';
  }
  return props.status;
});

// 格式化显示文本
const displayText = computed(() => {
  if (props.format) {
    return props.format(validPercent.value);
  }
  return `${validPercent.value}%`;
});

// 线性进度条样式
const lineInnerStyle = computed(() => {
  const style: Record<string, string> = {
    width: `${validPercent.value}%`,
  };

  if (props.strokeColor) {
    if (Array.isArray(props.strokeColor)) {
      style.backgroundImage = `linear-gradient(to right, ${props.strokeColor.join(', ')})`;
    } else {
      style.backgroundColor = props.strokeColor;
    }
  }

  return style;
});

// 线性进度条外层样式
const lineOuterStyle = computed(() => {
  const style: Record<string, string> = {};
  
  if (props.strokeWidth) {
    style.height = `${props.strokeWidth}px`;
  }
  
  if (props.trailColor) {
    style.backgroundColor = props.trailColor;
  }

  return style;
});

// 圆形进度条配置
const circleConfig = computed(() => {
  const radius = 50 - props.strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 根据缺口角度计算仪表盘
  let gapRatio = 0;
  if (props.type === 'dashboard') {
    gapRatio = props.gapDegree / 360;
  }
  
  const availableLength = circumference * (1 - gapRatio);
  const dashOffset = availableLength * (1 - validPercent.value / 100);
  
  // 计算旋转起始位置
  let rotation = 0;
  if (props.type === 'dashboard') {
    const gapHalf = props.gapDegree / 2;
    switch (props.gapPosition) {
      case 'top':
        rotation = -90 + gapHalf;
        break;
      case 'bottom':
        rotation = 90 + gapHalf;
        break;
      case 'left':
        rotation = 180 + gapHalf;
        break;
      case 'right':
        rotation = gapHalf;
        break;
    }
  } else {
    rotation = -90;
  }

  return {
    radius,
    circumference,
    availableLength,
    dashOffset,
    rotation,
    viewBox: '0 0 100 100',
    cx: 50,
    cy: 50,
  };
});

// 圆形进度条轨道样式
const circleTrailStyle = computed(() => {
  const { circumference, availableLength, rotation } = circleConfig.value;
  
  const style: Record<string, string> = {
    strokeDasharray: `${availableLength}px ${circumference}px`,
    strokeDashoffset: '0',
    transform: `rotate(${rotation}deg)`,
    transformOrigin: '50% 50%',
  };
  
  if (props.trailColor) {
    style.stroke = props.trailColor;
  }

  return style;
});

// 圆形进度条路径样式
const circlePathStyle = computed(() => {
  const { circumference, availableLength, dashOffset, rotation } = circleConfig.value;
  
  const style: Record<string, string> = {
    strokeDasharray: `${availableLength}px ${circumference}px`,
    strokeDashoffset: `${dashOffset}px`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: '50% 50%',
  };
  
  if (props.strokeColor) {
    if (Array.isArray(props.strokeColor)) {
      // 渐变色需要用 SVG linearGradient，这里简化处理使用第一个颜色
      style.stroke = props.strokeColor[0];
    } else {
      style.stroke = props.strokeColor;
    }
  }

  return style;
});

// 圆形进度条容器样式
const circleContainerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.width}px`,
}));

// 是否为圆形类型
const isCircleType = computed(() => props.type === 'circle' || props.type === 'dashboard');
</script>

<template>
  <div :class="progressClass">
    <!-- 线性进度条 -->
    <template v-if="type === 'line'">
      <div
        class="chips-progress__outer"
        :style="lineOuterStyle"
      >
        <div
          class="chips-progress__inner"
          :style="lineInnerStyle"
        >
          <div class="chips-progress__bg" />
        </div>
      </div>
      <span
        v-if="showInfo"
        class="chips-progress__text"
      >
        <slot :percent="validPercent">
          {{ displayText }}
        </slot>
      </span>
    </template>

    <!-- 圆形/仪表盘进度条 -->
    <template v-else-if="isCircleType">
      <div
        class="chips-progress__circle"
        :style="circleContainerStyle"
      >
        <svg
          :viewBox="circleConfig.viewBox"
          class="chips-progress__circle-svg"
        >
          <!-- 渐变定义（如果有渐变色） -->
          <defs v-if="Array.isArray(strokeColor) && strokeColor.length > 1">
            <linearGradient
              id="progress-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                v-for="(color, index) in strokeColor"
                :key="index"
                :offset="`${(index / (strokeColor.length - 1)) * 100}%`"
                :stop-color="color"
              />
            </linearGradient>
          </defs>
          
          <!-- 背景轨道 -->
          <circle
            class="chips-progress__circle-trail"
            :cx="circleConfig.cx"
            :cy="circleConfig.cy"
            :r="circleConfig.radius"
            fill="none"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :style="circleTrailStyle"
          />
          
          <!-- 进度路径 -->
          <circle
            class="chips-progress__circle-path"
            :cx="circleConfig.cx"
            :cy="circleConfig.cy"
            :r="circleConfig.radius"
            fill="none"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke="Array.isArray(strokeColor) && strokeColor.length > 1 ? 'url(#progress-gradient)' : undefined"
            :style="circlePathStyle"
          />
        </svg>
        
        <!-- 进度文本 -->
        <span
          v-if="showInfo"
          class="chips-progress__text"
        >
          <slot :percent="validPercent">
            {{ displayText }}
          </slot>
        </span>
      </div>
    </template>
  </div>
</template>

<!-- 不包含任何样式 -->
