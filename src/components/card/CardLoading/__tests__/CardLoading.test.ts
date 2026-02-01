import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardLoading from '../CardLoading.vue';

describe('CardLoading', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(CardLoading);

      expect(wrapper.find('div.chips-card-loading').exists()).toBe(true);
    });

    it('should render spinner area', () => {
      const wrapper = mount(CardLoading);

      expect(wrapper.find('.chips-card-loading__spinner').exists()).toBe(true);
    });
  });

  describe('tip', () => {
    it('should render tip when tip prop is provided', () => {
      const wrapper = mount(CardLoading, {
        props: { tip: 'Loading...' },
      });

      expect(wrapper.find('.chips-card-loading__tip').exists()).toBe(true);
      expect(wrapper.find('.chips-card-loading__tip').text()).toBe('Loading...');
    });

    it('should not render tip when no tip prop', () => {
      const wrapper = mount(CardLoading);

      expect(wrapper.find('.chips-card-loading__tip').exists()).toBe(false);
    });

    it('should render tip slot (overriding tip prop)', () => {
      const wrapper = mount(CardLoading, {
        props: { tip: 'Prop Tip' },
        slots: {
          tip: '<span class="custom-tip">Slot Tip</span>',
        },
      });

      expect(wrapper.find('.chips-card-loading__tip .custom-tip').exists()).toBe(true);
      expect(wrapper.find('.chips-card-loading__tip').text()).toBe('Slot Tip');
    });

    it('should render tip area when tip slot is provided', () => {
      const wrapper = mount(CardLoading, {
        slots: {
          tip: '<span>Custom Tip</span>',
        },
      });

      expect(wrapper.find('.chips-card-loading__tip').exists()).toBe(true);
    });
  });

  describe('slots', () => {
    it('should render default slot in spinner area', () => {
      const wrapper = mount(CardLoading, {
        slots: {
          default: '<div class="custom-spinner">Loading Icon</div>',
        },
      });

      expect(wrapper.find('.chips-card-loading__spinner .custom-spinner').exists()).toBe(true);
    });

    it('should render both spinner and tip slots', () => {
      const wrapper = mount(CardLoading, {
        slots: {
          default: '<div class="spinner">Spinner</div>',
          tip: '<span class="tip">Please wait...</span>',
        },
      });

      expect(wrapper.find('.chips-card-loading__spinner .spinner').exists()).toBe(true);
      expect(wrapper.find('.chips-card-loading__tip .tip').exists()).toBe(true);
    });
  });

  describe('combinations', () => {
    it('should render with tip prop and custom spinner', () => {
      const wrapper = mount(CardLoading, {
        props: { tip: 'Loading data...' },
        slots: {
          default: '<svg class="spinner-svg"></svg>',
        },
      });

      expect(wrapper.find('.chips-card-loading__spinner .spinner-svg').exists()).toBe(true);
      expect(wrapper.find('.chips-card-loading__tip').text()).toBe('Loading data...');
    });
  });
});
