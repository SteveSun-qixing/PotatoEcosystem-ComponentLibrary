import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Image from '../Image.vue';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Image', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });

      expect(wrapper.find('.chips-image').exists()).toBe(true);
      // 非懒加载时图片应该存在
      expect(wrapper.find('img.chips-image__img').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });
      const image = wrapper.find('.chips-image');

      expect(image.classes()).toContain('chips-image');
      expect(image.classes()).toContain('chips-image--loading');
      expect(image.classes()).toContain('chips-image--fit-fill');
    });

    it('should set alt attribute', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          alt: 'Test image',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('alt')).toBe('Test image');
    });
  });

  describe('dimensions', () => {
    it('should set width and height as numbers', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          width: 200,
          height: 150,
        },
      });
      const style = wrapper.find('.chips-image').attributes('style');

      expect(style).toContain('width: 200px');
      expect(style).toContain('height: 150px');
    });

    it('should set width and height as strings', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          width: '100%',
          height: '50vh',
        },
      });
      const style = wrapper.find('.chips-image').attributes('style');

      expect(style).toContain('width: 100%');
      expect(style).toContain('height: 50vh');
    });
  });

  describe('fit modes', () => {
    it.each([
      ['contain', 'chips-image--fit-contain'],
      ['cover', 'chips-image--fit-cover'],
      ['fill', 'chips-image--fit-fill'],
      ['none', 'chips-image--fit-none'],
      ['scale-down', 'chips-image--fit-scale-down'],
    ] as const)('should render %s fit mode', (fit, expectedClass) => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          fit,
        },
      });

      expect(wrapper.find('.chips-image').classes()).toContain(expectedClass);
    });
  });

  describe('loading states', () => {
    it('should show placeholder while loading', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });

      expect(wrapper.find('.chips-image__placeholder').exists()).toBe(true);
      expect(wrapper.find('.chips-image').classes()).toContain('chips-image--loading');
    });

    it('should show loaded state after load event', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      expect(img.exists()).toBe(true);
      await img.trigger('load');

      expect(wrapper.find('.chips-image').classes()).toContain('chips-image--loaded');
      expect(wrapper.find('.chips-image__placeholder').exists()).toBe(false);
    });

    it('should emit load event', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('load');

      expect(wrapper.emitted('load')).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should show error state on load failure', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/invalid.jpg',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('error');

      expect(wrapper.find('.chips-image').classes()).toContain('chips-image--error');
      expect(wrapper.find('.chips-image__error').exists()).toBe(true);
    });

    it('should emit error event', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/invalid.jpg',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('error');

      expect(wrapper.emitted('error')).toBeTruthy();
    });

    it('should try fallback image on error', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/invalid.jpg',
          fallback: 'https://example.com/fallback.jpg',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('error');

      // Should update src to fallback
      expect(wrapper.find('img.chips-image__img').attributes('src')).toBe(
        'https://example.com/fallback.jpg'
      );
    });
  });

  describe('lazy loading', () => {
    it('should not load image immediately when lazy is true', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          lazy: true,
        },
      });

      // IntersectionObserver should be created
      expect(mockIntersectionObserver).toHaveBeenCalled();
      // Image should not exist yet
      expect(wrapper.find('img.chips-image__img').exists()).toBe(false);
    });

    it('should load image when in viewport', async () => {
      let observerCallback: Function;

      mockIntersectionObserver.mockImplementation((callback) => {
        observerCallback = callback;
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      });

      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          lazy: true,
        },
      });

      // Simulate intersection
      observerCallback!([{ isIntersecting: true }]);
      await flushPromises();

      // Image src should now be set
      expect(wrapper.find('img.chips-image__img').exists()).toBe(true);
    });
  });

  describe('preview', () => {
    it('should not show preview class by default when loading', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
      });

      // preview 属性默认 false
      expect(wrapper.find('.chips-image--preview').exists()).toBe(false);
    });

    it('should show preview class when preview is enabled and loaded', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          preview: true,
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('load');

      expect(wrapper.find('.chips-image').classes()).toContain('chips-image--preview');
    });

    it('should have role button when preview is enabled', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          preview: true,
        },
      });

      expect(wrapper.find('.chips-image').attributes('role')).toBe('button');
      expect(wrapper.find('.chips-image').attributes('tabindex')).toBe('0');
    });

    it('should emit preview event when clicked and loaded', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          preview: true,
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('load');
      await wrapper.find('.chips-image').trigger('click');

      expect(wrapper.emitted('preview')).toBeTruthy();
      expect(wrapper.emitted('preview')?.[0]).toEqual([true]);
    });
  });

  describe('slots', () => {
    it('should render placeholder slot', () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
        },
        slots: {
          placeholder: '<span class="custom-loading">Loading...</span>',
        },
      });

      expect(wrapper.find('.custom-loading').exists()).toBe(true);
    });

    it('should render error slot', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/invalid.jpg',
        },
        slots: {
          error: '<span class="custom-error">Failed to load</span>',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('error');

      expect(wrapper.find('.custom-error').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label on error state', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/invalid.jpg',
          alt: 'Test image',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('error');

      expect(wrapper.find('.chips-image__error').attributes('aria-label')).toBe('Test image');
    });

    it('should have default aria-label when no alt provided', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/invalid.jpg',
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('error');

      expect(wrapper.find('.chips-image__error').attributes('aria-label')).toBe(
        'Image failed to load'
      );
    });

    it('should support keyboard navigation for preview', async () => {
      const wrapper = mount(Image, {
        props: {
          src: 'https://example.com/image.jpg',
          preview: true,
        },
      });

      const img = wrapper.find('img.chips-image__img');
      await img.trigger('load');
      await wrapper.find('.chips-image').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('preview')).toBeTruthy();
    });
  });
});
