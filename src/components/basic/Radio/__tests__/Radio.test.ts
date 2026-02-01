import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Radio from '../Radio.vue';
import RadioGroup from '../RadioGroup.vue';

describe('Radio', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' },
        slots: {
          default: 'Option A',
        },
      });

      expect(wrapper.find('label').exists()).toBe(true);
      expect(wrapper.find('input[type="radio"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Option A');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' },
      });
      const label = wrapper.find('label');

      expect(label.classes()).toContain('chips-radio');
      expect(label.classes()).toContain('chips-radio--medium');
    });

    it('should render inner element', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' },
      });

      expect(wrapper.find('.chips-radio__inner').exists()).toBe(true);
    });

    it('should render label when slot provided', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' },
        slots: {
          default: 'Label Text',
        },
      });

      expect(wrapper.find('.chips-radio__label').exists()).toBe(true);
      expect(wrapper.find('.chips-radio__label').text()).toBe('Label Text');
    });

    it('should not render label when no slot provided', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' },
      });

      expect(wrapper.find('.chips-radio__label').exists()).toBe(false);
    });
  });

  describe('checked state', () => {
    it('should be checked when modelValue equals value', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          modelValue: 'a',
        },
      });
      const label = wrapper.find('label');
      const input = wrapper.find('input');

      expect(label.classes()).toContain('chips-radio--checked');
      expect((input.element as HTMLInputElement).checked).toBe(true);
    });

    it('should not be checked when modelValue differs from value', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          modelValue: 'b',
        },
      });
      const label = wrapper.find('label');
      const input = wrapper.find('input');

      expect(label.classes()).not.toContain('chips-radio--checked');
      expect((input.element as HTMLInputElement).checked).toBe(false);
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          disabled: true,
        },
      });
      const label = wrapper.find('label');
      const input = wrapper.find('input');

      expect(label.classes()).toContain('chips-radio--disabled');
      expect(input.attributes('disabled')).toBeDefined();
    });

    it('should not emit change when disabled', async () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          disabled: true,
        },
      });

      await wrapper.find('input').trigger('change');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('change')).toBeFalsy();
    });
  });

  describe('events', () => {
    it('should emit update:modelValue and change on change', async () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
        },
      });

      await wrapper.find('input').trigger('change');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['a']);
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual(['a']);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          modelValue: 'a',
        },
      });
      const label = wrapper.find('label');

      expect(label.attributes('role')).toBe('radio');
      expect(label.attributes('aria-checked')).toBe('true');
    });

    it('should have aria-disabled when disabled', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          disabled: true,
        },
      });

      expect(wrapper.find('label').attributes('aria-disabled')).toBe('true');
    });
  });

  describe('name attribute', () => {
    it('should apply name attribute to input', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          name: 'my-radio',
        },
      });

      expect(wrapper.find('input').attributes('name')).toBe('my-radio');
    });
  });
});

