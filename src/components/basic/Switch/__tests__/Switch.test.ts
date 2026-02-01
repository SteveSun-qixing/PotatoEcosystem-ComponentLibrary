import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Switch from '../Switch.vue';

describe('Switch', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Switch);

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.find('.chips-switch__rail').exists()).toBe(true);
      expect(wrapper.find('.chips-switch__handle').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Switch);
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-switch');
      expect(button.classes()).toContain('chips-switch--medium');
    });

    it('should have proper button type', () => {
      const wrapper = mount(Switch);

      expect(wrapper.find('button').attributes('type')).toBe('button');
    });
  });

  describe('checked state', () => {
    it('should be unchecked by default', () => {
      const wrapper = mount(Switch);
      const button = wrapper.find('button');

      expect(button.classes()).not.toContain('chips-switch--checked');
      expect(button.attributes('aria-checked')).toBe('false');
    });

    it('should be checked when modelValue equals checkedValue', () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: true,
          checkedValue: true,
        },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-switch--checked');
      expect(button.attributes('aria-checked')).toBe('true');
    });

    it('should be unchecked when modelValue equals uncheckedValue', () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
          checkedValue: true,
          uncheckedValue: false,
        },
      });
      const button = wrapper.find('button');

      expect(button.classes()).not.toContain('chips-switch--checked');
      expect(button.attributes('aria-checked')).toBe('false');
    });

    it('should support custom checkedValue and uncheckedValue', () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: 'yes',
          checkedValue: 'yes',
          uncheckedValue: 'no',
        },
      });

      expect(wrapper.find('button').classes()).toContain('chips-switch--checked');
    });
  });

  describe('defaultChecked (uncontrolled mode)', () => {
    it('should be checked when defaultChecked is true', () => {
      const wrapper = mount(Switch, {
        props: {
          defaultChecked: true,
        },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-switch--checked');
    });

    it('should toggle in uncontrolled mode', async () => {
      const wrapper = mount(Switch, {
        props: {
          defaultChecked: false,
        },
      });

      expect(wrapper.find('button').classes()).not.toContain('chips-switch--checked');

      await wrapper.find('button').trigger('click');

      expect(wrapper.find('button').classes()).toContain('chips-switch--checked');
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-switch--small'],
      ['medium', 'chips-switch--medium'],
      ['large', 'chips-switch--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(Switch, {
        props: { size },
      });

      expect(wrapper.find('button').classes()).toContain(expectedClass);
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(Switch, {
        props: { disabled: true },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-switch--disabled');
      expect(button.attributes('disabled')).toBeDefined();
      expect(button.attributes('aria-disabled')).toBe('true');
    });

    it('should not emit events when disabled', async () => {
      const wrapper = mount(Switch, {
        props: { disabled: true },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('change')).toBeFalsy();
    });
  });

  describe('loading state', () => {
    it('should show loading state', () => {
      const wrapper = mount(Switch, {
        props: { loading: true },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-switch--loading');
      expect(wrapper.find('.chips-switch__loading').exists()).toBe(true);
      expect(button.attributes('aria-busy')).toBe('true');
    });

    it('should be disabled when loading', () => {
      const wrapper = mount(Switch, {
        props: { loading: true },
      });
      const button = wrapper.find('button');

      expect(button.classes()).toContain('chips-switch--disabled');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('should not emit events when loading', async () => {
      const wrapper = mount(Switch, {
        props: { loading: true },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('change')).toBeFalsy();
    });
  });

  describe('events', () => {
    it('should emit update:modelValue and change on click', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual([true]);
    });

    it('should toggle value on click', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: true,
        },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
    });

    it('should emit custom values when configured', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: 'off',
          checkedValue: 'on',
          uncheckedValue: 'off',
        },
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['on']);
    });
  });

  describe('keyboard interaction', () => {
    it('should toggle on Enter key', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.find('button').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    it('should toggle on Space key', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.find('button').trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    it('should not toggle on other keys', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.find('button').trigger('keydown', { key: 'Escape' });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('slots', () => {
    it('should render checked slot when checked', () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: true,
        },
        slots: {
          checked: '<span class="checked-content">ON</span>',
        },
      });

      expect(wrapper.find('.chips-switch__inner').exists()).toBe(true);
      expect(wrapper.find('.checked-content').exists()).toBe(true);
      expect(wrapper.find('.checked-content').text()).toBe('ON');
    });

    it('should render unchecked slot when unchecked', () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
        },
        slots: {
          unchecked: '<span class="unchecked-content">OFF</span>',
        },
      });

      expect(wrapper.find('.chips-switch__inner').exists()).toBe(true);
      expect(wrapper.find('.unchecked-content').exists()).toBe(true);
      expect(wrapper.find('.unchecked-content').text()).toBe('OFF');
    });

    it('should not render inner when no slots provided', () => {
      const wrapper = mount(Switch);

      expect(wrapper.find('.chips-switch__inner').exists()).toBe(false);
    });

    it('should switch slot content based on state', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: false,
        },
        slots: {
          checked: '<span class="checked-content">ON</span>',
          unchecked: '<span class="unchecked-content">OFF</span>',
        },
      });

      expect(wrapper.find('.unchecked-content').exists()).toBe(true);
      expect(wrapper.find('.checked-content').exists()).toBe(false);

      await wrapper.setProps({ modelValue: true });

      expect(wrapper.find('.checked-content').exists()).toBe(true);
      expect(wrapper.find('.unchecked-content').exists()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have proper role attribute', () => {
      const wrapper = mount(Switch);

      expect(wrapper.find('button').attributes('role')).toBe('switch');
    });

    it('should have aria-checked attribute', () => {
      const wrapperUnchecked = mount(Switch, {
        props: { modelValue: false },
      });
      expect(wrapperUnchecked.find('button').attributes('aria-checked')).toBe('false');

      const wrapperChecked = mount(Switch, {
        props: { modelValue: true },
      });
      expect(wrapperChecked.find('button').attributes('aria-checked')).toBe('true');
    });

    it('should have aria-disabled when disabled', () => {
      const wrapper = mount(Switch, {
        props: { disabled: true },
      });

      expect(wrapper.find('button').attributes('aria-disabled')).toBe('true');
    });

    it('should have aria-busy when loading', () => {
      const wrapper = mount(Switch, {
        props: { loading: true },
      });

      expect(wrapper.find('button').attributes('aria-busy')).toBe('true');
    });
  });

  describe('numeric and string values', () => {
    it('should work with numeric values', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: 0,
          checkedValue: 1,
          uncheckedValue: 0,
        },
      });

      expect(wrapper.find('button').classes()).not.toContain('chips-switch--checked');

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([1]);
    });

    it('should work with string values', async () => {
      const wrapper = mount(Switch, {
        props: {
          modelValue: 'inactive',
          checkedValue: 'active',
          uncheckedValue: 'inactive',
        },
      });

      expect(wrapper.find('button').classes()).not.toContain('chips-switch--checked');

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['active']);
    });
  });
});
