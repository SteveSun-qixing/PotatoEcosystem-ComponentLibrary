import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import Checkbox from '../Checkbox.vue';
import CheckboxGroup from '../CheckboxGroup.vue';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Checkbox, {
        slots: {
          default: 'Check me',
        },
      });

      expect(wrapper.find('label').exists()).toBe(true);
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Check me');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Checkbox);
      const label = wrapper.find('label');

      expect(label.classes()).toContain('chips-checkbox');
    });

    it('should render label slot', () => {
      const wrapper = mount(Checkbox, {
        slots: {
          default: '<span class="custom-label">Custom Label</span>',
        },
      });

      expect(wrapper.find('.chips-checkbox__label').exists()).toBe(true);
      expect(wrapper.find('.custom-label').exists()).toBe(true);
    });
  });

  describe('checked state', () => {
    it('should be unchecked by default', () => {
      const wrapper = mount(Checkbox);
      const input = wrapper.find('input');

      expect(input.element.checked).toBe(false);
      expect(wrapper.find('label').classes()).not.toContain('chips-checkbox--checked');
    });

    it('should be checked when modelValue is true', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: true },
      });
      const input = wrapper.find('input');

      expect(input.element.checked).toBe(true);
      expect(wrapper.find('label').classes()).toContain('chips-checkbox--checked');
    });

    it('should be checked when defaultChecked is true (uncontrolled)', () => {
      const wrapper = mount(Checkbox, {
        props: { defaultChecked: true },
      });
      const input = wrapper.find('input');

      expect(input.element.checked).toBe(true);
      expect(wrapper.find('label').classes()).toContain('chips-checkbox--checked');
    });

    it('should toggle checked state', async () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false },
      });
      const input = wrapper.find('input');

      await input.setValue(true);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(Checkbox, {
        props: { disabled: true },
      });
      const input = wrapper.find('input');
      const label = wrapper.find('label');

      expect(input.element.disabled).toBe(true);
      expect(label.classes()).toContain('chips-checkbox--disabled');
      expect(label.attributes('aria-disabled')).toBe('true');
    });

    it('should not emit change when disabled', async () => {
      const wrapper = mount(Checkbox, {
        props: { disabled: true },
      });
      const input = wrapper.find('input');

      await input.trigger('change');

      expect(wrapper.emitted('change')).toBeFalsy();
    });
  });

  describe('indeterminate state', () => {
    it('should have indeterminate class', () => {
      const wrapper = mount(Checkbox, {
        props: { indeterminate: true },
      });
      const label = wrapper.find('label');

      expect(label.classes()).toContain('chips-checkbox--indeterminate');
    });

    it('should show icon when indeterminate', () => {
      const wrapper = mount(Checkbox, {
        props: { indeterminate: true },
      });

      expect(wrapper.find('.chips-checkbox__icon').exists()).toBe(true);
    });

    it('should have aria-checked="mixed" when indeterminate', () => {
      const wrapper = mount(Checkbox, {
        props: { indeterminate: true },
      });
      const input = wrapper.find('input');

      expect(input.attributes('aria-checked')).toBe('mixed');
    });
  });

  describe('events', () => {
    it('should emit update:modelValue on change', async () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false },
      });
      const input = wrapper.find('input');

      await input.setValue(true);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    it('should emit change event', async () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false },
      });
      const input = wrapper.find('input');

      await input.setValue(true);

      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0][0]).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-checked attribute', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: true },
      });
      const input = wrapper.find('input');

      expect(input.attributes('aria-checked')).toBe('true');
    });

    it('should have proper aria-disabled when disabled', () => {
      const wrapper = mount(Checkbox, {
        props: { disabled: true },
      });
      const label = wrapper.find('label');

      expect(label.attributes('aria-disabled')).toBe('true');
    });
  });

  describe('name attribute', () => {
    it('should set name attribute on input', () => {
      const wrapper = mount(Checkbox, {
        props: { name: 'test-checkbox' },
      });
      const input = wrapper.find('input');

      expect(input.attributes('name')).toBe('test-checkbox');
    });
  });
});

