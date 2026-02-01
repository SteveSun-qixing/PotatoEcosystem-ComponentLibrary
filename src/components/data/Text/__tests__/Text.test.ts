import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Text from '../Text.vue';

// 在所有测试前设置 clipboard mock
const originalClipboard = navigator.clipboard;
const mockWriteText = vi.fn().mockResolvedValue(undefined);

beforeAll(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: mockWriteText,
    },
    writable: true,
    configurable: true,
  });
});

afterAll(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: originalClipboard,
    writable: true,
    configurable: true,
  });
});

describe('Text', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Text, {
        slots: {
          default: 'Hello World',
        },
      });

      expect(wrapper.find('span.chips-text').exists()).toBe(true);
      expect(wrapper.text()).toContain('Hello World');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Text);
      const text = wrapper.find('span.chips-text');

      expect(text.classes()).toContain('chips-text');
      expect(text.classes()).toContain('chips-text--default');
    });
  });

  describe('types', () => {
    it.each([
      ['default', 'chips-text--default'],
      ['primary', 'chips-text--primary'],
      ['secondary', 'chips-text--secondary'],
      ['success', 'chips-text--success'],
      ['warning', 'chips-text--warning'],
      ['danger', 'chips-text--danger'],
    ] as const)('should render %s type', (type, expectedClass) => {
      const wrapper = mount(Text, {
        props: { type },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain(expectedClass);
    });
  });

  describe('typography styles', () => {
    it('should render strong text', () => {
      const wrapper = mount(Text, {
        props: { strong: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--strong');
    });

    it('should render italic text', () => {
      const wrapper = mount(Text, {
        props: { italic: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--italic');
    });

    it('should render underline text', () => {
      const wrapper = mount(Text, {
        props: { underline: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--underline');
    });

    it('should render delete text', () => {
      const wrapper = mount(Text, {
        props: { delete: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--delete');
    });

    it('should render code text', () => {
      const wrapper = mount(Text, {
        props: { code: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--code');
    });

    it('should render mark text', () => {
      const wrapper = mount(Text, {
        props: { mark: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--mark');
    });

    it('should render keyboard text', () => {
      const wrapper = mount(Text, {
        props: { keyboard: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--keyboard');
    });

    it('should render multiple styles combined', () => {
      const wrapper = mount(Text, {
        props: {
          strong: true,
          italic: true,
          underline: true,
        },
      });
      const text = wrapper.find('span.chips-text');

      expect(text.classes()).toContain('chips-text--strong');
      expect(text.classes()).toContain('chips-text--italic');
      expect(text.classes()).toContain('chips-text--underline');
    });
  });

  describe('ellipsis', () => {
    it('should render ellipsis when set to true', () => {
      const wrapper = mount(Text, {
        props: { ellipsis: true },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--ellipsis');
    });

    it('should render ellipsis with config', () => {
      const wrapper = mount(Text, {
        props: {
          ellipsis: { rows: 2, expandable: true },
        },
      });

      expect(wrapper.find('span.chips-text').classes()).toContain('chips-text--ellipsis');
    });

    it('should have css variable for rows', () => {
      const wrapper = mount(Text, {
        props: {
          ellipsis: { rows: 3 },
        },
      });

      expect(wrapper.find('span.chips-text').attributes('style')).toContain(
        '--chips-text-ellipsis-rows: 3'
      );
    });

    it('should render expand button when expandable', () => {
      const wrapper = mount(Text, {
        props: {
          ellipsis: { expandable: true },
        },
      });

      // 展开按钮默认不显示，只有在溢出时才显示
      // 这里测试组件结构
      expect(wrapper.find('.chips-text__content').exists()).toBe(true);
    });
  });

  describe('copyable', () => {
    beforeEach(() => {
      mockWriteText.mockClear();
    });

    it('should render copy button when copyable is true', () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
        slots: {
          default: 'Copy me',
        },
      });

      expect(wrapper.find('.chips-text__copy').exists()).toBe(true);
    });

    it('should render copy button when copyable is object', () => {
      const wrapper = mount(Text, {
        props: {
          copyable: { text: 'Custom text' },
        },
      });

      expect(wrapper.find('.chips-text__copy').exists()).toBe(true);
    });

    it('should emit copy event when copy button is clicked', async () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
        slots: {
          default: 'Copy me',
        },
      });

      await wrapper.find('.chips-text__copy').trigger('click');

      expect(wrapper.emitted('copy')).toBeTruthy();
      expect(wrapper.emitted('copy')?.[0]).toEqual(['Copy me']);
    });

    it('should copy custom text when provided', async () => {
      const wrapper = mount(Text, {
        props: {
          copyable: { text: 'Custom text' },
        },
        slots: {
          default: 'Display text',
        },
      });

      await wrapper.find('.chips-text__copy').trigger('click');

      expect(mockWriteText).toHaveBeenCalledWith('Custom text');
    });

    it('should call onCopy callback', async () => {
      const onCopy = vi.fn();
      const wrapper = mount(Text, {
        props: {
          copyable: { onCopy },
        },
        slots: {
          default: 'Copy me',
        },
      });

      await wrapper.find('.chips-text__copy').trigger('click');

      expect(onCopy).toHaveBeenCalled();
    });

    it('should show copied state after copy', async () => {
      vi.useFakeTimers();

      const wrapper = mount(Text, {
        props: { copyable: true },
        slots: {
          default: 'Copy me',
        },
      });

      await wrapper.find('.chips-text__copy').trigger('click');
      // 等待异步 clipboard 操作完成
      await flushPromises();

      expect(wrapper.find('.chips-text__copy').classes()).toContain('chips-text__copy--copied');

      // 重置状态
      await vi.advanceTimersByTimeAsync(2000);

      expect(wrapper.find('.chips-text__copy').classes()).not.toContain('chips-text__copy--copied');

      vi.useRealTimers();
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Text, {
        slots: {
          default: '<strong>Bold content</strong>',
        },
      });

      expect(wrapper.find('.chips-text__content').html()).toContain('Bold content');
    });

    it('should render copyIcon slot', () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
        slots: {
          default: 'Text',
          copyIcon: '<span class="custom-copy-icon">Copy</span>',
        },
      });

      expect(wrapper.find('.custom-copy-icon').exists()).toBe(true);
    });

    it('should render copiedIcon slot after copy', async () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
        slots: {
          default: 'Text',
          copiedIcon: '<span class="custom-copied-icon">Copied!</span>',
        },
      });

      await wrapper.find('.chips-text__copy').trigger('click');
      // 等待异步 clipboard 操作完成
      await flushPromises();

      expect(wrapper.find('.custom-copied-icon').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper role on copy button', () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
      });

      expect(wrapper.find('.chips-text__copy').attributes('role')).toBe('button');
      expect(wrapper.find('.chips-text__copy').attributes('tabindex')).toBe('0');
    });

    it('should have aria-label on copy button', () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
      });

      expect(wrapper.find('.chips-text__copy').attributes('aria-label')).toBe('Copy');
    });

    it('should support keyboard navigation for copy', async () => {
      const wrapper = mount(Text, {
        props: { copyable: true },
        slots: {
          default: 'Copy me',
        },
      });

      await wrapper.find('.chips-text__copy').trigger('keydown.enter');

      expect(wrapper.emitted('copy')).toBeTruthy();
    });
  });
});
