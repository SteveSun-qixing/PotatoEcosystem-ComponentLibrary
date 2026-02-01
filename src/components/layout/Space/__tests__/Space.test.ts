import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Space from '../Space.vue';

describe('Space', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<div>Item 1</div><div>Item 2</div>',
        },
      });

      expect(wrapper.find('div.chips-space').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Space);
      const space = wrapper.find('div.chips-space');

      expect(space.classes()).toContain('chips-space');
      expect(space.classes()).toContain('chips-space--horizontal');
      expect(space.classes()).toContain('chips-space--align-center');
      expect(space.classes()).toContain('chips-space--medium');
    });

    it('should wrap children in space items', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<span>Item 1</span><span>Item 2</span><span>Item 3</span>',
        },
      });

      const items = wrapper.findAll('.chips-space__item');
      expect(items.length).toBe(3);
    });
  });

  describe('direction', () => {
    it.each([
      ['horizontal', 'chips-space--horizontal'],
      ['vertical', 'chips-space--vertical'],
    ] as const)('should render direction %s', (direction, expectedClass) => {
      const wrapper = mount(Space, {
        props: { direction },
      });

      expect(wrapper.find('div.chips-space').classes()).toContain(expectedClass);
    });
  });

  describe('align', () => {
    it.each([
      ['start', 'chips-space--align-start'],
      ['end', 'chips-space--align-end'],
      ['center', 'chips-space--align-center'],
      ['baseline', 'chips-space--align-baseline'],
    ] as const)('should render align %s', (align, expectedClass) => {
      const wrapper = mount(Space, {
        props: { align },
      });

      expect(wrapper.find('div.chips-space').classes()).toContain(expectedClass);
    });
  });

  describe('size', () => {
    describe('preset sizes', () => {
      it.each([
        ['small', 'chips-space--small'],
        ['medium', 'chips-space--medium'],
        ['large', 'chips-space--large'],
      ] as const)('should render size %s', (size, expectedClass) => {
        const wrapper = mount(Space, {
          props: { size },
        });

        expect(wrapper.find('div.chips-space').classes()).toContain(expectedClass);
      });
    });

    describe('numeric size', () => {
      it('should apply single number size as gap', () => {
        const wrapper = mount(Space, {
          props: { size: 20 },
        });

        const style = wrapper.find('div.chips-space').attributes('style');
        expect(style).toContain('gap: 20px');
      });

      it('should not have preset class when using numeric size', () => {
        const wrapper = mount(Space, {
          props: { size: 20 },
        });

        const classes = wrapper.find('div.chips-space').classes();
        expect(classes).not.toContain('chips-space--small');
        expect(classes).not.toContain('chips-space--medium');
        expect(classes).not.toContain('chips-space--large');
      });
    });

    describe('array size', () => {
      it('should apply array size as row-gap and column-gap', () => {
        const wrapper = mount(Space, {
          props: { size: [8, 16] },
        });

        const style = wrapper.find('div.chips-space').attributes('style');
        expect(style).toContain('row-gap: 8px');
        expect(style).toContain('column-gap: 16px');
      });
    });
  });

  describe('wrap', () => {
    it('should render wrap class when wrap is true', () => {
      const wrapper = mount(Space, {
        props: { wrap: true },
      });

      expect(wrapper.find('div.chips-space').classes()).toContain('chips-space--wrap');
    });

    it('should not have wrap class by default', () => {
      const wrapper = mount(Space);

      expect(wrapper.find('div.chips-space').classes()).not.toContain('chips-space--wrap');
    });
  });

  describe('split', () => {
    it('should render split elements between items', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<span>Item 1</span><span>Item 2</span><span>Item 3</span>',
          split: '<span class="divider">|</span>',
        },
      });

      const splits = wrapper.findAll('.chips-space__split');
      // 3 items should have 2 splits (between them)
      expect(splits.length).toBe(2);
    });

    it('should not render split after last item', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<span>Item 1</span><span>Item 2</span>',
          split: '<span class="divider">|</span>',
        },
      });

      const items = wrapper.findAll('.chips-space__item');
      const splits = wrapper.findAll('.chips-space__split');

      expect(items.length).toBe(2);
      expect(splits.length).toBe(1);
    });

    it('should render custom split content', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<span>Item 1</span><span>Item 2</span>',
          split: '<span class="custom-divider">---</span>',
        },
      });

      expect(wrapper.find('.custom-divider').exists()).toBe(true);
      expect(wrapper.find('.custom-divider').text()).toBe('---');
    });

    it('should not render split when no split slot provided', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<span>Item 1</span><span>Item 2</span>',
        },
      });

      expect(wrapper.find('.chips-space__split').exists()).toBe(false);
    });
  });

  describe('empty children handling', () => {
    it('should handle empty slot', () => {
      const wrapper = mount(Space);

      expect(wrapper.find('.chips-space__item').exists()).toBe(false);
    });

    it('should filter out empty text nodes', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '   <span>Item 1</span>   <span>Item 2</span>   ',
        },
      });

      const items = wrapper.findAll('.chips-space__item');
      // Should only count actual elements, not whitespace
      expect(items.length).toBe(2);
    });
  });

  describe('combinations', () => {
    it('should apply multiple props correctly', () => {
      const wrapper = mount(Space, {
        props: {
          size: 'large',
          direction: 'vertical',
          align: 'start',
          wrap: true,
        },
        slots: {
          default: '<span>Item 1</span><span>Item 2</span>',
        },
      });

      const space = wrapper.find('div.chips-space');
      expect(space.classes()).toContain('chips-space--large');
      expect(space.classes()).toContain('chips-space--vertical');
      expect(space.classes()).toContain('chips-space--align-start');
      expect(space.classes()).toContain('chips-space--wrap');
    });
  });

  describe('accessibility', () => {
    it('should preserve content accessibility', () => {
      const wrapper = mount(Space, {
        slots: {
          default: '<button aria-label="Action">Click</button>',
        },
      });

      expect(wrapper.find('button[aria-label="Action"]').exists()).toBe(true);
    });
  });
});