describe('CheckboxGroup', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(CheckboxGroup);

      expect(wrapper.find('div').exists()).toBe(true);
      expect(wrapper.find('div').classes()).toContain('chips-checkbox-group');
    });

    it('should render with default classes', () => {
      const wrapper = mount(CheckboxGroup);
      const group = wrapper.find('div');

      expect(group.classes()).toContain('chips-checkbox-group');
      expect(group.classes()).not.toContain('chips-checkbox-group--vertical');
    });

    it('should render vertical direction', () => {
      const wrapper = mount(CheckboxGroup, {
        props: { direction: 'vertical' },
      });
      const group = wrapper.find('div');

      expect(group.classes()).toContain('chips-checkbox-group--vertical');
    });
  });

  describe('options prop', () => {
    it('should render checkboxes from options', () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C', value: 'c' },
          ],
        },
      });

      const checkboxes = wrapper.findAllComponents(Checkbox);
      expect(checkboxes.length).toBe(3);
      expect(wrapper.text()).toContain('Option A');
      expect(wrapper.text()).toContain('Option B');
      expect(wrapper.text()).toContain('Option C');
    });

    it('should disable individual option', () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b', disabled: true },
          ],
        },
      });

      const checkboxes = wrapper.findAllComponents(Checkbox);
      expect(checkboxes[1].props('disabled')).toBe(true);
    });
  });

  describe('slot children', () => {
    it('should render slot children', () => {
      const wrapper = mount(CheckboxGroup, {
        slots: {
          default: `
            <div class="custom-checkbox">Custom Checkbox 1</div>
            <div class="custom-checkbox">Custom Checkbox 2</div>
          `,
        },
      });

      expect(wrapper.findAll('.custom-checkbox').length).toBe(2);
    });
  });

  describe('modelValue', () => {
    it('should check boxes based on modelValue', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue: ['a', 'c'],
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C', value: 'c' },
          ],
        },
      });

      await nextTick();

      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      expect(checkboxes[0].element.checked).toBe(true);
      expect(checkboxes[1].element.checked).toBe(false);
      expect(checkboxes[2].element.checked).toBe(true);
    });

    it('should emit update:modelValue when checkbox is toggled', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue: [],
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
      });

      const input = wrapper.find('input[type="checkbox"]');
      await input.setValue(true);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a']]);
    });

    it('should emit change event when checkbox is toggled', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue: [],
          options: [
            { label: 'Option A', value: 'a' },
          ],
        },
      });

      const input = wrapper.find('input[type="checkbox"]');
      await input.setValue(true);

      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual([['a']]);
    });

    it('should remove value when unchecked', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          modelValue: ['a', 'b'],
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
      });

      const input = wrapper.find('input[type="checkbox"]');
      await input.setValue(false);

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['b']]);
    });
  });

  describe('disabled state', () => {
    it('should disable all checkboxes when group is disabled', () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          disabled: true,
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
      });

      const group = wrapper.find('div');
      expect(group.classes()).toContain('chips-checkbox-group--disabled');

      const inputs = wrapper.findAll('input[type="checkbox"]');
      inputs.forEach((input) => {
        expect(input.element.disabled).toBe(true);
      });
    });
  });

  describe('name attribute', () => {
    it('should pass name to all child checkboxes', () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          name: 'test-group',
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
      });

      const inputs = wrapper.findAll('input[type="checkbox"]');
      inputs.forEach((input) => {
        expect(input.attributes('name')).toBe('test-group');
      });
    });
  });

  describe('accessibility', () => {
    it('should have role="group"', () => {
      const wrapper = mount(CheckboxGroup);
      const group = wrapper.find('div');

      expect(group.attributes('role')).toBe('group');
    });

    it('should have aria-disabled when disabled', () => {
      const wrapper = mount(CheckboxGroup, {
        props: { disabled: true },
      });
      const group = wrapper.find('div');

      expect(group.attributes('aria-disabled')).toBe('true');
    });
  });

  describe('defaultValue (uncontrolled)', () => {
    it('should use defaultValue when modelValue is not provided', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: {
          defaultValue: ['a'],
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
      });

      await nextTick();

      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      expect(checkboxes[0].element.checked).toBe(true);
      expect(checkboxes[1].element.checked).toBe(false);
    });
  });
});

describe('Checkbox with CheckboxGroup integration', () => {
  it('should work with nested Checkbox components', async () => {
    const wrapper = mount({
      components: { CheckboxGroup, Checkbox },
      template: `
        <CheckboxGroup v-model="selected">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
          <Checkbox value="c">Option C</Checkbox>
        </CheckboxGroup>
      `,
      setup() {
        const selected = ref<(string | number)[]>([]);
        return { selected };
      },
    });

    const inputs = wrapper.findAll('input[type="checkbox"]');

    // Click first checkbox
    await inputs[0].setValue(true);
    expect(wrapper.vm.selected).toEqual(['a']);

    // Click second checkbox
    await inputs[1].setValue(true);
    expect(wrapper.vm.selected).toEqual(['a', 'b']);

    // Uncheck first checkbox
    await inputs[0].setValue(false);
    expect(wrapper.vm.selected).toEqual(['b']);
  });

  it('should inherit disabled state from group', async () => {
    const wrapper = mount({
      components: { CheckboxGroup, Checkbox },
      template: `
        <CheckboxGroup :disabled="true">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      `,
    });

    const inputs = wrapper.findAll('input[type="checkbox"]');
    inputs.forEach((input) => {
      expect(input.element.disabled).toBe(true);
    });

    const labels = wrapper.findAll('label');
    labels.forEach((label) => {
      expect(label.classes()).toContain('chips-checkbox--disabled');
    });
  });

  it('should inherit name from group', () => {
    const wrapper = mount({
      components: { CheckboxGroup, Checkbox },
      template: `
        <CheckboxGroup name="my-group">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      `,
    });

    const inputs = wrapper.findAll('input[type="checkbox"]');
    inputs.forEach((input) => {
      expect(input.attributes('name')).toBe('my-group');
    });
  });
});
