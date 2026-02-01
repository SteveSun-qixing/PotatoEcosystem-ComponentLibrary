import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Popover from '../Popover.vue';

describe('Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  const mountPopover = (props = {}, slots = {}) => {
    return mount(Popover, {
      props: {
        title: 'Test Title',
        content: 'Test Content',
        ...props,
      },
      slots: {
        default: '<button>Trigger</button>',
        ...slots,
      },
      attachTo: document.body,
    });
  };

  describe('rendering', () => {
    it('should render trigger element', () => {
      const wrapper = mountPopover();
      expect(wrapper.find('.chips-popover__trigger').exists()).toBe(true);
      expect(wrapper.find('button').text()).toBe('Trigger');
    });

    it('should render with default placement class', () => {
      const wrapper = mountPopover();
      expect(wrapper.find('.chips-popover--top').exists()).toBe(true);
    });

    it('should render content in teleport', () => {
      mountPopover();
      expect(document.querySelector('.chips-popover__content')).toBeTruthy();
    });

    it('should be hidden by default', () => {
      const wrapper = mountPopover();
      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });
  });

  describe('placement', () => {
    const placements = [
      'top', 'topLeft', 'topRight',
      'bottom', 'bottomLeft', 'bottomRight',
      'left', 'leftTop', 'leftBottom',
      'right', 'rightTop', 'rightBottom',
    ];

    placements.forEach((placement) => {
      it(`should apply ${placement} placement class`, () => {
        const wrapper = mountPopover({ placement });
        expect(wrapper.find(`.chips-popover--${placement}`).exists()).toBe(true);
      });
    });
  });

  describe('title and content', () => {
    it('should render title prop', async () => {
      mountPopover({ title: 'Custom Title', defaultVisible: true });
      await vi.runAllTimersAsync();

      const title = document.querySelector('.chips-popover__title');
      expect(title?.textContent).toContain('Custom Title');
    });

    it('should render content prop', async () => {
      mountPopover({ content: 'Custom Content', defaultVisible: true });
      await vi.runAllTimersAsync();

      const content = document.querySelector('.chips-popover__inner-content');
      expect(content?.textContent).toContain('Custom Content');
    });

    it('should render title slot', async () => {
      mountPopover(
        { defaultVisible: true },
        { title: '<span class="custom-title">Slot Title</span>' }
      );
      await vi.runAllTimersAsync();

      expect(document.querySelector('.custom-title')).toBeTruthy();
    });

    it('should render content slot', async () => {
      mountPopover(
        { defaultVisible: true },
        { content: '<span class="custom-content">Slot Content</span>' }
      );
      await vi.runAllTimersAsync();

      expect(document.querySelector('.custom-content')).toBeTruthy();
    });
  });

  describe('trigger modes', () => {
    it('should show on hover by default', async () => {
      const wrapper = mountPopover({ trigger: 'hover' });
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseenter');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--visible').exists()).toBe(true);
    });

    it('should hide on mouse leave', async () => {
      const wrapper = mountPopover({ trigger: 'hover', defaultVisible: true });
      await vi.runAllTimersAsync();
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseleave');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });

    it('should toggle on click', async () => {
      const wrapper = mountPopover({ trigger: 'click' });
      
      await wrapper.find('.chips-popover__trigger').trigger('click');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--visible').exists()).toBe(true);

      await wrapper.find('.chips-popover__trigger').trigger('click');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });

    it('should show on focus and hide on blur', async () => {
      const wrapper = mountPopover({ trigger: 'focus' });
      
      await wrapper.find('.chips-popover__trigger').trigger('focus');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--visible').exists()).toBe(true);

      await wrapper.find('.chips-popover__trigger').trigger('blur');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });
  });

  describe('disabled', () => {
    it('should not show when disabled', async () => {
      const wrapper = mountPopover({ disabled: true, trigger: 'hover' });
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseenter');
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });
  });

  describe('delay', () => {
    it('should respect mouseEnterDelay', async () => {
      const wrapper = mountPopover({ trigger: 'hover', mouseEnterDelay: 200 });
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseenter');
      await vi.advanceTimersByTime(100);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);

      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--visible').exists()).toBe(true);
    });

    it('should respect mouseLeaveDelay', async () => {
      const wrapper = mountPopover({ 
        trigger: 'hover', 
        defaultVisible: true,
        mouseLeaveDelay: 200 
      });
      await vi.runAllTimersAsync();
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseleave');
      await vi.advanceTimersByTime(100);

      expect(wrapper.find('.chips-popover--visible').exists()).toBe(true);

      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });
  });

  describe('events', () => {
    it('should emit update:visible on show', async () => {
      const wrapper = mountPopover({ trigger: 'hover' });
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseenter');
      await vi.advanceTimersByTime(150);

      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([true]);
    });

    it('should emit visibleChange on show', async () => {
      const wrapper = mountPopover({ trigger: 'hover' });
      
      await wrapper.find('.chips-popover__trigger').trigger('mouseenter');
      await vi.advanceTimersByTime(150);

      expect(wrapper.emitted('visibleChange')).toBeTruthy();
      expect(wrapper.emitted('visibleChange')?.[0]).toEqual([true]);
    });
  });

  describe('controlled mode', () => {
    it('should respect visible prop in controlled mode', async () => {
      const wrapper = mountPopover({ visible: true });
      await vi.runAllTimersAsync();

      expect(wrapper.find('.chips-popover--visible').exists()).toBe(true);
    });

    it('should hide when visible prop changes to false', async () => {
      const wrapper = mountPopover({ visible: true });
      await vi.runAllTimersAsync();

      await wrapper.setProps({ visible: false });
      await vi.runAllTimersAsync();

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });
  });

  describe('arrow', () => {
    it('should render arrow by default', async () => {
      mountPopover({ defaultVisible: true });
      await vi.runAllTimersAsync();

      expect(document.querySelector('.chips-popover__arrow')).toBeTruthy();
    });

    it('should not render arrow when arrow is false', async () => {
      mountPopover({ arrow: false, defaultVisible: true });
      await vi.runAllTimersAsync();

      expect(document.querySelector('.chips-popover__arrow')).toBeFalsy();
    });
  });

  describe('destroyOnHide', () => {
    it('should keep content in DOM when destroyOnHide is false', async () => {
      mountPopover({ destroyOnHide: false });
      await vi.runAllTimersAsync();

      expect(document.querySelector('.chips-popover__content')).toBeTruthy();
    });

    it('should destroy content when destroyOnHide is true and hidden', async () => {
      mountPopover({ destroyOnHide: true });
      await vi.runAllTimersAsync();

      expect(document.querySelector('.chips-popover__content')).toBeFalsy();
    });
  });

  describe('zIndex', () => {
    it('should apply custom zIndex', async () => {
      mountPopover({ zIndex: 1000, defaultVisible: true });
      await vi.runAllTimersAsync();

      const content = document.querySelector('.chips-popover__content') as HTMLElement;
      expect(content?.style.zIndex).toBe('1000');
    });
  });

  describe('accessibility', () => {
    it('should have role="tooltip"', async () => {
      mountPopover({ defaultVisible: true });
      await vi.runAllTimersAsync();

      const content = document.querySelector('.chips-popover__content');
      expect(content?.getAttribute('role')).toBe('tooltip');
    });

    it('should have aria-hidden when hidden', () => {
      mountPopover();
      
      const content = document.querySelector('.chips-popover__content');
      expect(content?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('click outside', () => {
    it('should close when clicking outside in click mode', async () => {
      const wrapper = mountPopover({ trigger: 'click', defaultVisible: true });
      await vi.runAllTimersAsync();

      // 模拟点击外部
      const clickEvent = new MouseEvent('click', { bubbles: true });
      document.body.dispatchEvent(clickEvent);
      await vi.advanceTimersByTime(150);

      expect(wrapper.find('.chips-popover--hidden').exists()).toBe(true);
    });
  });
});
