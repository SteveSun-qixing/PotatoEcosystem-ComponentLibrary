import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Input from '../Input.vue';

describe('Input', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Input);

      expect(wrapper.find('.chips-input').exists()).toBe(true);
      expect(wrapper.find('.chips-input__wrapper').exists()).toBe(true);
      expect(wrapper.find('.chips-input__inner').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Input);
      const container = wrapper.find('.chips-input');

      expect(container.classes()).toContain('chips-input');
      expect(container.classes()).toContain('chips-input--medium');
    });

    it('should render with placeholder', () => {
      const wrapper = mount(Input, {
        props: { placeholder: 'Enter text' },
      });

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text');
    });

    it('should render with initial value (modelValue)', () => {
      const wrapper = mount(Input, {
        props: { modelValue: 'Hello' },
      });

      expect(wrapper.find('input').element.value).toBe('Hello');
    });

    it('should render with default value (uncontrolled)', () => {
      const wrapper = mount(Input, {
        props: { defaultValue: 'Default' },
      });

      expect(wrapper.find('input').element.value).toBe('Default');
    });
  });

  describe('types', () => {
    it.each([
      ['text', 'text'],
      ['password', 'password'],
      ['number', 'number'],
      ['email', 'email'],
      ['tel', 'tel'],
      ['url', 'url'],
    ] as const)('should render %s type', (type, expectedType) => {
      const wrapper = mount(Input, {
        props: { type },
      });

      expect(wrapper.find('input').attributes('type')).toBe(expectedType);
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-input--small'],
      ['medium', 'chips-input--medium'],
      ['large', 'chips-input--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(Input, {
        props: { size },
      });

      expect(wrapper.find('.chips-input').classes()).toContain(expectedClass);
    });
  });

  describe('states', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(Input, {
        props: { disabled: true },
      });
      const container = wrapper.find('.chips-input');
      const input = wrapper.find('input');

      expect(container.classes()).toContain('chips-input--disabled');
      expect(input.attributes('disabled')).toBeDefined();
      expect(input.attributes('aria-disabled')).toBe('true');
    });

    it('should be readonly when readonly prop is true', () => {
      const wrapper = mount(Input, {
        props: { readonly: true },
      });
      const container = wrapper.find('.chips-input');
      const input = wrapper.find('input');

      expect(container.classes()).toContain('chips-input--readonly');
      expect(input.attributes('readonly')).toBeDefined();
      expect(input.attributes('aria-readonly')).toBe('true');
    });

    it('should show error status', () => {
      const wrapper = mount(Input, {
        props: { status: 'error' },
      });
      const container = wrapper.find('.chips-input');
      const input = wrapper.find('input');

      expect(container.classes()).toContain('chips-input--error');
      expect(input.attributes('aria-invalid')).toBe('true');
    });

    it('should show warning status', () => {
      const wrapper = mount(Input, {
        props: { status: 'warning' },
      });

      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--warning');
    });

    it('should show focused state', async () => {
      const wrapper = mount(Input);

      await wrapper.find('input').trigger('focus');

      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--focused');
    });

    it('should remove focused state on blur', async () => {
      const wrapper = mount(Input);

      await wrapper.find('input').trigger('focus');
      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--focused');

      await wrapper.find('input').trigger('blur');
      expect(wrapper.find('.chips-input').classes()).not.toContain('chips-input--focused');
    });
  });

  describe('events', () => {
    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.setValue('test');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test']);
    });

    it('should emit input event', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.setValue('test');

      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')?.[0]?.[0]).toBe('test');
    });

    it('should emit change event', async () => {
      const wrapper = mount(Input);
      const input = wrapper.find('input');

      await input.trigger('change');

      expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('should emit focus event', async () => {
      const wrapper = mount(Input);

      await wrapper.find('input').trigger('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
      expect(wrapper.emitted('focus')?.length).toBe(1);
    });

    it('should emit blur event', async () => {
      const wrapper = mount(Input);

      await wrapper.find('input').trigger('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
      expect(wrapper.emitted('blur')?.length).toBe(1);
    });

    it('should emit pressEnter event on Enter key', async () => {
      const wrapper = mount(Input);

      await wrapper.find('input').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('pressEnter')).toBeTruthy();
      expect(wrapper.emitted('pressEnter')?.length).toBe(1);
    });

    it('should not emit pressEnter on other keys', async () => {
      const wrapper = mount(Input);

      await wrapper.find('input').trigger('keydown', { key: 'Tab' });

      expect(wrapper.emitted('pressEnter')).toBeFalsy();
    });
  });

  describe('clearable', () => {
    it('should show clear button when clearable and has value', async () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
        },
      });

      expect(wrapper.find('.chips-input__clear').exists()).toBe(true);
    });

    it('should not show clear button when empty', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: '',
        },
      });

      expect(wrapper.find('.chips-input__clear').exists()).toBe(false);
    });

    it('should not show clear button when disabled', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
          disabled: true,
        },
      });

      expect(wrapper.find('.chips-input__clear').exists()).toBe(false);
    });

    it('should not show clear button when readonly', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
          readonly: true,
        },
      });

      expect(wrapper.find('.chips-input__clear').exists()).toBe(false);
    });

    it('should emit clear event and clear value', async () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
        },
      });

      await wrapper.find('.chips-input__clear').trigger('click');

      expect(wrapper.emitted('clear')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });

    it('should add clearable class', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
        },
      });

      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--clearable');
    });
  });

  describe('showCount', () => {
    it('should show count when showCount is true', () => {
      const wrapper = mount(Input, {
        props: {
          showCount: true,
          modelValue: 'hello',
        },
      });

      expect(wrapper.find('.chips-input__count').exists()).toBe(true);
      expect(wrapper.find('.chips-input__count').text()).toBe('5');
    });

    it('should show count with maxLength', () => {
      const wrapper = mount(Input, {
        props: {
          showCount: true,
          maxLength: 10,
          modelValue: 'hello',
        },
      });

      expect(wrapper.find('.chips-input__count').text()).toBe('5 / 10');
    });

    it('should not show count when showCount is false', () => {
      const wrapper = mount(Input, {
        props: {
          showCount: false,
          modelValue: 'hello',
        },
      });

      expect(wrapper.find('.chips-input__count').exists()).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should set maxlength attribute', () => {
      const wrapper = mount(Input, {
        props: {
          maxLength: 20,
        },
      });

      expect(wrapper.find('input').attributes('maxlength')).toBe('20');
    });
  });

  describe('slots', () => {
    it('should render prefix slot', () => {
      const wrapper = mount(Input, {
        slots: {
          prefix: '<span class="custom-prefix">Prefix</span>',
        },
      });

      expect(wrapper.find('.chips-input__prefix').exists()).toBe(true);
      expect(wrapper.find('.custom-prefix').exists()).toBe(true);
      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--has-prefix');
    });

    it('should render suffix slot', () => {
      const wrapper = mount(Input, {
        slots: {
          suffix: '<span class="custom-suffix">Suffix</span>',
        },
      });

      expect(wrapper.find('.chips-input__suffix').exists()).toBe(true);
      expect(wrapper.find('.custom-suffix').exists()).toBe(true);
      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--has-suffix');
    });

    it('should render both prefix and suffix slots', () => {
      const wrapper = mount(Input, {
        slots: {
          prefix: '<span class="custom-prefix">Prefix</span>',
          suffix: '<span class="custom-suffix">Suffix</span>',
        },
      });

      expect(wrapper.find('.chips-input__prefix').exists()).toBe(true);
      expect(wrapper.find('.chips-input__suffix').exists()).toBe(true);
      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--has-prefix');
      expect(wrapper.find('.chips-input').classes()).toContain('chips-input--has-suffix');
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should work in controlled mode (with modelValue)', async () => {
      const wrapper = mount(Input, {
        props: {
          modelValue: 'initial',
        },
      });

      expect(wrapper.find('input').element.value).toBe('initial');

      await wrapper.setProps({ modelValue: 'updated' });
      expect(wrapper.find('input').element.value).toBe('updated');
    });

    it('should work in uncontrolled mode (with defaultValue)', async () => {
      const wrapper = mount(Input, {
        props: {
          defaultValue: 'default',
        },
      });

      expect(wrapper.find('input').element.value).toBe('default');

      // 输入新值
      await wrapper.find('input').setValue('new value');
      expect(wrapper.find('input').element.value).toBe('new value');
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes when disabled', () => {
      const wrapper = mount(Input, {
        props: { disabled: true },
      });

      expect(wrapper.find('input').attributes('aria-disabled')).toBe('true');
    });

    it('should have proper aria attributes when readonly', () => {
      const wrapper = mount(Input, {
        props: { readonly: true },
      });

      expect(wrapper.find('input').attributes('aria-readonly')).toBe('true');
    });

    it('should have aria-invalid when status is error', () => {
      const wrapper = mount(Input, {
        props: { status: 'error' },
      });

      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
    });

    it('should have id attribute when provided', () => {
      const wrapper = mount(Input, {
        props: { id: 'my-input' },
      });

      expect(wrapper.find('input').attributes('id')).toBe('my-input');
    });

    it('should have name attribute when provided', () => {
      const wrapper = mount(Input, {
        props: { name: 'username' },
      });

      expect(wrapper.find('input').attributes('name')).toBe('username');
    });

    it('clear button should have aria-label', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
        },
      });

      expect(wrapper.find('.chips-input__clear').attributes('aria-label')).toBeDefined();
    });

    it('clear button should have tabindex -1', () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
        },
      });

      expect(wrapper.find('.chips-input__clear').attributes('tabindex')).toBe('-1');
    });
  });

  describe('native attributes', () => {
    it('should pass autocomplete attribute', () => {
      const wrapper = mount(Input, {
        props: { autocomplete: 'off' },
      });

      expect(wrapper.find('input').attributes('autocomplete')).toBe('off');
    });

    it('should pass autofocus attribute', () => {
      const wrapper = mount(Input, {
        props: { autofocus: true },
      });

      expect(wrapper.find('input').attributes('autofocus')).toBeDefined();
    });
  });

  describe('exposed methods', () => {
    it('should expose focus method', async () => {
      const wrapper = mount(Input);
      const focusSpy = vi.spyOn(wrapper.find('input').element, 'focus');

      (wrapper.vm as any).focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should expose blur method', async () => {
      const wrapper = mount(Input);
      const blurSpy = vi.spyOn(wrapper.find('input').element, 'blur');

      (wrapper.vm as any).blur();

      expect(blurSpy).toHaveBeenCalled();
    });

    it('should expose select method', async () => {
      const wrapper = mount(Input, {
        props: { modelValue: 'test' },
      });
      const selectSpy = vi.spyOn(wrapper.find('input').element, 'select');

      (wrapper.vm as any).select();

      expect(selectSpy).toHaveBeenCalled();
    });

    it('should expose clear method', async () => {
      const wrapper = mount(Input, {
        props: {
          clearable: true,
          modelValue: 'test',
        },
      });

      (wrapper.vm as any).clear();

      expect(wrapper.emitted('clear')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });
  });
});
