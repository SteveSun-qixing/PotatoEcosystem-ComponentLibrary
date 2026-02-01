import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Avatar from '../Avatar.vue';

describe('Avatar', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Avatar);

      expect(wrapper.find('.chips-avatar').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Avatar);
      const avatar = wrapper.find('.chips-avatar');

      expect(avatar.classes()).toContain('chips-avatar');
      expect(avatar.classes()).toContain('chips-avatar--circle');
      expect(avatar.classes()).toContain('chips-avatar--default');
    });
  });

  describe('shape', () => {
    it.each([
      ['circle', 'chips-avatar--circle'],
      ['square', 'chips-avatar--square'],
    ] as const)('should render %s shape', (shape, expectedClass) => {
      const wrapper = mount(Avatar, {
        props: { shape },
      });

      expect(wrapper.find('.chips-avatar').classes()).toContain(expectedClass);
    });
  });

  describe('size', () => {
    it.each([
      ['small', 'chips-avatar--small'],
      ['default', 'chips-avatar--default'],
      ['large', 'chips-avatar--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(Avatar, {
        props: { size },
      });

      expect(wrapper.find('.chips-avatar').classes()).toContain(expectedClass);
    });

    it('should apply custom numeric size', () => {
      const wrapper = mount(Avatar, {
        props: { size: 64 },
      });
      const style = wrapper.find('.chips-avatar').attributes('style');

      expect(style).toContain('--chips-avatar-size: 64px');
      expect(wrapper.find('.chips-avatar').classes()).not.toContain('chips-avatar--small');
      expect(wrapper.find('.chips-avatar').classes()).not.toContain('chips-avatar--default');
      expect(wrapper.find('.chips-avatar').classes()).not.toContain('chips-avatar--large');
    });
  });

  describe('image mode', () => {
    it('should render image when src is provided', () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/avatar.png' },
      });

      expect(wrapper.find('.chips-avatar__image').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar__image').attributes('src')).toBe('https://example.com/avatar.png');
      expect(wrapper.find('.chips-avatar').classes()).toContain('chips-avatar--image');
    });

    it('should set alt attribute on image', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: 'https://example.com/avatar.png',
          alt: 'User avatar',
        },
      });

      expect(wrapper.find('.chips-avatar__image').attributes('alt')).toBe('User avatar');
    });

    it('should emit error event when image fails to load', async () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/invalid.png' },
      });

      await wrapper.find('.chips-avatar__image').trigger('error');

      expect(wrapper.emitted('error')).toBeTruthy();
      expect(wrapper.emitted('error')?.length).toBe(1);
    });

    it('should fallback to string mode on image error', async () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/invalid.png' },
        slots: {
          default: 'U',
        },
      });

      await wrapper.find('.chips-avatar__image').trigger('error');
      await nextTick();

      expect(wrapper.find('.chips-avatar__image').exists()).toBe(false);
      expect(wrapper.find('.chips-avatar__string').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar').classes()).toContain('chips-avatar--string');
    });
  });

  describe('icon mode', () => {
    it('should render icon from slot', () => {
      const wrapper = mount(Avatar, {
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
        },
      });

      expect(wrapper.find('.chips-avatar__icon').exists()).toBe(true);
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar').classes()).toContain('chips-avatar--icon');
    });

    it('should render icon from prop', () => {
      const IconComponent = {
        render() {
          return h('span', { class: 'prop-icon' }, 'Icon');
        },
      };

      const wrapper = mount(Avatar, {
        props: { icon: h(IconComponent) },
      });

      expect(wrapper.find('.chips-avatar__icon').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar').classes()).toContain('chips-avatar--icon');
    });

    it('should prefer image over icon when both provided', () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/avatar.png' },
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
        },
      });

      expect(wrapper.find('.chips-avatar__image').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar__icon').exists()).toBe(false);
    });
  });

  describe('string mode', () => {
    it('should render string content from slot', () => {
      const wrapper = mount(Avatar, {
        slots: {
          default: 'AB',
        },
      });

      expect(wrapper.find('.chips-avatar__string').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar__string').text()).toBe('AB');
      expect(wrapper.find('.chips-avatar').classes()).toContain('chips-avatar--string');
    });

    it('should prefer image over string when both provided', () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/avatar.png' },
        slots: {
          default: 'AB',
        },
      });

      expect(wrapper.find('.chips-avatar__image').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar__string').exists()).toBe(false);
    });

    it('should prefer icon over string when both provided', () => {
      const wrapper = mount(Avatar, {
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
          default: 'AB',
        },
      });

      expect(wrapper.find('.chips-avatar__icon').exists()).toBe(true);
      expect(wrapper.find('.chips-avatar__string').exists()).toBe(false);
    });
  });

  describe('gap', () => {
    it('should apply custom gap CSS variable', () => {
      const wrapper = mount(Avatar, {
        props: { gap: 8 },
        slots: {
          default: 'AB',
        },
      });
      const style = wrapper.find('.chips-avatar').attributes('style');

      expect(style).toContain('--chips-avatar-gap: 8px');
    });

    it('should not apply gap CSS variable when using default value', () => {
      const wrapper = mount(Avatar, {
        slots: {
          default: 'AB',
        },
      });
      const style = wrapper.find('.chips-avatar').attributes('style') || '';

      expect(style).not.toContain('--chips-avatar-gap');
    });
  });

  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Avatar);

      await wrapper.find('.chips-avatar').trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.length).toBe(1);
    });
  });

  describe('combined props', () => {
    it('should handle multiple props together', () => {
      const wrapper = mount(Avatar, {
        props: {
          size: 48,
          shape: 'square',
          src: 'https://example.com/avatar.png',
          alt: 'User',
        },
      });

      const avatar = wrapper.find('.chips-avatar');
      expect(avatar.classes()).toContain('chips-avatar--square');
      expect(avatar.classes()).toContain('chips-avatar--image');
      expect(avatar.attributes('style')).toContain('--chips-avatar-size: 48px');
      expect(wrapper.find('.chips-avatar__image').attributes('alt')).toBe('User');
    });
  });

  describe('display priority', () => {
    it('should follow priority: image > icon > string', async () => {
      // With all three, image should show
      const wrapper1 = mount(Avatar, {
        props: { src: 'https://example.com/avatar.png' },
        slots: {
          icon: '<span>Icon</span>',
          default: 'AB',
        },
      });
      expect(wrapper1.find('.chips-avatar--image').exists()).toBe(true);

      // On image error, should fallback to icon
      await wrapper1.find('.chips-avatar__image').trigger('error');
      await nextTick();
      expect(wrapper1.find('.chips-avatar--icon').exists()).toBe(true);

      // Without image, icon should show over string
      const wrapper2 = mount(Avatar, {
        slots: {
          icon: '<span>Icon</span>',
          default: 'AB',
        },
      });
      expect(wrapper2.find('.chips-avatar--icon').exists()).toBe(true);

      // Without image and icon, string should show
      const wrapper3 = mount(Avatar, {
        slots: {
          default: 'AB',
        },
      });
      expect(wrapper3.find('.chips-avatar--string').exists()).toBe(true);
    });
  });
});
