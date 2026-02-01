import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick, reactive, h, defineComponent } from 'vue';
import Form from '../Form.vue';
import FormItem from '../FormItem.vue';
import type { FormInstance, FormRules } from '../types';

// 模拟 Input 组件用于测试
const MockInput = defineComponent({
  name: 'MockInput',
  props: ['modelValue'],
  emits: ['update:modelValue', 'blur', 'change'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        onBlur: (e: Event) => emit('blur', e),
        onChange: (e: Event) => emit('change', e),
      });
  },
});

describe('Form', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Form);

      expect(wrapper.find('.chips-form').exists()).toBe(true);
      expect(wrapper.find('form').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Form);
      const form = wrapper.find('.chips-form');

      expect(form.classes()).toContain('chips-form');
      expect(form.classes()).toContain('chips-form--vertical');
    });

    it('should render slot content', () => {
      const wrapper = mount(Form, {
        slots: {
          default: '<div class="test-content">Test</div>',
        },
      });

      expect(wrapper.find('.test-content').exists()).toBe(true);
    });
  });

  describe('layouts', () => {
    it.each([
      ['horizontal', 'chips-form--horizontal'],
      ['vertical', 'chips-form--vertical'],
      ['inline', 'chips-form--inline'],
    ] as const)('should render %s layout', (layout, expectedClass) => {
      const wrapper = mount(Form, {
        props: { layout },
      });

      expect(wrapper.find('.chips-form').classes()).toContain(expectedClass);
    });
  });

  describe('disabled state', () => {
    it('should add disabled class when disabled', () => {
      const wrapper = mount(Form, {
        props: { disabled: true },
      });

      expect(wrapper.find('.chips-form').classes()).toContain('chips-form--disabled');
    });
  });

  describe('form submission', () => {
    it('should emit submit event on form submit', async () => {
      const model = reactive({ name: 'test' });
      const wrapper = mount(Form, {
        props: { model },
      });

      await wrapper.find('form').trigger('submit');

      expect(wrapper.emitted('submit')).toBeTruthy();
    });

    it('should prevent default form submission', async () => {
      const wrapper = mount(Form);
      const preventDefault = vi.fn();

      await wrapper.find('form').trigger('submit', { preventDefault });

      // submit 事件会被拦截
      expect(wrapper.emitted('submit')).toBeTruthy();
    });
  });
});

describe('FormItem', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(FormItem);

      expect(wrapper.find('.chips-form-item').exists()).toBe(true);
    });

    it('should render label', () => {
      const wrapper = mount(FormItem, {
        props: { label: 'Username' },
      });

      expect(wrapper.find('.chips-form-item__label').exists()).toBe(true);
      expect(wrapper.find('.chips-form-item__label').text()).toBe('Username');
    });

    it('should render required marker', () => {
      const wrapper = mount(FormItem, {
        props: { label: 'Username', required: true },
      });

      expect(wrapper.find('.chips-form-item__required').exists()).toBe(true);
      expect(wrapper.find('.chips-form-item').classes()).toContain('chips-form-item--required');
    });

    it('should render help text', () => {
      const wrapper = mount(FormItem, {
        props: { help: 'Please enter your username' },
      });

      expect(wrapper.find('.chips-form-item__help').exists()).toBe(true);
      expect(wrapper.find('.chips-form-item__help').text()).toBe('Please enter your username');
    });

    it('should render extra text', () => {
      const wrapper = mount(FormItem, {
        props: { extra: 'Additional info' },
      });

      expect(wrapper.find('.chips-form-item__extra').exists()).toBe(true);
      expect(wrapper.find('.chips-form-item__extra').text()).toBe('Additional info');
    });

    it('should render slot content', () => {
      const wrapper = mount(FormItem, {
        slots: {
          default: '<input class="test-input" />',
        },
      });

      expect(wrapper.find('.test-input').exists()).toBe(true);
    });
  });

  describe('validation status', () => {
    it.each([
      ['error', 'chips-form-item--error'],
      ['warning', 'chips-form-item--warning'],
      ['success', 'chips-form-item--success'],
      ['validating', 'chips-form-item--validating'],
    ] as const)('should render %s status', (status, expectedClass) => {
      const wrapper = mount(FormItem, {
        props: { validateStatus: status },
      });

      expect(wrapper.find('.chips-form-item').classes()).toContain(expectedClass);
    });

    it('should render feedback when hasFeedback is true', () => {
      const wrapper = mount(FormItem, {
        props: { hasFeedback: true, validateStatus: 'success' },
      });

      expect(wrapper.find('.chips-form-item__feedback').exists()).toBe(true);
    });

    it('should not render feedback when hasFeedback is false', () => {
      const wrapper = mount(FormItem, {
        props: { hasFeedback: false, validateStatus: 'success' },
      });

      expect(wrapper.find('.chips-form-item__feedback').exists()).toBe(false);
    });
  });

  describe('label width', () => {
    it('should apply label width as number', () => {
      const wrapper = mount(FormItem, {
        props: { label: 'Test', labelWidth: 100 },
      });

      const label = wrapper.find('.chips-form-item__label');
      expect(label.attributes('style')).toContain('width: 100px');
    });

    it('should apply label width as string', () => {
      const wrapper = mount(FormItem, {
        props: { label: 'Test', labelWidth: '10em' },
      });

      const label = wrapper.find('.chips-form-item__label');
      expect(label.attributes('style')).toContain('width: 10em');
    });
  });
});

