import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '../Badge.vue';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
      });

      expect(wrapper.find('.chips-badge').exists()).toBe(true);
      expect(wrapper.find('.chips-badge__count').text()).toBe('5');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
      });

      expect(wrapper.find('.chips-badge').classes()).toContain('chips-badge');
    });

    it('should render child content', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
        slots: {
          default: '<span class="child">Content</span>',
        },
      });

      expect(wrapper.find('.child').exists()).toBe(true);
    });
  });

  describe('count', () => {
    it('should display numeric count', () => {
      const wrapper = mount(Badge, {
        props: { count: 10 },
      });

      expect(wrapper.find('.chips-badge__count').text()).toBe('10');
    });

    it('should display string count', () => {
      const wrapper = mount(Badge, {
        props: { count: 'new' },
      });

      expect(wrapper.find('.chips-badge__count').text()).toBe('new');
    });

    it('should not show badge when count is 0 by default', () => {
      const wrapper = mount(Badge, {
        props: { count: 0 },
      });

      expect(wrapper.find('.chips-badge__count').exists()).toBe(false);
    });

    it('should show badge when count is 0 and showZero is true', () => {
      const wrapper = mount(Badge, {
        props: { count: 0, showZero: true },
      });

      expect(wrapper.find('.chips-badge__count').exists()).toBe(true);
      expect(wrapper.find('.chips-badge__count').text()).toBe('0');
    });
  });

  describe('overflowCount', () => {
    it('should display count as-is when below overflowCount', () => {
      const wrapper = mount(Badge, {
        props: { count: 50, overflowCount: 99 },
      });

      expect(wrapper.find('.chips-badge__count').text()).toBe('50');
    });

    it('should display overflowCount+ when count exceeds overflowCount', () => {
      const wrapper = mount(Badge, {
        props: { count: 100, overflowCount: 99 },
      });

      expect(wrapper.find('.chips-badge__count').text()).toBe('99+');
    });

    it('should use custom overflowCount', () => {
      const wrapper = mount(Badge, {
        props: { count: 15, overflowCount: 10 },
      });

      expect(wrapper.find('.chips-badge__count').text()).toBe('10+');
    });
  });

  describe('dot mode', () => {
    it('should render dot instead of count when dot is true', () => {
      const wrapper = mount(Badge, {
        props: { dot: true },
      });

      expect(wrapper.find('.chips-badge__dot').exists()).toBe(true);
      expect(wrapper.find('.chips-badge__count').exists()).toBe(false);
      expect(wrapper.find('.chips-badge').classes()).toContain('chips-badge--dot');
    });

    it('should render dot with child content', () => {
      const wrapper = mount(Badge, {
        props: { dot: true },
        slots: {
          default: '<span class="child">Child</span>',
        },
      });

      expect(wrapper.find('.chips-badge__dot').exists()).toBe(true);
      expect(wrapper.find('.child').exists()).toBe(true);
    });
  });

  describe('status mode', () => {
    it.each([
      ['success', 'chips-badge-status--success'],
      ['processing', 'chips-badge-status--processing'],
      ['default', 'chips-badge-status--default'],
      ['error', 'chips-badge-status--error'],
      ['warning', 'chips-badge-status--warning'],
    ] as const)('should render %s status', (status, expectedClass) => {
      const wrapper = mount(Badge, {
        props: { status },
      });

      expect(wrapper.find('.chips-badge').classes()).toContain('chips-badge--status');
      expect(wrapper.find('.chips-badge__status').classes()).toContain(expectedClass);
    });

    it('should render status text', () => {
      const wrapper = mount(Badge, {
        props: { status: 'success', text: 'Success' },
      });

      expect(wrapper.find('.chips-badge__text').text()).toBe('Success');
    });

    it('should not render text when not provided', () => {
      const wrapper = mount(Badge, {
        props: { status: 'success' },
      });

      expect(wrapper.find('.chips-badge__text').exists()).toBe(false);
    });
  });

  describe('standalone mode', () => {
    it('should have standalone class when no default slot', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
      });

      expect(wrapper.find('.chips-badge').classes()).toContain('chips-badge--standalone');
    });

    it('should not have standalone class when default slot is provided', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
        slots: {
          default: '<span>Content</span>',
        },
      });

      expect(wrapper.find('.chips-badge').classes()).not.toContain('chips-badge--standalone');
    });
  });

  describe('offset', () => {
    it('should apply offset CSS variables', () => {
      const wrapper = mount(Badge, {
        props: { count: 5, offset: [10, 20] },
      });
      const style = wrapper.find('.chips-badge').attributes('style');

      expect(style).toContain('--chips-badge-offset-x: 10px');
      expect(style).toContain('--chips-badge-offset-y: 20px');
    });
  });

  describe('color', () => {
    it('should apply custom color CSS variable', () => {
      const wrapper = mount(Badge, {
        props: { count: 5, color: '#ff0000' },
      });
      const style = wrapper.find('.chips-badge').attributes('style');

      expect(style).toContain('--chips-badge-color: #ff0000');
    });
  });

  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
      });

      await wrapper.find('.chips-badge').trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.length).toBe(1);
    });
  });

  describe('slots', () => {
    it('should render default slot', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
        slots: {
          default: '<span class="custom-content">Custom</span>',
        },
      });

      expect(wrapper.find('.custom-content').exists()).toBe(true);
    });

    it('should render count slot', () => {
      const wrapper = mount(Badge, {
        props: { count: 5 },
        slots: {
          count: '<span class="custom-count">★</span>',
        },
      });

      expect(wrapper.find('.chips-badge__count .custom-count').exists()).toBe(true);
    });
  });

  describe('combined props', () => {
    it('should handle multiple props together', () => {
      const wrapper = mount(Badge, {
        props: {
          count: 100,
          overflowCount: 99,
          color: '#52c41a',
          offset: [5, 5],
        },
        slots: {
          default: '<span class="child">Child</span>',
        },
      });

      expect(wrapper.find('.chips-badge__count').text()).toBe('99+');
      expect(wrapper.find('.child').exists()).toBe(true);
      expect(wrapper.find('.chips-badge').classes()).not.toContain('chips-badge--standalone');
    });

    it('should prefer dot mode over count', () => {
      const wrapper = mount(Badge, {
        props: {
          count: 100,
          dot: true,
        },
      });

      expect(wrapper.find('.chips-badge__dot').exists()).toBe(true);
      expect(wrapper.find('.chips-badge__count').exists()).toBe(false);
    });
  });
});
