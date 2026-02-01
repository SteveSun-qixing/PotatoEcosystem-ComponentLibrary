import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardError from '../CardError.vue';

describe('CardError', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(CardError);

      expect(wrapper.find('div.chips-card-error').exists()).toBe(true);
    });

    it('should render icon area with default icon', () => {
      const wrapper = mount(CardError);

      expect(wrapper.find('.chips-card-error__icon').exists()).toBe(true);
      expect(wrapper.find('.chips-card-error__icon').text()).toBe('⚠');
    });

    it('should render message area', () => {
      const wrapper = mount(CardError);

      expect(wrapper.find('.chips-card-error__message').exists()).toBe(true);
    });
  });

  describe('error prop', () => {
    it('should display string error message', () => {
      const wrapper = mount(CardError, {
        props: { error: 'Something went wrong' },
      });

      expect(wrapper.find('.chips-card-error__message').text()).toBe('Something went wrong');
    });

    it('should display Error object message', () => {
      const wrapper = mount(CardError, {
        props: { error: new Error('Network error') },
      });

      expect(wrapper.find('.chips-card-error__message').text()).toBe('Network error');
    });

    it('should display empty message when no error', () => {
      const wrapper = mount(CardError);

      expect(wrapper.find('.chips-card-error__message').text()).toBe('');
    });
  });

  describe('retryable', () => {
    it('should render retry button when retryable', () => {
      const wrapper = mount(CardError, {
        props: { retryable: true },
      });

      expect(wrapper.find('.chips-card-error__retry').exists()).toBe(true);
    });

    it('should not render retry button by default', () => {
      const wrapper = mount(CardError);

      expect(wrapper.find('.chips-card-error__retry').exists()).toBe(false);
    });

    it('should render retry button with default text', () => {
      const wrapper = mount(CardError, {
        props: { retryable: true },
      });

      expect(wrapper.find('.chips-card-error__retry').text()).toBe('重试');
    });

    it('should emit retry event when retry button clicked', async () => {
      const wrapper = mount(CardError, {
        props: { retryable: true },
      });

      await wrapper.find('.chips-card-error__retry').trigger('click');

      expect(wrapper.emitted('retry')).toBeTruthy();
      expect(wrapper.emitted('retry')).toHaveLength(1);
    });
  });

  describe('slots', () => {
    it('should render custom icon slot', () => {
      const wrapper = mount(CardError, {
        slots: {
          icon: '<span class="custom-icon">❌</span>',
        },
      });

      expect(wrapper.find('.chips-card-error__icon .custom-icon').exists()).toBe(true);
      expect(wrapper.find('.chips-card-error__icon').text()).toBe('❌');
    });

    it('should render custom message slot (overriding error prop)', () => {
      const wrapper = mount(CardError, {
        props: { error: 'Prop Error' },
        slots: {
          message: '<span class="custom-message">Slot Message</span>',
        },
      });

      expect(wrapper.find('.chips-card-error__message .custom-message').exists()).toBe(true);
      expect(wrapper.find('.chips-card-error__message').text()).toBe('Slot Message');
    });

    it('should render custom retry slot', () => {
      const wrapper = mount(CardError, {
        props: { retryable: true },
        slots: {
          retry: '<span class="custom-retry">Try Again</span>',
        },
      });

      expect(wrapper.find('.chips-card-error__retry .custom-retry').exists()).toBe(true);
      expect(wrapper.find('.chips-card-error__retry').text()).toBe('Try Again');
    });
  });

  describe('combinations', () => {
    it('should render with all props and slots', () => {
      const wrapper = mount(CardError, {
        props: {
          error: new Error('Test error'),
          retryable: true,
        },
        slots: {
          icon: '<span class="icon">!</span>',
        },
      });

      expect(wrapper.find('.chips-card-error__icon .icon').exists()).toBe(true);
      expect(wrapper.find('.chips-card-error__message').text()).toBe('Test error');
      expect(wrapper.find('.chips-card-error__retry').exists()).toBe(true);
    });

    it('should handle multiple retry clicks', async () => {
      const wrapper = mount(CardError, {
        props: { retryable: true },
      });

      const retryBtn = wrapper.find('.chips-card-error__retry');
      await retryBtn.trigger('click');
      await retryBtn.trigger('click');
      await retryBtn.trigger('click');

      expect(wrapper.emitted('retry')).toHaveLength(3);
    });
  });
});
