import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Empty from '../Empty.vue';

describe('Empty', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Empty);

      expect(wrapper.find('.chips-empty').exists()).toBe(true);
    });

    it('should render with default classes', () => {
      const wrapper = mount(Empty);

      expect(wrapper.find('.chips-empty').classes()).toContain('chips-empty');
    });
  });

  describe('image', () => {
    it('should render image from URL string prop', () => {
      const wrapper = mount(Empty, {
        props: { image: 'https://example.com/empty.png' },
      });

      expect(wrapper.find('.chips-empty__image').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__image img').attributes('src')).toBe('https://example.com/empty.png');
    });

    it('should render image from VNode prop', () => {
      const CustomImage = {
        render() {
          return h('div', { class: 'custom-image' }, 'Custom');
        },
      };

      const wrapper = mount(Empty, {
        props: { image: h(CustomImage) },
      });

      expect(wrapper.find('.chips-empty__image').exists()).toBe(true);
      expect(wrapper.find('.custom-image').exists()).toBe(true);
    });

    it('should render image from slot', () => {
      const wrapper = mount(Empty, {
        slots: {
          image: '<div class="slot-image">Slot Image</div>',
        },
      });

      expect(wrapper.find('.chips-empty__image').exists()).toBe(true);
      expect(wrapper.find('.slot-image').exists()).toBe(true);
    });

    it('should prefer slot over prop for image', () => {
      const wrapper = mount(Empty, {
        props: { image: 'https://example.com/empty.png' },
        slots: {
          image: '<div class="slot-image">Slot Image</div>',
        },
      });

      expect(wrapper.find('.slot-image').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__image img').exists()).toBe(false);
    });

    it('should not render image section when no image provided', () => {
      const wrapper = mount(Empty, {
        props: { description: 'No data' },
      });

      expect(wrapper.find('.chips-empty__image').exists()).toBe(false);
    });

    it('should apply imageStyle to image container', () => {
      const wrapper = mount(Empty, {
        props: {
          image: 'https://example.com/empty.png',
          imageStyle: { height: '100px', marginBottom: '20px' },
        },
      });
      const style = wrapper.find('.chips-empty__image').attributes('style');

      expect(style).toContain('height: 100px');
      expect(style).toContain('margin-bottom: 20px');
    });
  });

  describe('description', () => {
    it('should render description from string prop', () => {
      const wrapper = mount(Empty, {
        props: { description: 'No data available' },
      });

      expect(wrapper.find('.chips-empty__description').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__description').text()).toBe('No data available');
    });

    it('should render description from VNode prop', () => {
      const CustomDescription = {
        render() {
          return h('span', { class: 'custom-desc' }, 'Custom Description');
        },
      };

      const wrapper = mount(Empty, {
        props: { description: h(CustomDescription) },
      });

      expect(wrapper.find('.chips-empty__description').exists()).toBe(true);
      expect(wrapper.find('.custom-desc').exists()).toBe(true);
    });

    it('should render description from slot', () => {
      const wrapper = mount(Empty, {
        slots: {
          description: '<em class="slot-desc">Slot Description</em>',
        },
      });

      expect(wrapper.find('.chips-empty__description').exists()).toBe(true);
      expect(wrapper.find('.slot-desc').exists()).toBe(true);
    });

    it('should prefer slot over prop for description', () => {
      const wrapper = mount(Empty, {
        props: { description: 'Prop description' },
        slots: {
          description: '<em class="slot-desc">Slot Description</em>',
        },
      });

      expect(wrapper.find('.slot-desc').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__description').text()).not.toContain('Prop description');
    });

    it('should not render description section when no description provided', () => {
      const wrapper = mount(Empty, {
        props: { image: 'https://example.com/empty.png' },
      });

      expect(wrapper.find('.chips-empty__description').exists()).toBe(false);
    });
  });

  describe('footer', () => {
    it('should render footer from default slot', () => {
      const wrapper = mount(Empty, {
        slots: {
          default: '<button class="action-btn">Create Now</button>',
        },
      });

      expect(wrapper.find('.chips-empty__footer').exists()).toBe(true);
      expect(wrapper.find('.action-btn').exists()).toBe(true);
    });

    it('should not render footer when no default slot', () => {
      const wrapper = mount(Empty, {
        props: { description: 'No data' },
      });

      expect(wrapper.find('.chips-empty__footer').exists()).toBe(false);
    });
  });

  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Empty);

      await wrapper.find('.chips-empty').trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.length).toBe(1);
    });
  });

  describe('combined props', () => {
    it('should render all sections when all props provided', () => {
      const wrapper = mount(Empty, {
        props: {
          image: 'https://example.com/empty.png',
          description: 'No data available',
          imageStyle: { height: '80px' },
        },
        slots: {
          default: '<button>Create</button>',
        },
      });

      expect(wrapper.find('.chips-empty__image').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__description').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__footer').exists()).toBe(true);
    });

    it('should render only specified sections', () => {
      const wrapper = mount(Empty, {
        props: { description: 'No data' },
      });

      expect(wrapper.find('.chips-empty__image').exists()).toBe(false);
      expect(wrapper.find('.chips-empty__description').exists()).toBe(true);
      expect(wrapper.find('.chips-empty__footer').exists()).toBe(false);
    });
  });

  describe('slots', () => {
    it('should render all slots', () => {
      const wrapper = mount(Empty, {
        slots: {
          image: '<div class="slot-image">Image</div>',
          description: '<div class="slot-desc">Description</div>',
          default: '<div class="slot-footer">Footer</div>',
        },
      });

      expect(wrapper.find('.slot-image').exists()).toBe(true);
      expect(wrapper.find('.slot-desc').exists()).toBe(true);
      expect(wrapper.find('.slot-footer').exists()).toBe(true);
    });
  });
});
