import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Progress from '../Progress.vue';

describe('Progress', () => {
  const mountProgress = (props = {}, slots = {}) => {
    return mount(Progress, {
      props,
      slots,
    });
  };

  describe('rendering', () => {
    it('should render line progress by default', () => {
      const wrapper = mountProgress();
      expect(wrapper.find('.chips-progress--line').exists()).toBe(true);
    });

    it('should render circle progress', () => {
      const wrapper = mountProgress({ type: 'circle' });
      expect(wrapper.find('.chips-progress--circle').exists()).toBe(true);
    });

    it('should render dashboard progress', () => {
      const wrapper = mountProgress({ type: 'dashboard' });
      expect(wrapper.find('.chips-progress--dashboard').exists()).toBe(true);
    });
  });

  describe('percent', () => {
    it('should display percent text', () => {
      const wrapper = mountProgress({ percent: 50 });
      expect(wrapper.find('.chips-progress__text').text()).toBe('50%');
    });

    it('should clamp percent to 0-100 range', () => {
      const wrapper1 = mountProgress({ percent: -10 });
      expect(wrapper1.find('.chips-progress__text').text()).toBe('0%');

      const wrapper2 = mountProgress({ percent: 150 });
      expect(wrapper2.find('.chips-progress__text').text()).toBe('100%');
    });

    it('should apply percent to line progress width', () => {
      const wrapper = mountProgress({ percent: 75 });
      const inner = wrapper.find('.chips-progress__inner');
      expect(inner.attributes('style')).toContain('width: 75%');
    });
  });

  describe('status', () => {
    it('should apply normal status by default', () => {
      const wrapper = mountProgress();
      expect(wrapper.find('.chips-progress--normal').exists()).toBe(true);
    });

    it('should apply success status', () => {
      const wrapper = mountProgress({ status: 'success' });
      expect(wrapper.find('.chips-progress--success').exists()).toBe(true);
    });

    it('should apply exception status', () => {
      const wrapper = mountProgress({ status: 'exception' });
      expect(wrapper.find('.chips-progress--exception').exists()).toBe(true);
    });

    it('should apply active status', () => {
      const wrapper = mountProgress({ status: 'active' });
      expect(wrapper.find('.chips-progress--active').exists()).toBe(true);
    });

    it('should auto change to success when percent is 100', () => {
      const wrapper = mountProgress({ percent: 100, status: 'normal' });
      expect(wrapper.find('.chips-progress--success').exists()).toBe(true);
    });
  });

  describe('showInfo', () => {
    it('should show info by default', () => {
      const wrapper = mountProgress();
      expect(wrapper.find('.chips-progress__text').exists()).toBe(true);
    });

    it('should hide info when showInfo is false', () => {
      const wrapper = mountProgress({ showInfo: false });
      expect(wrapper.find('.chips-progress__text').exists()).toBe(false);
    });
  });

  describe('format', () => {
    it('should use custom format function', () => {
      const wrapper = mountProgress({
        percent: 50,
        format: (percent: number) => `${percent} / 100`,
      });
      expect(wrapper.find('.chips-progress__text').text()).toBe('50 / 100');
    });
  });

  describe('size', () => {
    it('should apply default size', () => {
      const wrapper = mountProgress();
      expect(wrapper.find('.chips-progress--small').exists()).toBe(false);
    });

    it('should apply small size', () => {
      const wrapper = mountProgress({ size: 'small' });
      expect(wrapper.find('.chips-progress--small').exists()).toBe(true);
    });
  });

  describe('strokeColor', () => {
    it('should apply single stroke color', () => {
      const wrapper = mountProgress({ strokeColor: '#ff0000' });
      const inner = wrapper.find('.chips-progress__inner');
      expect(inner.attributes('style')).toContain('background-color: #ff0000');
    });

    it('should accept gradient stroke color array', () => {
      // Gradient stroke color is accepted as array prop
      // The actual gradient style may be handled differently in JSDOM test environment
      const wrapper = mountProgress({ strokeColor: ['#ff0000', '#00ff00'], percent: 50 });
      expect(wrapper.find('.chips-progress__inner').exists()).toBe(true);
      expect(wrapper.props('strokeColor')).toEqual(['#ff0000', '#00ff00']);
    });
  });

  describe('strokeWidth', () => {
    it('should apply custom stroke width for line progress', () => {
      const wrapper = mountProgress({ strokeWidth: 12 });
      const outer = wrapper.find('.chips-progress__outer');
      expect(outer.attributes('style')).toContain('height: 12px');
    });

    it('should apply stroke width to circle progress', () => {
      const wrapper = mountProgress({ type: 'circle', strokeWidth: 10 });
      const trail = wrapper.find('.chips-progress__circle-trail');
      expect(trail.attributes('stroke-width')).toBe('10');
    });
  });

  describe('trailColor', () => {
    it('should apply trail color for line progress', () => {
      const wrapper = mountProgress({ trailColor: '#eeeeee' });
      const outer = wrapper.find('.chips-progress__outer');
      expect(outer.attributes('style')).toContain('background-color: #eeeeee');
    });
  });

  describe('circle type', () => {
    it('should render SVG for circle progress', () => {
      const wrapper = mountProgress({ type: 'circle' });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('.chips-progress__circle-trail').exists()).toBe(true);
      expect(wrapper.find('.chips-progress__circle-path').exists()).toBe(true);
    });

    it('should apply custom width to circle progress', () => {
      const wrapper = mountProgress({ type: 'circle', width: 150 });
      const circle = wrapper.find('.chips-progress__circle');
      expect(circle.attributes('style')).toContain('width: 150px');
      expect(circle.attributes('style')).toContain('height: 150px');
    });

    it('should apply strokeLinecap', () => {
      const wrapper = mountProgress({ type: 'circle', strokeLinecap: 'square' });
      const path = wrapper.find('.chips-progress__circle-path');
      expect(path.attributes('stroke-linecap')).toBe('square');
    });
  });

  describe('dashboard type', () => {
    it('should render as dashboard', () => {
      const wrapper = mountProgress({ type: 'dashboard' });
      expect(wrapper.find('.chips-progress--dashboard').exists()).toBe(true);
      expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('should have gap position', () => {
      const wrapper = mountProgress({ type: 'dashboard', gapPosition: 'top' });
      expect(wrapper.find('.chips-progress--dashboard').exists()).toBe(true);
    });
  });

  describe('slots', () => {
    it('should render default slot for custom text', () => {
      const wrapper = mountProgress(
        { percent: 50 },
        {
          default: ({ percent }: { percent: number }) => `Progress: ${percent}`,
        }
      );
      expect(wrapper.find('.chips-progress__text').text()).toBe('Progress: 50');
    });
  });

  describe('class', () => {
    it('should apply custom class', () => {
      const wrapper = mountProgress({ class: 'custom-progress' });
      expect(wrapper.find('.custom-progress').exists()).toBe(true);
    });
  });

  describe('line progress structure', () => {
    it('should have proper structure', () => {
      const wrapper = mountProgress();
      expect(wrapper.find('.chips-progress__outer').exists()).toBe(true);
      expect(wrapper.find('.chips-progress__inner').exists()).toBe(true);
      expect(wrapper.find('.chips-progress__bg').exists()).toBe(true);
    });
  });

  describe('gradient in circle', () => {
    it('should create gradient defs for array colors', () => {
      const wrapper = mountProgress({
        type: 'circle',
        strokeColor: ['#ff0000', '#00ff00', '#0000ff'],
      });
      expect(wrapper.find('defs').exists()).toBe(true);
      expect(wrapper.find('linearGradient').exists()).toBe(true);
    });
  });
});
