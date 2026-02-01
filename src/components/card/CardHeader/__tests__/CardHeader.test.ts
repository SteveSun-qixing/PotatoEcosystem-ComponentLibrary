import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CardHeader from '../CardHeader.vue';

describe('CardHeader', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(CardHeader);

      expect(wrapper.find('div.chips-card-header').exists()).toBe(true);
    });

    it('should render with title prop', () => {
      const wrapper = mount(CardHeader, {
        props: { title: 'Header Title' },
      });

      expect(wrapper.find('.chips-card-header__title').text()).toBe('Header Title');
    });
  });

  describe('slots', () => {
    it('should render default slot (overriding title prop)', () => {
      const wrapper = mount(CardHeader, {
        props: { title: 'Prop Title' },
        slots: {
          default: '<span class="custom-title">Slot Title</span>',
        },
      });

      expect(wrapper.find('.chips-card-header__title .custom-title').exists()).toBe(true);
      expect(wrapper.find('.chips-card-header__title').text()).toBe('Slot Title');
    });

    it('should render actions slot', () => {
      const wrapper = mount(CardHeader, {
        slots: {
          actions: '<button class="action-btn">Action</button>',
        },
      });

      expect(wrapper.find('.chips-card-header__actions').exists()).toBe(true);
      expect(wrapper.find('.chips-card-header__actions .action-btn').exists()).toBe(true);
    });

    it('should not render actions area when no actions slot and not closable', () => {
      const wrapper = mount(CardHeader, {
        props: { closable: false },
      });

      expect(wrapper.find('.chips-card-header__actions').exists()).toBe(false);
    });
  });

  describe('closable', () => {
    it('should render close button when closable', () => {
      const wrapper = mount(CardHeader, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-card-header__actions').exists()).toBe(true);
      expect(wrapper.find('.chips-card-header__close').exists()).toBe(true);
    });

    it('should not render close button by default', () => {
      const wrapper = mount(CardHeader);

      expect(wrapper.find('.chips-card-header__close').exists()).toBe(false);
    });

    it('should emit close event when close button clicked', async () => {
      const wrapper = mount(CardHeader, {
        props: { closable: true },
      });

      await wrapper.find('.chips-card-header__close').trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should render close button with default icon', () => {
      const wrapper = mount(CardHeader, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-card-header__close').text()).toBe('×');
    });

    it('should render custom close icon via slot', () => {
      const wrapper = mount(CardHeader, {
        props: { closable: true },
        slots: {
          'close-icon': '<span class="custom-icon">Close</span>',
        },
      });

      expect(wrapper.find('.chips-card-header__close .custom-icon').exists()).toBe(true);
    });
  });

  describe('combinations', () => {
    it('should render title, actions, and close button together', () => {
      const onClose = vi.fn();
      const wrapper = mount(CardHeader, {
        props: {
          title: 'Title',
          closable: true,
        },
        slots: {
          actions: '<button class="action">Action</button>',
        },
        attrs: {
          onClose,
        },
      });

      expect(wrapper.find('.chips-card-header__title').text()).toBe('Title');
      expect(wrapper.find('.chips-card-header__actions .action').exists()).toBe(true);
      expect(wrapper.find('.chips-card-header__close').exists()).toBe(true);
    });
  });
});
