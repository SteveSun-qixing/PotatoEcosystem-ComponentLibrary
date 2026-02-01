import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Alert from '../Alert.vue';

describe('Alert', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Alert, {
        props: { message: 'Test message' },
      });

      expect(wrapper.find('.chips-alert').exists()).toBe(true);
      expect(wrapper.text()).toContain('Test message');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Alert);
      const alert = wrapper.find('.chips-alert');

      expect(alert.classes()).toContain('chips-alert');
      expect(alert.classes()).toContain('chips-alert--info');
    });

    it('should have role="alert" attribute', () => {
      const wrapper = mount(Alert);

      expect(wrapper.find('.chips-alert').attributes('role')).toBe('alert');
    });
  });

  describe('types', () => {
    it.each([
      ['info', 'chips-alert--info'],
      ['success', 'chips-alert--success'],
      ['warning', 'chips-alert--warning'],
      ['error', 'chips-alert--error'],
    ] as const)('should render %s type', (type, expectedClass) => {
      const wrapper = mount(Alert, {
        props: { type },
      });

      expect(wrapper.find('.chips-alert').classes()).toContain(expectedClass);
    });
  });

  describe('message and description', () => {
    it('should render message prop', () => {
      const wrapper = mount(Alert, {
        props: { message: 'Alert message' },
      });

      expect(wrapper.find('.chips-alert__message').text()).toBe('Alert message');
    });

    it('should render description prop', () => {
      const wrapper = mount(Alert, {
        props: {
          message: 'Alert message',
          description: 'Alert description',
        },
      });

      expect(wrapper.find('.chips-alert__description').exists()).toBe(true);
      expect(wrapper.find('.chips-alert__description').text()).toBe('Alert description');
      expect(wrapper.find('.chips-alert').classes()).toContain('chips-alert--with-description');
    });

    it('should not render description when not provided', () => {
      const wrapper = mount(Alert, {
        props: { message: 'Alert message' },
      });

      expect(wrapper.find('.chips-alert__description').exists()).toBe(false);
      expect(wrapper.find('.chips-alert').classes()).not.toContain('chips-alert--with-description');
    });
  });

  describe('showIcon', () => {
    it('should not show icon by default', () => {
      const wrapper = mount(Alert);

      expect(wrapper.find('.chips-alert__icon').exists()).toBe(false);
    });

    it('should show icon when showIcon is true', () => {
      const wrapper = mount(Alert, {
        props: { showIcon: true },
      });

      expect(wrapper.find('.chips-alert__icon').exists()).toBe(true);
    });

    it('should show icon when icon slot is provided', () => {
      const wrapper = mount(Alert, {
        slots: {
          icon: '<span class="custom-icon">!</span>',
        },
      });

      expect(wrapper.find('.chips-alert__icon').exists()).toBe(true);
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
    });
  });

  describe('closable', () => {
    it('should not show close button by default', () => {
      const wrapper = mount(Alert);

      expect(wrapper.find('.chips-alert__close').exists()).toBe(false);
    });

    it('should show close button when closable is true', () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-alert__close').exists()).toBe(true);
      expect(wrapper.find('.chips-alert').classes()).toContain('chips-alert--closable');
    });

    it('should emit close event when close button is clicked', async () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      await wrapper.find('.chips-alert__close').trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('should emit afterClose event after closing', async () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      await wrapper.find('.chips-alert__close').trigger('click');

      expect(wrapper.emitted('afterClose')).toBeTruthy();
      expect(wrapper.emitted('afterClose')?.length).toBe(1);
    });

    it('should hide alert after close', async () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      await wrapper.find('.chips-alert__close').trigger('click');

      expect(wrapper.find('.chips-alert').exists()).toBe(false);
    });
  });

  describe('banner', () => {
    it('should not have banner class by default', () => {
      const wrapper = mount(Alert);

      expect(wrapper.find('.chips-alert').classes()).not.toContain('chips-alert--banner');
    });

    it('should have banner class when banner is true', () => {
      const wrapper = mount(Alert, {
        props: { banner: true },
      });

      expect(wrapper.find('.chips-alert').classes()).toContain('chips-alert--banner');
    });
  });

  describe('slots', () => {
    it('should render default slot as message content', () => {
      const wrapper = mount(Alert, {
        slots: {
          default: 'Default slot message',
        },
      });

      expect(wrapper.find('.chips-alert__message').text()).toContain('Default slot message');
    });

    it('should render message slot', () => {
      const wrapper = mount(Alert, {
        slots: {
          message: '<strong>Custom message</strong>',
        },
      });

      expect(wrapper.find('.chips-alert__message strong').exists()).toBe(true);
    });

    it('should render description slot', () => {
      const wrapper = mount(Alert, {
        slots: {
          description: '<em>Custom description</em>',
        },
      });

      expect(wrapper.find('.chips-alert__description em').exists()).toBe(true);
    });

    it('should render icon slot', () => {
      const wrapper = mount(Alert, {
        slots: {
          icon: '<span class="custom-icon">Icon</span>',
        },
      });

      expect(wrapper.find('.chips-alert__icon .custom-icon').exists()).toBe(true);
    });

    it('should render closeIcon slot', () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
        slots: {
          closeIcon: '<span class="custom-close">X</span>',
        },
      });

      expect(wrapper.find('.chips-alert__close .custom-close').exists()).toBe(true);
    });

    it('should render action slot', () => {
      const wrapper = mount(Alert, {
        slots: {
          action: '<button class="action-btn">Action</button>',
        },
      });

      expect(wrapper.find('.chips-alert__action').exists()).toBe(true);
      expect(wrapper.find('.action-btn').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper role on close button', () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-alert__close').attributes('role')).toBe('button');
      expect(wrapper.find('.chips-alert__close').attributes('tabindex')).toBe('0');
    });

    it('should have aria-label on close button', () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      expect(wrapper.find('.chips-alert__close').attributes('aria-label')).toBe('Close alert');
    });

    it('should support keyboard navigation for close (Enter)', async () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      await wrapper.find('.chips-alert__close').trigger('keydown.enter');

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should support keyboard navigation for close (Space)', async () => {
      const wrapper = mount(Alert, {
        props: { closable: true },
      });

      await wrapper.find('.chips-alert__close').trigger('keydown.space');

      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('combined props', () => {
    it('should handle multiple props together', () => {
      const wrapper = mount(Alert, {
        props: {
          type: 'success',
          message: 'Success message',
          description: 'This is a detailed description',
          showIcon: true,
          closable: true,
          banner: true,
        },
      });
      const alert = wrapper.find('.chips-alert');

      expect(alert.classes()).toContain('chips-alert--success');
      expect(alert.classes()).toContain('chips-alert--with-description');
      expect(alert.classes()).toContain('chips-alert--banner');
      expect(alert.classes()).toContain('chips-alert--closable');
      expect(wrapper.find('.chips-alert__icon').exists()).toBe(true);
      expect(wrapper.find('.chips-alert__close').exists()).toBe(true);
    });
  });
});
