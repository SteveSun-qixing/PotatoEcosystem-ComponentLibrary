import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import Select from '../Select.vue';
import type { SelectOption } from '../types';

// 测试选项数据
const mockOptions: SelectOption[] = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '禁用选项', value: 'disabled', disabled: true },
];

describe('Select', () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      expect(wrapper.find('.chips-select').exists()).toBe(true);
      expect(wrapper.find('.chips-select__selector').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      const select = wrapper.find('.chips-select');
      expect(select.exists()).toBe(true);
      expect(select.classes()).toContain('chips-select');
      expect(select.classes()).toContain('chips-select--medium');
    });

    it('should render placeholder', () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          placeholder: '请选择',
        },
      });

      expect(wrapper.find('.chips-select__placeholder').text()).toBe('请选择');
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-select--small'],
      ['medium', 'chips-select--medium'],
      ['large', 'chips-select--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      wrapper = mount(Select, {
        props: { options: mockOptions, size },
      });

      expect(wrapper.find('.chips-select').classes()).toContain(expectedClass);
    });
  });

  describe('states', () => {
    it('should be disabled when disabled prop is true', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, disabled: true },
      });

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--disabled');
      expect(wrapper.find('.chips-select__selector').attributes('aria-disabled')).toBe('true');
    });

    it('should show loading state', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, loading: true },
      });

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--loading');
      expect(wrapper.find('.chips-select__spinner').exists()).toBe(true);
    });

    it('should show error status', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, status: 'error' },
      });

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--error');
    });

    it('should show warning status', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, status: 'warning' },
      });

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--warning');
    });
  });

  describe('dropdown', () => {
    it('should open dropdown on click', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--open');
      expect(wrapper.find('.chips-select__dropdown').isVisible()).toBe(true);
    });

    it('should not open dropdown when disabled', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, disabled: true },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select').classes()).not.toContain('chips-select--open');
    });

    it('should render all options', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      const options = wrapper.findAll('.chips-select__option');
      expect(options.length).toBe(mockOptions.length);
    });

    it('should mark disabled options', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      const disabledOption = wrapper.findAll('.chips-select__option').at(3);
      expect(disabledOption?.classes()).toContain('chips-select__option--disabled');
    });
  });

  describe('single selection', () => {
    it('should select option on click', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.findAll('.chips-select__option').at(0)?.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option1']);
      expect(wrapper.emitted('change')![0]).toEqual(['option1']);
    });

    it('should display selected value', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, modelValue: 'option1' },
      });

      expect(wrapper.find('.chips-select__value').text()).toBe('选项一');
    });

    it('should close dropdown after selection', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--open');

      await wrapper.findAll('.chips-select__option').at(0)?.trigger('click');
      expect(wrapper.find('.chips-select').classes()).not.toContain('chips-select--open');
    });

    it('should not select disabled option', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.findAll('.chips-select__option').at(3)?.trigger('click'); // disabled option

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('multiple selection', () => {
    it('should render in multiple mode', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, multiple: true },
      });

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--multiple');
    });

    it('should allow selecting multiple options', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, multiple: true },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.findAll('.chips-select__option').at(0)?.trigger('click');
      await wrapper.findAll('.chips-select__option').at(1)?.trigger('click');

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      expect(emitted![0]).toEqual([['option1']]);
      expect(emitted![1]).toEqual([['option1', 'option2']]);
    });

    it('should display tags for selected options', () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['option1', 'option2'],
        },
      });

      const tags = wrapper.findAll('.chips-select__tag');
      expect(tags.length).toBe(2);
    });

    it('should respect maxTagCount', () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['option1', 'option2', 'option3'],
          maxTagCount: 2,
        },
      });

      // 2 tags + 1 rest indicator
      const tags = wrapper.findAll('.chips-select__tag');
      expect(tags.length).toBe(3);
      expect(wrapper.find('.chips-select__tag-rest').text()).toBe('+1');
    });

    it('should remove tag on click', async () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['option1', 'option2'],
        },
      });

      await wrapper.find('.chips-select__tag-close').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option2']]);
    });

    it('should not close dropdown after selection in multiple mode', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, multiple: true },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.findAll('.chips-select__option').at(0)?.trigger('click');

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--open');
    });
  });

  describe('searchable', () => {
    it('should show search input', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, searchable: true },
      });

      expect(wrapper.find('.chips-select__search').exists()).toBe(true);
    });

    it('should filter options on search', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, searchable: true },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      
      const searchInput = wrapper.find('.chips-select__search');
      await searchInput.setValue('选项一');

      const options = wrapper.findAll('.chips-select__option');
      expect(options.length).toBe(1);
      expect(options.at(0)?.text()).toBe('选项一');
    });

    it('should emit search event', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, searchable: true },
      });

      const searchInput = wrapper.find('.chips-select__search');
      await searchInput.setValue('test');

      expect(wrapper.emitted('search')).toBeTruthy();
      expect(wrapper.emitted('search')![0]).toEqual(['test']);
    });
  });

  describe('clearable', () => {
    it('should show clear button when has value', async () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          clearable: true,
          modelValue: 'option1',
        },
      });

      expect(wrapper.find('.chips-select__clear').exists()).toBe(true);
    });

    it('should not show clear button when empty', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, clearable: true },
      });

      expect(wrapper.find('.chips-select__clear').exists()).toBe(false);
    });

    it('should clear value on click', async () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          clearable: true,
          modelValue: 'option1',
        },
      });

      await wrapper.find('.chips-select__clear').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });

    it('should clear multiple values', async () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          clearable: true,
          multiple: true,
          modelValue: ['option1', 'option2'],
        },
      });

      await wrapper.find('.chips-select__clear').trigger('click');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([[]]);
    });
  });

  describe('keyboard navigation', () => {
    it('should open dropdown on Enter', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select').trigger('keydown', { key: 'Enter' });

      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--open');
    });

    it('should close dropdown on Escape', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      expect(wrapper.find('.chips-select').classes()).toContain('chips-select--open');

      await wrapper.find('.chips-select').trigger('keydown', { key: 'Escape' });

      expect(wrapper.find('.chips-select').classes()).not.toContain('chips-select--open');
    });

    it('should navigate options with ArrowDown', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.find('.chips-select').trigger('keydown', { key: 'ArrowDown' });

      const activeOption = wrapper.find('.chips-select__option--active');
      expect(activeOption.exists()).toBe(true);
    });

    it('should select option on Enter', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.find('.chips-select').trigger('keydown', { key: 'ArrowDown' });
      await wrapper.find('.chips-select').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should skip disabled options during navigation', async () => {
      const optionsWithFirstDisabled: SelectOption[] = [
        { label: '禁用', value: 'disabled1', disabled: true },
        { label: '可选', value: 'enabled' },
      ];

      wrapper = mount(Select, {
        props: { options: optionsWithFirstDisabled },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.find('.chips-select').trigger('keydown', { key: 'ArrowDown' });

      // Should skip the disabled option and highlight the enabled one
      const options = wrapper.findAll('.chips-select__option');
      expect(options.at(1)?.classes()).toContain('chips-select__option--active');
    });
  });

  describe('events', () => {
    it('should emit focus event', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('focus');

      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('should emit blur event', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
        attachTo: document.body,
      });

      await wrapper.find('.chips-select__selector').trigger('focus');
      await wrapper.find('.chips-select__selector').trigger('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      const selector = wrapper.find('.chips-select__selector');
      expect(selector.attributes('role')).toBe('combobox');
      expect(selector.attributes('aria-haspopup')).toBe('true');
      expect(selector.attributes('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when open', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select__selector').attributes('aria-expanded')).toBe('true');
    });

    it('should have listbox role on dropdown', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select__dropdown').attributes('role')).toBe('listbox');
    });

    it('should have option role on options', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      const option = wrapper.find('.chips-select__option');
      expect(option.attributes('role')).toBe('option');
    });

    it('should mark selected option with aria-selected', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, modelValue: 'option1' },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      const selectedOption = wrapper.find('.chips-select__option--selected');
      expect(selectedOption.attributes('aria-selected')).toBe('true');
    });

    it('should set aria-multiselectable in multiple mode', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions, multiple: true },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select__dropdown').attributes('aria-multiselectable')).toBe('true');
    });
  });

  describe('slots', () => {
    it('should render custom option content', async () => {
      wrapper = mount(Select, {
        props: { options: mockOptions },
        slots: {
          option: ({ option }: { option: SelectOption }) => `Custom: ${option.label}`,
        },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select__option').text()).toContain('Custom: 选项一');
    });

    it('should render empty slot', async () => {
      wrapper = mount(Select, {
        props: { options: [] },
        slots: {
          empty: () => '暂无数据',
        },
      });

      await wrapper.find('.chips-select__selector').trigger('click');

      expect(wrapper.find('.chips-select__empty').text()).toBe('暂无数据');
    });

    it('should render custom tag content in multiple mode', () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          multiple: true,
          modelValue: ['option1'],
        },
        slots: {
          tag: ({ option }: { option: SelectOption }) => `Tag: ${option.label}`,
        },
      });

      expect(wrapper.find('.chips-select__tag-text').text()).toContain('Tag: 选项一');
    });
  });

  describe('uncontrolled mode', () => {
    it('should work with defaultValue', async () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          defaultValue: 'option1',
        },
      });

      expect(wrapper.find('.chips-select__value').text()).toBe('选项一');
    });

    it('should update internal state when uncontrolled', async () => {
      wrapper = mount(Select, {
        props: {
          options: mockOptions,
          defaultValue: 'option1',
        },
      });

      await wrapper.find('.chips-select__selector').trigger('click');
      await wrapper.findAll('.chips-select__option').at(1)?.trigger('click');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option2']);
    });
  });
});
