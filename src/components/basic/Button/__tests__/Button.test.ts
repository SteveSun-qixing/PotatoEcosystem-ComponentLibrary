import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../Button.vue';

describe('Button', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Click me',
        },
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.text()).toContain('Click me');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Button);
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-button');
      expect(button.classes()).toContain('chips-button--default');
      expect(button.classes()).toContain('chips-button--medium');
    });
  });

  describe('types', () => {
    it.each([
      ['default', 'chips-button--default'],
      ['primary', 'chips-button--primary'],
      ['dashed', 'chips-button--dashed'],
      ['link', 'chips-button--link'],
      ['text', 'chips-button--text'],
    ] as const)('should render %s type', (type, expectedClass) => {
      const wrapper = mount(Button, {
        props: { type },
      });

      expect(wrapper.find('button').classes()).toContain(expectedClass);
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-button--small'],
      ['medium', 'chips-button--medium'],
      ['large', 'chips-button--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(Button, {
        props: { size },
      });

      expect(wrapper.find('button').classes()).toContain(expectedClass);
    });
  });

  describe('states', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-button--disabled');
      expect(button.attributes('disabled')).toBeDefined();
      expect(button.attributes('aria-disabled')).toBe('true');
    });

    it('should show loading state', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-button--loading');
      expect(wrapper.find('.chips-button__spinner').exists()).toBe(true);
      expect(button.attributes('aria-busy')).toBe('true');
    });

    it('should be disabled when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-button--disabled');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('should render danger button', () => {
      const wrapper = mount(Button, {
        props: { danger: true },
      });

      expect(wrapper.find('button').classes()).toContain('chips-button--danger');
    });

    it('should render block button', () => {
      const wrapper = mount(Button, {
        props: { block: true },
      });

      expect(wrapper.find('button').classes()).toContain('chips-button--block');
    });
  });

  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Button);

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.length).toBe(1);
    });

    it('should not emit click when disabled', async () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('should not emit click when loading', async () => {
      const wrapper = mount(Button, {
        props: { loading: true },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Button, {
        slots: {
          default: '<span>Custom Content</span>',
        },
      });

      expect(wrapper.find('.chips-button__content').html()).toContain('Custom Content');
    });

    it('should render icon slot', () => {
      const wrapper = mount(Button, {
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
        },
      });

      expect(wrapper.find('.chips-button__icon').exists()).toBe(true);
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
    });

    it('should hide icon slot when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
        },
      });

      expect(wrapper.find('.chips-button__icon').exists()).toBe(false);
      expect(wrapper.find('.chips-button__spinner').exists()).toBe(true);
    });
  });

  describe('htmlType', () => {
    it.each([
      ['button', 'button'],
      ['submit', 'submit'],
      ['reset', 'reset'],
    ] as const)('should set button type to %s', (htmlType, expectedType) => {
      const wrapper = mount(Button, {
        props: { htmlType },
      });

      expect(wrapper.find('button').attributes('type')).toBe(expectedType);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes when disabled', () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
      });

      expect(wrapper.find('button').attributes('aria-disabled')).toBe('true');
    });

    it('should have aria-busy when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
      });

      expect(wrapper.find('button').attributes('aria-busy')).toBe('true');
    });
  });
});
