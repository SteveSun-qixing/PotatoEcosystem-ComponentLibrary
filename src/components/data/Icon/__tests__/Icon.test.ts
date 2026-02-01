import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Icon from '../Icon.vue';

describe('Icon', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Icon);

      expect(wrapper.find('span.chips-icon').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Icon);
      const icon = wrapper.find('span.chips-icon');

      expect(icon.classes()).toContain('chips-icon');
    });

    it('should render with name class', () => {
      const wrapper = mount(Icon, {
        props: { name: 'check' },
      });

      expect(wrapper.find('span.chips-icon').classes()).toContain('chips-icon--check');
    });
  });

  describe('size', () => {
    it('should set size as number', () => {
      const wrapper = mount(Icon, {
        props: { size: 24 },
      });
      const style = wrapper.find('span.chips-icon').attributes('style');

      expect(style).toContain('--chips-icon-size: 24px');
    });

    it('should set size as string', () => {
      const wrapper = mount(Icon, {
        props: { size: '2rem' },
      });
      const style = wrapper.find('span.chips-icon').attributes('style');

      expect(style).toContain('--chips-icon-size: 2rem');
    });
  });

  describe('color', () => {
    it('should set color', () => {
      const wrapper = mount(Icon, {
        props: { color: '#ff0000' },
      });
      const style = wrapper.find('span.chips-icon').attributes('style');

      expect(style).toContain('--chips-icon-color: #ff0000');
    });

    it('should set color with CSS variable', () => {
      const wrapper = mount(Icon, {
        props: { color: 'var(--primary-color)' },
      });
      const style = wrapper.find('span.chips-icon').attributes('style');

      expect(style).toContain('--chips-icon-color: var(--primary-color)');
    });
  });

  describe('spin', () => {
    it('should not have spin class by default', () => {
      const wrapper = mount(Icon);

      expect(wrapper.find('span.chips-icon').classes()).not.toContain('chips-icon--spin');
    });

    it('should have spin class when spin is true', () => {
      const wrapper = mount(Icon, {
        props: { spin: true },
      });

      expect(wrapper.find('span.chips-icon').classes()).toContain('chips-icon--spin');
    });
  });

  describe('rotate', () => {
    it('should not set rotate by default', () => {
      const wrapper = mount(Icon);
      const style = wrapper.find('span.chips-icon').attributes('style') || '';

      expect(style).not.toContain('--chips-icon-rotate');
    });

    it('should set rotate angle', () => {
      const wrapper = mount(Icon, {
        props: { rotate: 90 },
      });
      const style = wrapper.find('span.chips-icon').attributes('style');

      expect(style).toContain('--chips-icon-rotate: 90deg');
    });

    it('should set negative rotate angle', () => {
      const wrapper = mount(Icon, {
        props: { rotate: -45 },
      });
      const style = wrapper.find('span.chips-icon').attributes('style');

      expect(style).toContain('--chips-icon-rotate: -45deg');
    });
  });

  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Icon);

      await wrapper.find('span.chips-icon').trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.length).toBe(1);
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Icon, {
        slots: {
          default: '<svg class="custom-svg"><path d="M0 0h24v24H0z" /></svg>',
        },
      });

      expect(wrapper.find('.chips-icon__svg').exists()).toBe(true);
      expect(wrapper.find('.custom-svg').exists()).toBe(true);
    });

    it('should render SVG elements', () => {
      const wrapper = mount(Icon, {
        slots: {
          default: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>',
        },
      });

      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('circle').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have role="img"', () => {
      const wrapper = mount(Icon);

      expect(wrapper.find('span.chips-icon').attributes('role')).toBe('img');
    });

    it('should have aria-label when name is provided', () => {
      const wrapper = mount(Icon, {
        props: { name: 'check' },
      });

      expect(wrapper.find('span.chips-icon').attributes('aria-label')).toBe('check');
    });

    it('should have aria-hidden when no name or slot', () => {
      const wrapper = mount(Icon);

      expect(wrapper.find('span.chips-icon').attributes('aria-hidden')).toBe('true');
    });

    it('should not have aria-hidden when has slot', () => {
      const wrapper = mount(Icon, {
        slots: {
          default: '<svg><path /></svg>',
        },
      });

      expect(wrapper.find('span.chips-icon').attributes('aria-hidden')).toBe('false');
    });
  });

  describe('combined props', () => {
    it('should handle multiple props together', () => {
      const wrapper = mount(Icon, {
        props: {
          name: 'loading',
          size: 32,
          color: 'blue',
          spin: true,
          rotate: 45,
        },
      });
      const icon = wrapper.find('span.chips-icon');
      const style = icon.attributes('style');

      expect(icon.classes()).toContain('chips-icon--loading');
      expect(icon.classes()).toContain('chips-icon--spin');
      expect(style).toContain('--chips-icon-size: 32px');
      expect(style).toContain('--chips-icon-color: blue');
      expect(style).toContain('--chips-icon-rotate: 45deg');
    });
  });
});
