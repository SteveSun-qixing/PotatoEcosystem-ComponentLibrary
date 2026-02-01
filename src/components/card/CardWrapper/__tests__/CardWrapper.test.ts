import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardWrapper from '../CardWrapper.vue';

describe('CardWrapper', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(CardWrapper, {
        slots: {
          default: '<div>Content</div>',
        },
      });

      expect(wrapper.find('div.chips-card-wrapper').exists()).toBe(true);
      expect(wrapper.text()).toContain('Content');
    });

    it('should render with default class only', () => {
      const wrapper = mount(CardWrapper);
      const cardWrapper = wrapper.find('div.chips-card-wrapper');

      expect(cardWrapper.classes()).toContain('chips-card-wrapper');
      expect(cardWrapper.classes()).not.toContain('chips-card-wrapper--editable');
      expect(cardWrapper.classes()).not.toContain('chips-card-wrapper--loading');
      expect(cardWrapper.classes()).not.toContain('chips-card-wrapper--error');
    });
  });

  describe('props', () => {
    it('should set data-card-id attribute', () => {
      const wrapper = mount(CardWrapper, {
        props: { cardId: 'card-123' },
      });

      expect(wrapper.find('div.chips-card-wrapper').attributes('data-card-id')).toBe('card-123');
    });

    it('should set data-card-type attribute', () => {
      const wrapper = mount(CardWrapper, {
        props: { cardType: 'basic' },
      });

      expect(wrapper.find('div.chips-card-wrapper').attributes('data-card-type')).toBe('basic');
    });

    it('should set data-theme attribute', () => {
      const wrapper = mount(CardWrapper, {
        props: { theme: 'dark' },
      });

      expect(wrapper.find('div.chips-card-wrapper').attributes('data-theme')).toBe('dark');
    });

    it('should render editable wrapper', () => {
      const wrapper = mount(CardWrapper, {
        props: { editable: true },
      });

      expect(wrapper.find('div.chips-card-wrapper').classes()).toContain('chips-card-wrapper--editable');
    });

    it('should render loading wrapper', () => {
      const wrapper = mount(CardWrapper, {
        props: { loading: true },
      });

      expect(wrapper.find('div.chips-card-wrapper').classes()).toContain('chips-card-wrapper--loading');
    });

    it('should render error wrapper', () => {
      const wrapper = mount(CardWrapper, {
        props: { error: new Error('Test error') },
      });

      expect(wrapper.find('div.chips-card-wrapper').classes()).toContain('chips-card-wrapper--error');
    });

    it('should not have error class when error is null', () => {
      const wrapper = mount(CardWrapper, {
        props: { error: null },
      });

      expect(wrapper.find('div.chips-card-wrapper').classes()).not.toContain('chips-card-wrapper--error');
    });
  });

  describe('slots', () => {
    it('should render default slot in content area', () => {
      const wrapper = mount(CardWrapper, {
        slots: {
          default: '<span class="content">Main Content</span>',
        },
      });

      expect(wrapper.find('.chips-card-wrapper__content .content').exists()).toBe(true);
    });

    it('should render header slot', () => {
      const wrapper = mount(CardWrapper, {
        slots: {
          header: '<div class="header-content">Header</div>',
        },
      });

      expect(wrapper.find('.chips-card-wrapper__header').exists()).toBe(true);
      expect(wrapper.find('.chips-card-wrapper__header .header-content').exists()).toBe(true);
    });

    it('should render footer slot', () => {
      const wrapper = mount(CardWrapper, {
        slots: {
          footer: '<div class="footer-content">Footer</div>',
        },
      });

      expect(wrapper.find('.chips-card-wrapper__footer').exists()).toBe(true);
      expect(wrapper.find('.chips-card-wrapper__footer .footer-content').exists()).toBe(true);
    });

    it('should not render header when no header slot', () => {
      const wrapper = mount(CardWrapper);

      expect(wrapper.find('.chips-card-wrapper__header').exists()).toBe(false);
    });

    it('should not render footer when no footer slot', () => {
      const wrapper = mount(CardWrapper);

      expect(wrapper.find('.chips-card-wrapper__footer').exists()).toBe(false);
    });
  });

  describe('combinations', () => {
    it('should apply multiple props correctly', () => {
      const wrapper = mount(CardWrapper, {
        props: {
          cardId: 'card-1',
          cardType: 'widget',
          theme: 'light',
          editable: true,
          loading: true,
        },
      });

      const cardWrapper = wrapper.find('div.chips-card-wrapper');
      expect(cardWrapper.attributes('data-card-id')).toBe('card-1');
      expect(cardWrapper.attributes('data-card-type')).toBe('widget');
      expect(cardWrapper.attributes('data-theme')).toBe('light');
      expect(cardWrapper.classes()).toContain('chips-card-wrapper--editable');
      expect(cardWrapper.classes()).toContain('chips-card-wrapper--loading');
    });

    it('should render all slots together', () => {
      const wrapper = mount(CardWrapper, {
        slots: {
          header: '<div>Header</div>',
          default: '<div>Content</div>',
          footer: '<div>Footer</div>',
        },
      });

      expect(wrapper.find('.chips-card-wrapper__header').exists()).toBe(true);
      expect(wrapper.find('.chips-card-wrapper__content').exists()).toBe(true);
      expect(wrapper.find('.chips-card-wrapper__footer').exists()).toBe(true);
    });
  });
});
