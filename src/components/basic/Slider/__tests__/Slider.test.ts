/**
 * Slider 组件测试
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Slider from '../Slider.vue';

describe('Slider', () => {
  describe('渲染', () => {
    it('应该渲染正确的基础类名', () => {
      const wrapper = mount(Slider);
      const slider = wrapper.find('.chips-slider');

      expect(slider.exists()).toBe(true);
    });

    it('应该在垂直模式下渲染正确的类名', () => {
      const wrapper = mount(Slider, {
        props: {
          vertical: true,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.classes()).toContain('chips-slider--vertical');
    });

    it('应该在禁用状态下渲染正确的类名', () => {
      const wrapper = mount(Slider, {
        props: {
          disabled: true,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.classes()).toContain('chips-slider--disabled');
    });

    it('应该在范围模式下渲染正确的类名', () => {
      const wrapper = mount(Slider, {
        props: {
          range: true,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.classes()).toContain('chips-slider--range');
    });

    it('应该在有刻度时渲染正确的类名', () => {
      const wrapper = mount(Slider, {
        props: {
          marks: {
            0: '0%',
            50: '50%',
            100: '100%',
          },
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.classes()).toContain('chips-slider--with-marks');
    });

    it('应该渲染轨道', () => {
      const wrapper = mount(Slider);

      expect(wrapper.find('.chips-slider__rail').exists()).toBe(true);
      expect(wrapper.find('.chips-slider__track').exists()).toBe(true);
    });

    it('应该渲染手柄', () => {
      const wrapper = mount(Slider);

      expect(wrapper.find('.chips-slider__handle').exists()).toBe(true);
    });

    it('范围模式应该渲染两个手柄', () => {
      const wrapper = mount(Slider, {
        props: {
          range: true,
        },
      });

      expect(wrapper.findAll('.chips-slider__handle').length).toBe(2);
    });
  });

  describe('值处理', () => {
    it('应该使用默认值', () => {
      const wrapper = mount(Slider, {
        props: {
          defaultValue: 50,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      expect(handle.attributes('aria-valuenow')).toBe('50');
    });

    it('应该使用 modelValue', () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 30,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      expect(handle.attributes('aria-valuenow')).toBe('30');
    });

    it('范围模式应该处理数组值', () => {
      const wrapper = mount(Slider, {
        props: {
          range: true,
          modelValue: [20, 80] as [number, number],
        },
      });

      const handles = wrapper.findAll('.chips-slider__handle');
      expect(handles[0]!.attributes('aria-valuenow')).toBe('20');
      expect(handles[1]!.attributes('aria-valuenow')).toBe('80');
    });
  });

  describe('键盘交互', () => {
    it('按右箭头应该增加值', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          step: 1,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([51]);
    });

    it('按左箭头应该减少值', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          step: 1,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([49]);
    });

    it('按 Home 应该设置为最小值', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          min: 0,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'Home' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([0]);
    });

    it('按 End 应该设置为最大值', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          max: 100,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'End' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([100]);
    });

    it('禁用状态下键盘操作不应生效', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          disabled: true,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('步长', () => {
    it('应该根据步长调整值', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          step: 10,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([60]);
    });
  });

  describe('刻度标记', () => {
    it('应该渲染刻度标记', () => {
      const wrapper = mount(Slider, {
        props: {
          marks: {
            0: '0%',
            50: '50%',
            100: '100%',
          },
        },
      });

      expect(wrapper.find('.chips-slider__mark').exists()).toBe(true);
      expect(wrapper.findAll('.chips-slider__mark-text').length).toBe(3);
    });

    it('应该渲染刻度点', () => {
      const wrapper = mount(Slider, {
        props: {
          marks: {
            0: '0%',
            50: '50%',
            100: '100%',
          },
        },
      });

      expect(wrapper.findAll('.chips-slider__dot').length).toBe(3);
    });

    it('应该标记激活的刻度', () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          marks: {
            0: '0%',
            25: '25%',
            50: '50%',
            75: '75%',
            100: '100%',
          },
        },
      });

      const activeDots = wrapper.findAll('.chips-slider__dot--active');
      // 0, 25, 50 应该是激活的
      expect(activeDots.length).toBe(3);
    });
  });

  describe('Tooltip', () => {
    it('showTooltip 为 false 时不应显示 tooltip', () => {
      const wrapper = mount(Slider, {
        props: {
          showTooltip: false,
        },
      });

      expect(wrapper.find('.chips-slider__tooltip').exists()).toBe(false);
    });

    it('showTooltip 为 always 时应始终显示 tooltip', () => {
      const wrapper = mount(Slider, {
        props: {
          showTooltip: 'always',
        },
      });

      expect(wrapper.find('.chips-slider__tooltip').exists()).toBe(true);
    });

    it('应该使用自定义格式化函数', () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
          showTooltip: 'always',
          tooltipFormatter: (value: number) => `${value}%`,
        },
      });

      expect(wrapper.find('.chips-slider__tooltip').text()).toBe('50%');
    });
  });

  describe('聚焦状态', () => {
    it('聚焦时应该添加 focus 类名', async () => {
      const wrapper = mount(Slider);

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('focus');

      expect(handle.classes()).toContain('chips-slider__handle--focus');
    });

    it('失焦时应该移除 focus 类名', async () => {
      const wrapper = mount(Slider);

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('focus');
      await handle.trigger('blur');

      expect(handle.classes()).not.toContain('chips-slider__handle--focus');
    });
  });

  describe('无障碍', () => {
    it('应该有正确的 role 属性', () => {
      const wrapper = mount(Slider);
      const slider = wrapper.find('.chips-slider');

      expect(slider.attributes('role')).toBe('slider');
    });

    it('应该有正确的 aria-valuemin 属性', () => {
      const wrapper = mount(Slider, {
        props: {
          min: 10,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.attributes('aria-valuemin')).toBe('10');
    });

    it('应该有正确的 aria-valuemax 属性', () => {
      const wrapper = mount(Slider, {
        props: {
          max: 200,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.attributes('aria-valuemax')).toBe('200');
    });

    it('应该有正确的 aria-valuenow 属性', () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.attributes('aria-valuenow')).toBe('50');
    });

    it('禁用时应该有 aria-disabled 属性', () => {
      const wrapper = mount(Slider, {
        props: {
          disabled: true,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.attributes('aria-disabled')).toBe('true');
    });

    it('垂直模式应该有正确的 aria-orientation', () => {
      const wrapper = mount(Slider, {
        props: {
          vertical: true,
        },
      });
      const slider = wrapper.find('.chips-slider');

      expect(slider.attributes('aria-orientation')).toBe('vertical');
    });

    it('手柄应该有正确的 tabindex', () => {
      const wrapper = mount(Slider);

      const handle = wrapper.find('.chips-slider__handle');
      expect(handle.attributes('tabindex')).toBe('0');
    });
  });

  describe('事件', () => {
    it('应该触发 change 事件', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('应该触发 update:modelValue 事件', async () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: 50,
        },
      });

      const handle = wrapper.find('.chips-slider__handle');
      await handle.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });
  });

  describe('范围模式交互', () => {
    it('两个手柄应该可以独立操作', async () => {
      const wrapper = mount(Slider, {
        props: {
          range: true,
          modelValue: [20, 80] as [number, number],
        },
      });

      const handles = wrapper.findAll('.chips-slider__handle');

      // 操作第一个手柄
      await handles[0]!.trigger('keydown', { key: 'ArrowRight' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([[21, 80]]);
    });

    it('第二个手柄应该可以操作', async () => {
      const wrapper = mount(Slider, {
        props: {
          range: true,
          modelValue: [20, 80] as [number, number],
        },
      });

      const handles = wrapper.findAll('.chips-slider__handle');

      // 操作第二个手柄
      await handles[1]!.trigger('keydown', { key: 'ArrowLeft' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([[20, 79]]);
    });
  });
});