describe('Form + FormItem Integration', () => {
  const createFormWrapper = (options: {
    model: Record<string, unknown>;
    rules?: FormRules;
    formProps?: Record<string, unknown>;
  }) => {
    const { model, rules, formProps = {} } = options;
    const formModel = reactive(model);

    return mount(Form, {
      props: {
        model: formModel,
        rules,
        ...formProps,
      },
      slots: {
        default: () => [
          h(FormItem, { label: 'Username', name: 'username' }, () =>
            h(MockInput, {
              modelValue: formModel.username,
              'onUpdate:modelValue': (val: string) => {
                formModel.username = val;
              },
            })
          ),
          h(FormItem, { label: 'Email', name: 'email' }, () =>
            h(MockInput, {
              modelValue: formModel.email,
              'onUpdate:modelValue': (val: string) => {
                formModel.email = val;
              },
            })
          ),
        ],
      },
    });
  };

  describe('validation', () => {
    it('should validate required field', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: '' },
        rules: {
          username: { required: true, message: 'Username is required' },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
      await nextTick();

      expect(wrapper.find('.chips-form-item--error').exists()).toBe(true);
    });

    it('should pass validation when field is filled', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'testuser', email: 'test@example.com' },
        rules: {
          username: { required: true },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).resolves.toBeUndefined();
    });

    it('should validate email type', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'test', email: 'invalid-email' },
        rules: {
          email: { type: 'email', message: 'Invalid email format' },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
    });

    it('should validate min length', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'ab', email: '' },
        rules: {
          username: { min: 3, message: 'Username must be at least 3 characters' },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
    });

    it('should validate max length', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'verylongusername', email: '' },
        rules: {
          username: { max: 10, message: 'Username must be at most 10 characters' },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
    });

    it('should validate pattern', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'user@123', email: '' },
        rules: {
          username: { pattern: /^[a-zA-Z]+$/, message: 'Only letters allowed' },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
    });

    it('should support custom validator', async () => {
      const customValidator = vi.fn().mockRejectedValue(new Error('Custom error'));

      const wrapper = createFormWrapper({
        model: { username: 'test', email: '' },
        rules: {
          username: { validator: customValidator },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
      expect(customValidator).toHaveBeenCalled();
    });

    it('should validate single field', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: 'test@example.com' },
        rules: {
          username: { required: true, message: 'Username is required' },
          email: { required: true },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validateField('username')).rejects.toThrow();
    });

    it('should clear validation', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: '' },
        rules: {
          username: { required: true },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      // 触发验证失败
      try {
        await form.validate();
      } catch {
        // 预期失败
      }
      await nextTick();

      expect(wrapper.find('.chips-form-item--error').exists()).toBe(true);

      // 清除验证
      form.clearValidate();
      await nextTick();

      expect(wrapper.find('.chips-form-item--error').exists()).toBe(false);
    });
  });

  describe('field operations', () => {
    it('should get field value', () => {
      const wrapper = createFormWrapper({
        model: { username: 'testuser', email: 'test@example.com' },
      });

      const form = wrapper.vm as unknown as FormInstance;

      expect(form.getFieldValue('username')).toBe('testuser');
      expect(form.getFieldValue('email')).toBe('test@example.com');
    });

    it('should set field value', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: '' },
      });

      const form = wrapper.vm as unknown as FormInstance;

      form.setFieldValue('username', 'newuser');
      await nextTick();

      expect(form.getFieldValue('username')).toBe('newuser');
    });

    it('should get all field values', () => {
      const wrapper = createFormWrapper({
        model: { username: 'user1', email: 'user1@example.com' },
      });

      const form = wrapper.vm as unknown as FormInstance;
      const values = form.getFieldsValue();

      expect(values).toEqual({ username: 'user1', email: 'user1@example.com' });
    });

    it('should set multiple field values', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: '' },
      });

      const form = wrapper.vm as unknown as FormInstance;

      form.setFieldsValue({ username: 'user2', email: 'user2@example.com' });
      await nextTick();

      expect(form.getFieldValue('username')).toBe('user2');
      expect(form.getFieldValue('email')).toBe('user2@example.com');
    });

    it('should reset fields', async () => {
      const initialModel = { username: 'initial', email: 'initial@example.com' };
      const wrapper = createFormWrapper({
        model: { ...initialModel },
      });

      const form = wrapper.vm as unknown as FormInstance;

      // 修改值
      form.setFieldValue('username', 'modified');
      await nextTick();

      expect(form.getFieldValue('username')).toBe('modified');

      // 重置
      form.resetFields();
      await nextTick();

      expect(form.getFieldValue('username')).toBe('initial');
    });
  });

  describe('events', () => {
    it('should emit valuesChange when field value changes', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: '' },
      });

      const form = wrapper.vm as unknown as FormInstance;

      form.setFieldValue('username', 'newvalue');
      await nextTick();

      expect(wrapper.emitted('valuesChange')).toBeTruthy();
      expect(wrapper.emitted('valuesChange')?.[0]).toEqual([
        { username: 'newvalue' },
        expect.objectContaining({ username: 'newvalue' }),
      ]);
    });

    it('should emit validateError on validation failure', async () => {
      const wrapper = createFormWrapper({
        model: { username: '', email: '' },
        rules: {
          username: { required: true, message: 'Username is required' },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      try {
        await form.validate();
      } catch {
        // 预期失败
      }

      expect(wrapper.emitted('validateError')).toBeTruthy();
    });

    it('should emit validateSuccess on validation success', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'validuser', email: '' },
        rules: {
          username: { required: true },
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await form.validate();

      expect(wrapper.emitted('validateSuccess')).toBeTruthy();
    });
  });

  describe('multiple rules', () => {
    it('should support multiple rules for a field', async () => {
      const wrapper = createFormWrapper({
        model: { username: 'ab', email: '' },
        rules: {
          username: [
            { required: true, message: 'Username is required' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ],
        },
      });

      const form = wrapper.vm as unknown as FormInstance;

      await expect(form.validate()).rejects.toThrow();
    });
  });

  describe('context inheritance', () => {
    it('should inherit disabled state from Form', async () => {
      const formModel = reactive({ username: '' });

      const wrapper = mount(Form, {
        props: {
          model: formModel,
          disabled: true,
        },
        slots: {
          default: () =>
            h(FormItem, { label: 'Username', name: 'username' }, () =>
              h('input', { value: formModel.username })
            ),
        },
      });

      expect(wrapper.find('.chips-form--disabled').exists()).toBe(true);
    });

    it('should inherit labelWidth from Form', async () => {
      const formModel = reactive({ username: '' });

      const wrapper = mount(Form, {
        props: {
          model: formModel,
          labelWidth: 120,
        },
        slots: {
          default: () =>
            h(FormItem, { label: 'Username', name: 'username' }, () =>
              h('input', { value: formModel.username })
            ),
        },
      });

      const label = wrapper.find('.chips-form-item__label');
      expect(label.attributes('style')).toContain('width: 120px');
    });
  });
});

describe('Form accessibility', () => {
  it('should have role alert on error message', async () => {
    const formModel = reactive({ username: '' });

    const wrapper = mount(Form, {
      props: {
        model: formModel,
        rules: {
          username: { required: true, message: 'Required' },
        },
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Username', name: 'username' }, () =>
            h('input', { value: formModel.username })
          ),
      },
    });

    const form = wrapper.vm as unknown as FormInstance;

    try {
      await form.validate();
    } catch {
      // 预期失败
    }
    await nextTick();

    const helpElement = wrapper.find('.chips-form-item__help');
    expect(helpElement.attributes('role')).toBe('alert');
  });

  it('should have data-field attribute for scrolling', () => {
    const formModel = reactive({ username: '' });

    const wrapper = mount(Form, {
      props: {
        model: formModel,
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Username', name: 'username' }, () =>
            h('input', { value: formModel.username })
          ),
      },
    });

    expect(wrapper.find('[data-field="username"]').exists()).toBe(true);
  });
});
