import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Flex from '../Flex.vue';

describe('Flex', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Flex, {
        slots: {
          default: '<div>Content</div>',
        },
      });

      expect(wrapper.find('div.chips-flex').exists()).toBe(true);
      expect(wrapper.text()).toContain('Content');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Flex);
      const flex = wrapper.find('div.chips-flex');

      expect(flex.classes()).toContain('chips-flex');
      expect(flex.classes()).toContain('chips-flex--direction-row');
      expect(flex.classes()).toContain('chips-flex--justify-start');
      expect(flex.classes()).toContain('chips-flex--align-stretch');
      expect(flex.classes()).toContain('chips-flex--wrap-nowrap');
    });
  });

  describe('direction', () => {
    it.each([
      ['row', 'chips-flex--direction-row'],
      ['row-reverse', 'chips-flex--direction-row-reverse'],
      ['column', 'chips-flex--direction-column'],
      ['column-reverse', 'chips-flex--direction-column-reverse'],
    ] as const)('should render direction %s', (direction, expectedClass) => {
      const wrapper = mount(Flex, {
        props: { direction },
      });

      expect(wrapper.find('div.chips-flex').classes()).toContain(expectedClass);
    });
  });

  describe('justify', () => {
    it.each([
      ['start', 'chips-flex--justify-start'],
      ['end', 'chips-flex--justify-end'],
      ['center', 'chips-flex--justify-center'],
      ['space-between', 'chips-flex--justify-space-between'],
      ['space-around', 'chips-flex--justify-space-around'],
      ['space-evenly', 'chips-flex--justify-space-evenly'],
    ] as const)('should render justify %s', (justify, expectedClass) => {
      const wrapper = mount(Flex, {
        props: { justify },
      });

      expect(wrapper.find('div.chips-flex').classes()).toContain(expectedClass);
    });
  });

  describe('align', () => {
    it.each([
      ['start', 'chips-flex--align-start'],
      ['end', 'chips-flex--align-end'],
      ['center', 'chips-flex--align-center'],
      ['baseline', 'chips-flex--align-baseline'],
      ['stretch', 'chips-flex--align-stretch'],
    ] as const)('should render align %s', (align, expectedClass) => {
      const wrapper = mount(Flex, {
        props: { align },
      });

      expect(wrapper.find('div.chips-flex').classes()).toContain(expectedClass);
    });
  });

  describe('wrap', () => {
    it.each([
      ['nowrap', 'chips-flex--wrap-nowrap'],
      ['wrap', 'chips-flex--wrap-wrap'],
      ['wrap-reverse', 'chips-flex--wrap-wrap-reverse'],
    ] as const)('should render wrap %s', (wrap, expectedClass) => {
      const wrapper = mount(Flex, {
        props: { wrap },
      });

      expect(wrapper.find('div.chips-flex').classes()).toContain(expectedClass);
    });
  });

  describe('inline', () => {
    it('should render inline flex', () => {
      const wrapper = mount(Flex, {
        props: { inline: true },
      });

      expect(wrapper.find('div.chips-flex').classes()).toContain('chips-flex--inline');
    });

    it('should not have inline class by default', () => {
      const wrapper = mount(Flex);

      expect(wrapper.find('div.chips-flex').classes()).not.toContain('chips-flex--inline');
    });
  });

  describe('gap', () => {
    it('should apply single gap value', () => {
      const wrapper = mount(Flex, {
        props: { gap: 16 },
      });

      const style = wrapper.find('div.chips-flex').attributes('style');
      expect(style).toContain('gap: 16px');
    });

    it('should apply array gap value [rowGap, columnGap]', () => {
      const wrapper = mount(Flex, {
        props: { gap: [8, 16] },
      });

      const style = wrapper.find('div.chips-flex').attributes('style');
      expect(style).toContain('row-gap: 8px');
      expect(style).toContain('column-gap: 16px');
    });

    it('should not have gap style when gap is undefined', () => {
      const wrapper = mount(Flex);

      const style = wrapper.find('div.chips-flex').attributes('style');
      expect(style).toBeUndefined();
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Flex, {
        slots: {
          default: '<span class="child">Child 1</span><span class="child">Child 2</span>',
        },
      });

      const children = wrapper.findAll('.child');
      expect(children).toHaveLength(2);
    });

    it('should render Vue components in slot', () => {
      const wrapper = mount(Flex, {
        slots: {
          default: '<div data-testid="test-child">Test Content</div>',
        },
      });

      expect(wrapper.find('[data-testid="test-child"]').exists()).toBe(true);
    });
  });

  describe('combinations', () => {
    it('should apply multiple props correctly', () => {
      const wrapper = mount(Flex, {
        props: {
          direction: 'column',
          justify: 'center',
          align: 'center',
          wrap: 'wrap',
          inline: true,
          gap: 24,
        },
      });

      const flex = wrapper.find('div.chips-flex');
      expect(flex.classes()).toContain('chips-flex--direction-column');
      expect(flex.classes()).toContain('chips-flex--justify-center');
      expect(flex.classes()).toContain('chips-flex--align-center');
      expect(flex.classes()).toContain('chips-flex--wrap-wrap');
      expect(flex.classes()).toContain('chips-flex--inline');
      expect(flex.attributes('style')).toContain('gap: 24px');
    });
  });
});