describe('RadioGroup', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
        },
        slots: {
          default: () => [
            h(Radio, { value: 'a' }, () => 'Option A'),
            h(Radio, { value: 'b' }, () => 'Option B'),
          ],
        },
      });

      expect(wrapper.find('div').exists()).toBe(true);
      expect(wrapper.findAllComponents(Radio)).toHaveLength(2);
    });

    it('should render with default classes', () => {
      const wrapper = mount(RadioGroup, {
        props: { modelValue: 'a' },
      });
      const div = wrapper.find('div');

      expect(div.classes()).toContain('chips-radio-group');
      expect(div.classes()).toContain('chips-radio-group--medium');
    });

    it('should render options from props', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          options: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
            { value: 'c', label: 'Option C' },
          ],
        },
      });

      expect(wrapper.findAllComponents(Radio)).toHaveLength(3);
      expect(wrapper.text()).toContain('Option A');
      expect(wrapper.text()).toContain('Option B');
      expect(wrapper.text()).toContain('Option C');
    });
  });

  describe('direction', () => {
    it('should apply vertical class when direction is vertical', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          direction: 'vertical',
        },
      });

      expect(wrapper.find('div').classes()).toContain('chips-radio-group--vertical');
    });

    it('should not apply vertical class when direction is horizontal', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          direction: 'horizontal',
        },
      });

      expect(wrapper.find('div').classes()).not.toContain('chips-radio-group--vertical');
    });
  });

  describe('optionType', () => {
    it('should apply button class when optionType is button', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          optionType: 'button',
        },
        slots: {
          default: () => [h(Radio, { value: 'a' }, () => 'A')],
        },
      });

      expect(wrapper.find('div').classes()).toContain('chips-radio-group--button');
      // Child Radio should also have button class via inject
      expect(wrapper.findComponent(Radio).find('label').classes()).toContain('chips-radio--button');
    });
  });

  describe('sizes', () => {
    it.each([
      ['small', 'chips-radio-group--small'],
      ['medium', 'chips-radio-group--medium'],
      ['large', 'chips-radio-group--large'],
    ] as const)('should render %s size', (size, expectedClass) => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          size,
        },
      });

      expect(wrapper.find('div').classes()).toContain(expectedClass);
    });
  });

  describe('disabled state', () => {
    it('should apply disabled class when disabled', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          disabled: true,
        },
      });

      expect(wrapper.find('div').classes()).toContain('chips-radio-group--disabled');
    });

    it('should disable all child radios when group is disabled', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          disabled: true,
        },
        slots: {
          default: () => [
            h(Radio, { value: 'a' }, () => 'A'),
            h(Radio, { value: 'b' }, () => 'B'),
          ],
        },
      });

      const radios = wrapper.findAllComponents(Radio);
      radios.forEach((radio) => {
        expect(radio.find('label').classes()).toContain('chips-radio--disabled');
      });
    });
  });

  describe('events', () => {
    it('should emit update:modelValue and change when radio is selected', async () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
        },
        slots: {
          default: () => [
            h(Radio, { value: 'a' }, () => 'A'),
            h(Radio, { value: 'b' }, () => 'B'),
          ],
        },
      });

      const radios = wrapper.findAllComponents(Radio);
      await radios[1].find('input').trigger('change');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['b']);
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual(['b']);
    });

    it('should not emit when disabled radio is clicked', async () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          disabled: true,
        },
        slots: {
          default: () => [
            h(Radio, { value: 'a' }, () => 'A'),
            h(Radio, { value: 'b' }, () => 'B'),
          ],
        },
      });

      const radios = wrapper.findAllComponents(Radio);
      await radios[1].find('input').trigger('change');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('accessibility', () => {
    it('should have proper role attribute', () => {
      const wrapper = mount(RadioGroup, {
        props: { modelValue: 'a' },
      });

      expect(wrapper.find('div').attributes('role')).toBe('radiogroup');
    });

    it('should have aria-disabled when disabled', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          disabled: true,
        },
      });

      expect(wrapper.find('div').attributes('aria-disabled')).toBe('true');
    });
  });

  describe('checked state in group', () => {
    it('should check correct radio based on modelValue', async () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'b',
        },
        slots: {
          default: () => [
            h(Radio, { value: 'a' }, () => 'A'),
            h(Radio, { value: 'b' }, () => 'B'),
            h(Radio, { value: 'c' }, () => 'C'),
          ],
        },
      });

      const radios = wrapper.findAllComponents(Radio);

      expect(radios[0].find('label').classes()).not.toContain('chips-radio--checked');
      expect(radios[1].find('label').classes()).toContain('chips-radio--checked');
      expect(radios[2].find('label').classes()).not.toContain('chips-radio--checked');
    });
  });

  describe('options with disabled items', () => {
    it('should disable specific options', () => {
      const wrapper = mount(RadioGroup, {
        props: {
          modelValue: 'a',
          options: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B', disabled: true },
            { value: 'c', label: 'Option C' },
          ],
        },
      });

      const radios = wrapper.findAllComponents(Radio);
      expect(radios[0].find('label').classes()).not.toContain('chips-radio--disabled');
      expect(radios[1].find('label').classes()).toContain('chips-radio--disabled');
      expect(radios[2].find('label').classes()).not.toContain('chips-radio--disabled');
    });
  });
});
