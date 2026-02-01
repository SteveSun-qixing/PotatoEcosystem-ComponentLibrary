import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Textarea from '../Textarea.vue';

describe('Textarea', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Textarea);
      expect(wrapper.find('textarea').exists()).toBe(true);
      expect(wrapper.find('.chips-textarea').exists()).toBe(true);
    });

    it('should render with placeholder', () => {
      const wrapper = mount(Textarea, {
        props: { placeholder: 'Enter text' },
      });
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text');
    });

    it('should render with initial value', () => {
      const wrapper = mount(Textarea, {
        props: { modelValue: 'Hello' },
      });
      expect(wrapper.find('textarea').element.value).toBe('Hello');
    });

    it('should render with default rows', () => {
      const wrapper = mount(Textarea);
      expect(wrapper.find('textarea').attributes('rows')).toBe('3');
    });

    it('should render with custom rows', () => {
      const wrapper = mount(Textarea, {
        props: { rows: 5 },
      });
      expect(wrapper.find('textarea').attributes('rows')).toBe('5');
    });
  });

  describe('states', () => {
    it('should be disabled', () => {
      const wrapper = mount(Textarea, {
        props: { disabled: true },
      });
      expect(wrapper.find('.chips-textarea--disabled').exists()).toBe(true);
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined();
    });

    it('should be readonly', () => {
      const wrapper = mount(Textarea, {
        props: { readonly: true },
      });
      expect(wrapper.find('.chips-textarea--readonly').exists()).toBe(true);
      expect(wrapper.find('textarea').attributes('readonly')).toBeDefined();
    });

    it('should show error status', () => {
      const wrapper = mount(Textarea, {
        props: { status: 'error' },
      });
      expect(wrapper.find('.chips-textarea--error').exists()).toBe(true);
    });

    it('should show warning status', () => {
      const wrapper = mount(Textarea, {
        props: { status: 'warning' },
      });
      expect(wrapper.find('.chips-textarea--warning').exists()).toBe(true);
    });

    it('should show focused state', async () => {
      const wrapper = mount(Textarea);
      await wrapper.find('textarea').trigger('focus');
      expect(wrapper.find('.chips-textarea--focused').exists()).toBe(true);
    });
  });

  describe('events', () => {
    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(Textarea);
      const textarea = wrapper.find('textarea');
      await textarea.setValue('new value');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
    });

    it('should emit input event', async () => {
      const wrapper = mount(Textarea);
      await wrapper.find('textarea').trigger('input');
      expect(wrapper.emitted('input')).toBeTruthy();
    });

    it('should emit change event', async () => {
      const wrapper = mount(Textarea);
      await wrapper.find('textarea').trigger('change');
      expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('should emit focus event', async () => {
      const wrapper = mount(Textarea);
      await wrapper.find('textarea').trigger('focus');
      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur event', async () => {
      const wrapper = mount(Textarea);
      await wrapper.find('textarea').trigger('blur');
      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  describe('showCount', () => {
    it('should show count when enabled', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, modelValue: 'hello' },
      });
      expect(wrapper.find('.chips-textarea__count').exists()).toBe(true);
      expect(wrapper.find('.chips-textarea__count').text()).toBe('5');
    });

    it('should show count with maxLength', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, maxLength: 100, modelValue: 'hello' },
      });
      expect(wrapper.find('.chips-textarea__count').text()).toBe('5 / 100');
    });

    it('should not show count when disabled', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: false },
      });
      expect(wrapper.find('.chips-textarea__count').exists()).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should set maxlength attribute', () => {
      const wrapper = mount(Textarea, {
        props: { maxLength: 50 },
      });
      expect(wrapper.find('textarea').attributes('maxlength')).toBe('50');
    });
  });

  describe('resize', () => {
    it('should have default resize style', () => {
      const wrapper = mount(Textarea);
      expect(wrapper.find('textarea').element.style.resize).toBe('vertical');
    });

    it('should set resize to none', () => {
      const wrapper = mount(Textarea, {
        props: { resize: 'none' },
      });
      expect(wrapper.find('textarea').element.style.resize).toBe('none');
    });

    it('should set resize to both', () => {
      const wrapper = mount(Textarea, {
        props: { resize: 'both' },
      });
      expect(wrapper.find('textarea').element.style.resize).toBe('both');
    });
  });

  describe('accessibility', () => {
    it('should have aria-disabled when disabled', () => {
      const wrapper = mount(Textarea, {
        props: { disabled: true },
      });
      expect(wrapper.find('textarea').attributes('aria-disabled')).toBe('true');
    });

    it('should have aria-readonly when readonly', () => {
      const wrapper = mount(Textarea, {
        props: { readonly: true },
      });
      expect(wrapper.find('textarea').attributes('aria-readonly')).toBe('true');
    });

    it('should have aria-invalid when error status', () => {
      const wrapper = mount(Textarea, {
        props: { status: 'error' },
      });
      expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true');
    });
  });

  describe('uncontrolled mode', () => {
    it('should work with defaultValue', async () => {
      const wrapper = mount(Textarea, {
        props: { defaultValue: 'default text' },
      });
      expect(wrapper.find('textarea').element.value).toBe('default text');
      
      await wrapper.find('textarea').setValue('new text');
      expect(wrapper.find('textarea').element.value).toBe('new text');
    });
  });
});
