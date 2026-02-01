import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Message from '../Message.vue';
import { message, useMessage } from '../useMessage';

describe('Message Component', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'info',
          content: 'Test message',
        },
      });

      expect(wrapper.find('.chips-message__notice').exists()).toBe(true);
      expect(wrapper.find('.chips-message__text').text()).toBe('Test message');
    });

    it('should render with correct type class', () => {
      const types = ['info', 'success', 'warning', 'error', 'loading'] as const;

      types.forEach((type) => {
        const wrapper = mount(Message, {
          props: {
            id: `test-${type}`,
            type,
            content: 'Test',
          },
        });

        expect(wrapper.find('.chips-message__notice').classes()).toContain(
          `chips-message--${type}`
        );
      });
    });
  });

  describe('closable', () => {
    it('should not show close button by default', () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'info',
          content: 'Test',
        },
      });

      expect(wrapper.find('.chips-message__close').exists()).toBe(false);
    });

    it('should show close button when closable is true', () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'info',
          content: 'Test',
          closable: true,
        },
      });

      expect(wrapper.find('.chips-message__close').exists()).toBe(true);
    });

    it('should emit close event when close button clicked', async () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'info',
          content: 'Test',
          closable: true,
        },
      });

      await wrapper.find('.chips-message__close').trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')?.[0]).toEqual(['test-1']);
    });
  });

  describe('accessibility', () => {
    it('should have role="alert"', () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'info',
          content: 'Test',
        },
      });

      expect(wrapper.find('.chips-message__notice').attributes('role')).toBe(
        'alert'
      );
    });

    it('should have aria-live="assertive" for error type', () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'error',
          content: 'Error message',
        },
      });

      expect(
        wrapper.find('.chips-message__notice').attributes('aria-live')
      ).toBe('assertive');
    });

    it('should have aria-live="polite" for non-error types', () => {
      const wrapper = mount(Message, {
        props: {
          id: 'test-1',
          type: 'info',
          content: 'Info message',
        },
      });

      expect(
        wrapper.find('.chips-message__notice').attributes('aria-live')
      ).toBe('polite');
    });
  });
});

describe('Message API', () => {
  beforeEach(() => {
    // 清理之前的消息
    message.destroy();

    // 确保 DOM 干净
    document.body.innerHTML = '';
  });

  afterEach(() => {
    message.destroy();
    document.body.innerHTML = '';
  });

  describe('message methods', () => {
    it('should create info message', async () => {
      const instance = message.info('Info message');

      expect(instance.id).toBeDefined();
      expect(typeof instance.close).toBe('function');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message')).toBeTruthy();
      expect(document.querySelector('.chips-message--info')).toBeTruthy();
    });

    it('should create success message', async () => {
      message.success('Success message');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--success')).toBeTruthy();
    });

    it('should create warning message', async () => {
      message.warning('Warning message');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--warning')).toBeTruthy();
    });

    it('should create error message', async () => {
      message.error('Error message');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--error')).toBeTruthy();
    });

    it('should create loading message', async () => {
      message.loading('Loading message');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--loading')).toBeTruthy();
    });
  });

  describe('message.open', () => {
    it('should create message with full config', async () => {
      const onClose = vi.fn();

      message.open({
        type: 'info',
        content: 'Custom message',
        duration: 5000,
        closable: true,
        onClose,
      });

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--info')).toBeTruthy();
      expect(document.querySelector('.chips-message__close')).toBeTruthy();
    });
  });

  describe('message.close', () => {
    it('should close message by instance', async () => {
      const instance = message.info('Test message');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--info')).toBeTruthy();

      instance.close();

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message--info')).toBeFalsy();
    });
  });

  describe('message.destroy', () => {
    it('should destroy all messages', async () => {
      message.info('Message 1');
      message.success('Message 2');
      message.error('Message 3');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelectorAll('.chips-message__notice').length).toBe(3);

      message.destroy();

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-message')).toBeFalsy();
    });
  });

  describe('message.config', () => {
    it('should update global config', async () => {
      message.config({
        top: 100,
        maxCount: 3,
      });

      // 创建多于 maxCount 的消息
      message.info('Message 1');
      message.info('Message 2');
      message.info('Message 3');
      message.info('Message 4');

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      // 应该只显示 maxCount 条
      expect(document.querySelectorAll('.chips-message__notice').length).toBe(3);
    });
  });

  describe('auto close', () => {
    it('should auto close after duration', async () => {
      vi.useFakeTimers();

      message.info('Auto close message', 100);

      await nextTick();
      await vi.advanceTimersByTimeAsync(10);

      expect(document.querySelector('.chips-message--info')).toBeTruthy();

      await vi.advanceTimersByTimeAsync(150);
      await nextTick();

      expect(document.querySelector('.chips-message--info')).toBeFalsy();

      vi.useRealTimers();
    });

    it('should not auto close when duration is 0', async () => {
      vi.useFakeTimers();

      message.info('Persistent message', 0);

      await nextTick();
      await vi.advanceTimersByTimeAsync(10);

      expect(document.querySelector('.chips-message--info')).toBeTruthy();

      // 等待很长时间
      await vi.advanceTimersByTimeAsync(10000);
      await nextTick();

      // 仍然存在
      expect(document.querySelector('.chips-message--info')).toBeTruthy();

      vi.useRealTimers();
    });
  });

  describe('onClose callback', () => {
    it('should call onClose when message is closed', async () => {
      const onClose = vi.fn();

      const instance = message.open({
        type: 'info',
        content: 'Test',
        onClose,
      });

      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      instance.close();

      await nextTick();

      expect(onClose).toHaveBeenCalled();
    });
  });
});

describe('useMessage', () => {
  it('should return message API', () => {
    const api = useMessage();

    expect(api.info).toBeDefined();
    expect(api.success).toBeDefined();
    expect(api.warning).toBeDefined();
    expect(api.error).toBeDefined();
    expect(api.loading).toBeDefined();
    expect(api.open).toBeDefined();
    expect(api.destroy).toBeDefined();
    expect(api.config).toBeDefined();
  });
});
