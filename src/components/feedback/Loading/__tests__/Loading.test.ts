import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Loading from '../Loading.vue';

describe('Loading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('should render correctly when loading is true', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
      });

      expect(wrapper.find('.chips-loading').exists()).toBe(true);
      expect(wrapper.find('.chips-loading__content').exists()).toBe(true);
      expect(wrapper.find('.chips-loading__spinner').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
      });

      expect(wrapper.find('.chips-loading').classes()).toContain('chips-loading');
      expect(wrapper.find('.chips-loading').classes()).toContain('chips-loading--default');
      expect(wrapper.find('.chips-loading').classes()).toContain('chips-loading--active');
    });

    it('should not show content when loading is false', () => {
      const wrapper = mount(Loading, {
        props: { loading: false },
      });

      expect(wrapper.find('.chips-loading__content').exists()).toBe(false);
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-loading--small'],
      ['default', 'chips-loading--default'],
      ['large', 'chips-loading--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(Loading, {
        props: { loading: true, size },
      });

      expect(wrapper.find('.chips-loading').classes()).toContain(expectedClass);
    });
  });

  describe('tip', () => {
    it('should render tip text', () => {
      const wrapper = mount(Loading, {
        props: { loading: true, tip: 'Loading...' },
      });

      expect(wrapper.find('.chips-loading__text').exists()).toBe(true);
      expect(wrapper.find('.chips-loading__text').text()).toBe('Loading...');
    });

    it('should not render tip element when tip is not provided', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
      });

      expect(wrapper.find('.chips-loading__text').exists()).toBe(false);
    });

    it('should render tip slot', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
        slots: {
          tip: '<span class="custom-tip">Custom tip</span>',
        },
      });

      expect(wrapper.find('.chips-loading__text').exists()).toBe(true);
      expect(wrapper.find('.custom-tip').exists()).toBe(true);
    });
  });

  describe('delay', () => {
    it('should delay showing loading', async () => {
      const wrapper = mount(Loading, {
        props: { loading: true, delay: 500 },
      });

      // 初始不显示
      expect(wrapper.find('.chips-loading__content').exists()).toBe(false);

      // 延迟后显示
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-loading__content').exists()).toBe(true);
    });

    it('should cancel delay when loading becomes false', async () => {
      const wrapper = mount(Loading, {
        props: { loading: true, delay: 500 },
      });

      // 200ms 后关闭 loading
      vi.advanceTimersByTime(200);
      await wrapper.setProps({ loading: false });
      await wrapper.vm.$nextTick();

      // 即使再过 300ms 也不应该显示
      vi.advanceTimersByTime(300);
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-loading__content').exists()).toBe(false);
    });

    it('should hide immediately when loading becomes false (no delay for hiding)', async () => {
      const wrapper = mount(Loading, {
        props: { loading: true, delay: 0 },
      });

      expect(wrapper.find('.chips-loading__content').exists()).toBe(true);

      await wrapper.setProps({ loading: false });
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-loading__content').exists()).toBe(false);
    });
  });

  describe('nested mode', () => {
    it('should wrap content with loading', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
        slots: {
          default: '<div class="nested-content">Content</div>',
        },
      });

      expect(wrapper.find('.chips-loading--nested').exists()).toBe(true);
      expect(wrapper.find('.nested-content').exists()).toBe(true);
      expect(wrapper.find('.chips-loading__mask').exists()).toBe(true);
    });

    it('should show content without mask when not loading', () => {
      const wrapper = mount(Loading, {
        props: { loading: false },
        slots: {
          default: '<div class="nested-content">Content</div>',
        },
      });

      expect(wrapper.find('.nested-content').exists()).toBe(true);
      expect(wrapper.find('.chips-loading__mask').exists()).toBe(false);
    });
  });

  describe('fullscreen mode', () => {
    it('should use Teleport for fullscreen mode', () => {
      const wrapper = mount(Loading, {
        props: { loading: true, fullscreen: true },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-loading--fullscreen').exists()).toBe(true);
    });

    it('should have fullscreen class', () => {
      const wrapper = mount(Loading, {
        props: { loading: true, fullscreen: true },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-loading').classes()).toContain('chips-loading--fullscreen');
    });
  });

  describe('custom indicator', () => {
    it('should render custom indicator via slot', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
        slots: {
          indicator: '<span class="custom-spinner">Custom Spinner</span>',
        },
      });

      expect(wrapper.find('.chips-loading__spinner').exists()).toBe(true);
      expect(wrapper.find('.custom-spinner').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
      });

      const content = wrapper.find('[role="alert"]');
      expect(content.exists()).toBe(true);
      expect(content.attributes('aria-busy')).toBe('true');
      expect(content.attributes('aria-live')).toBe('polite');
    });
  });
});
