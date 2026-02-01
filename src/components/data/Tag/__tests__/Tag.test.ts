import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tag from '../Tag.vue';

describe('Tag', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Tag, {
        slots: {
          default: 'Tag Content',
        },
      });

      expect(wrapper.find('span.chips-tag').exists()).toBe(true);
      expect(wrapper.text()).toContain('Tag Content');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Tag);
      const tag = wrapper.find('span.chips-tag');

      expect(tag.classes()).toContain('chips-tag');
      expect(tag.classes()).toContain('chips-tag--default');
      expect(tag.classes()).toContain('chips-tag--medium');
      expect(tag.classes()).toContain('chips-tag--bordered');
    });
  });

  describe('preset colors', () => {
    it.each([
      ['default', 'chips-tag--default'],
      ['success', 'chips-tag--success'],
      ['processing', 'chips-tag--processing'],
      ['warning', 'chips-tag--warning'],
      ['error', 'chips-tag--error'],
    ] as const)('should render %s color', (color, expectedClass) => {
      const wrapper = mount(Tag, {
        props: { color },
      });

      expect(wrapper.find('span.chips-tag').classes()).toContain(expectedClass);
    });
  });

  describe('custom colors', () => {
    it('should render custom color', () => {
      const wrapper = mount(Tag, {
        props: { color: '#ff0000' },
      });
      const tag = wrapper.find('span.chips-tag');

      expect(tag.classes()).toContain('chips-tag--custom');
      expect(tag.attributes('style')).toContain('--chips-tag-color: #ff0000');
    });

    it('should render custom color with CSS variable', () => {
      const wrapper = mount(Tag, {
        props: { color: 'var(--brand-color)' },
      });
      const style = wrapper.find('span.chips-tag').attributes('style');

      expect(style).toContain('--chips-tag-color: var(--brand-color)');
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-tag--small'],
      ['medium', 'chips-tag--medium'],
      ['large', 'chips-tag--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(Tag, {
        props: { size },
      });

      expect(wrapper.find('span.chips-tag').classes()).toContain(expectedClass);
    });
  });

  describe('closable', () => {
    it('should not show close button by default', () => {
      const wrapper = mount(Tag);

      expect(wrapper.find('.chips-tag__close').exists()).toBe(false);
    });

    it('should show close button when closable is true', () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-tag__close').exists()).toBe(true);
      expect(wrapper.find('span.chips-tag').classes()).toContain('chips-tag--closable');
    });

    it('should emit close event when close button is clicked', async () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      await wrapper.find('.chips-tag__close').trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('should stop propagation when close button is clicked', async () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      await wrapper.find('.chips-tag__close').trigger('click');

      // close should emit, but click should not
      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('click')).toBeFalsy();
    });
  });

  describe('bordered', () => {
    it('should have bordered class by default', () => {
      const wrapper = mount(Tag);

      expect(wrapper.find('span.chips-tag').classes()).toContain('chips-tag--bordered');
    });

    it('should not have bordered class when bordered is false', () => {
      const wrapper = mount(Tag, {
        props: { bordered: false },
      });

      expect(wrapper.find('span.chips-tag').classes()).not.toContain('chips-tag--bordered');
    });
  });

  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Tag);

      await wrapper.find('span.chips-tag').trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.length).toBe(1);
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Tag, {
        slots: {
          default: '<span class="custom-content">Custom</span>',
        },
      });

      expect(wrapper.find('.chips-tag__content').html()).toContain('Custom');
    });

    it('should render icon slot', () => {
      const wrapper = mount(Tag, {
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
        },
      });

      expect(wrapper.find('.chips-tag__icon').exists()).toBe(true);
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
    });

    it('should render closeIcon slot', () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
        slots: {
          closeIcon: '<span class="custom-close-icon">X</span>',
        },
      });

      expect(wrapper.find('.custom-close-icon').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper role on close button', () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-tag__close').attributes('role')).toBe('button');
      expect(wrapper.find('.chips-tag__close').attributes('tabindex')).toBe('0');
    });

    it('should have aria-label on close button', () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-tag__close').attributes('aria-label')).toBe('Close');
    });

    it('should support keyboard navigation for close', async () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      await wrapper.find('.chips-tag__close').trigger('keydown.enter');

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should support space key for close', async () => {
      const wrapper = mount(Tag, {
        props: { closable: true },
      });

      await wrapper.find('.chips-tag__close').trigger('keydown.space');

      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('combined props', () => {
    it('should handle multiple props together', () => {
      const wrapper = mount(Tag, {
        props: {
          color: 'success',
          closable: true,
          bordered: true,
          size: 'large',
        },
        slots: {
          default: 'Success Tag',
          icon: '<span class="icon">✓</span>',
        },
      });
      const tag = wrapper.find('span.chips-tag');

      expect(tag.classes()).toContain('chips-tag--success');
      expect(tag.classes()).toContain('chips-tag--closable');
      expect(tag.classes()).toContain('chips-tag--bordered');
      expect(tag.classes()).toContain('chips-tag--large');
      expect(wrapper.find('.chips-tag__icon').exists()).toBe(true);
      expect(wrapper.find('.chips-tag__close').exists()).toBe(true);
    });
  });
});
