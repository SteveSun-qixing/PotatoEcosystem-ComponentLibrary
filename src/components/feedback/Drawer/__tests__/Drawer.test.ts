import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Drawer from '../Drawer.vue';

describe('Drawer', () => {
  // 创建 teleport 挂载点
  beforeEach(() => {
    const el = document.createElement('div');
    el.id = 'drawer-target';
    document.body.appendChild(el);
  });

  afterEach(() => {
    const el = document.querySelector('#drawer-target');
    if (el) {
      el.remove();
    }
    // 清理可能残留的 drawer 元素
    document.body.innerHTML = '';
  });

  const mountDrawer = (props = {}, slots = {}) => {
    return mount(Drawer, {
      props: {
        modelValue: true,
        appendTo: '#drawer-target',
        ...props,
      },
      slots,
      attachTo: document.body,
    });
  };

  describe('rendering', () => {
    it('should render when modelValue is true', async () => {
      const wrapper = mountDrawer();
      await wrapper.vm.$nextTick();

      expect(document.querySelector('.chips-drawer')).toBeTruthy();
    });

    it('should not render when modelValue is false', async () => {
      const wrapper = mount(Drawer, {
        props: {
          modelValue: false,
          appendTo: '#drawer-target',
        },
        attachTo: document.body,
      });
      await wrapper.vm.$nextTick();

      expect(document.querySelector('.chips-drawer')).toBeFalsy();
    });

    it('should render mask when mask prop is true', async () => {
      mountDrawer({ mask: true });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-drawer__mask')).toBeTruthy();
    });

    it('should not render mask when mask prop is false', async () => {
      mountDrawer({ mask: false });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-drawer__mask')).toBeFalsy();
    });
  });

  describe('placement', () => {
    it('should apply right placement by default', async () => {
      mountDrawer();
      await new Promise((r) => setTimeout(r, 10));

      const drawer = document.querySelector('.chips-drawer');
      expect(drawer?.classList.contains('chips-drawer--right')).toBe(true);
    });

    it('should apply left placement', async () => {
      mountDrawer({ placement: 'left' });
      await new Promise((r) => setTimeout(r, 10));

      const drawer = document.querySelector('.chips-drawer');
      expect(drawer?.classList.contains('chips-drawer--left')).toBe(true);
    });

    it('should apply top placement', async () => {
      mountDrawer({ placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const drawer = document.querySelector('.chips-drawer');
      expect(drawer?.classList.contains('chips-drawer--top')).toBe(true);
    });

    it('should apply bottom placement', async () => {
      mountDrawer({ placement: 'bottom' });
      await new Promise((r) => setTimeout(r, 10));

      const drawer = document.querySelector('.chips-drawer');
      expect(drawer?.classList.contains('chips-drawer--bottom')).toBe(true);
    });
  });

  describe('title', () => {
    it('should render title', async () => {
      mountDrawer({ title: 'Test Title' });
      await new Promise((r) => setTimeout(r, 10));

      const title = document.querySelector('.chips-drawer__title');
      expect(title?.textContent).toContain('Test Title');
    });

    it('should render title slot', async () => {
      mountDrawer(
        {},
        {
          title: '<span class="custom-title">Custom Title</span>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.custom-title')).toBeTruthy();
    });
  });

  describe('size', () => {
    it('should apply number width for left/right placement', async () => {
      mountDrawer({ width: 400, placement: 'right' });
      await new Promise((r) => setTimeout(r, 10));

      const wrapper = document.querySelector('.chips-drawer__wrapper') as HTMLElement;
      expect(wrapper?.style.width).toBe('400px');
    });

    it('should apply string width for left/right placement', async () => {
      mountDrawer({ width: '50%', placement: 'left' });
      await new Promise((r) => setTimeout(r, 10));

      const wrapper = document.querySelector('.chips-drawer__wrapper') as HTMLElement;
      expect(wrapper?.style.width).toBe('50%');
    });

    it('should apply number height for top/bottom placement', async () => {
      mountDrawer({ height: 300, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const wrapper = document.querySelector('.chips-drawer__wrapper') as HTMLElement;
      expect(wrapper?.style.height).toBe('300px');
    });

    it('should apply string height for top/bottom placement', async () => {
      mountDrawer({ height: '40%', placement: 'bottom' });
      await new Promise((r) => setTimeout(r, 10));

      const wrapper = document.querySelector('.chips-drawer__wrapper') as HTMLElement;
      expect(wrapper?.style.height).toBe('40%');
    });
  });

  describe('closable', () => {
    it('should render close button when closable is true', async () => {
      mountDrawer({ closable: true, title: 'Test' });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-drawer__close')).toBeTruthy();
    });

    it('should not render close button when closable is false', async () => {
      mountDrawer({ closable: false, title: '' });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-drawer__close')).toBeFalsy();
    });
  });

  describe('events', () => {
    it('should emit update:modelValue when close button clicked', async () => {
      const wrapper = mountDrawer({ title: 'Test' });
      await new Promise((r) => setTimeout(r, 10));

      const closeBtn = document.querySelector('.chips-drawer__close') as HTMLElement;
      closeBtn?.click();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('should emit close when close button clicked', async () => {
      const wrapper = mountDrawer({ title: 'Test' });
      await new Promise((r) => setTimeout(r, 10));

      const closeBtn = document.querySelector('.chips-drawer__close') as HTMLElement;
      closeBtn?.click();

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should emit afterOpen when opened', async () => {
      const wrapper = mount(Drawer, {
        props: {
          modelValue: false,
          appendTo: '#drawer-target',
        },
        attachTo: document.body,
      });

      await wrapper.setProps({ modelValue: true });
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('afterOpen')).toBeTruthy();
    });
  });

  describe('maskClosable', () => {
    it('should close when mask clicked and maskClosable is true', async () => {
      const wrapper = mountDrawer({ maskClosable: true });
      await new Promise((r) => setTimeout(r, 10));

      const mask = document.querySelector('.chips-drawer__mask') as HTMLElement;
      mask?.click();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should not close when mask clicked and maskClosable is false', async () => {
      const wrapper = mountDrawer({ maskClosable: false });
      await new Promise((r) => setTimeout(r, 10));

      const mask = document.querySelector('.chips-drawer__mask') as HTMLElement;
      mask?.click();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('should not close when content clicked', async () => {
      const wrapper = mountDrawer();
      await new Promise((r) => setTimeout(r, 10));

      const content = document.querySelector('.chips-drawer__wrapper') as HTMLElement;
      content?.click();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('keyboard', () => {
    it('should close on ESC key when keyboard is true', async () => {
      const wrapper = mountDrawer({ keyboard: true });
      await new Promise((r) => setTimeout(r, 10));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should not close on ESC key when keyboard is false', async () => {
      const wrapper = mountDrawer({ keyboard: false });
      await new Promise((r) => setTimeout(r, 10));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll when opened', async () => {
      mountDrawer({ lockScroll: true });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes', async () => {
      mountDrawer({ title: 'Accessible Drawer' });
      await new Promise((r) => setTimeout(r, 10));

      const drawer = document.querySelector('.chips-drawer');
      expect(drawer?.getAttribute('role')).toBe('dialog');
      expect(drawer?.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-label on close button', async () => {
      mountDrawer({ title: 'Test' });
      await new Promise((r) => setTimeout(r, 10));

      const closeBtn = document.querySelector('.chips-drawer__close');
      expect(closeBtn?.getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('slots', () => {
    it('should render default slot content in body', async () => {
      mountDrawer(
        {},
        {
          default: '<p class="body-content">Drawer body content</p>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.body-content')).toBeTruthy();
      expect(
        document.querySelector('.chips-drawer__body')?.innerHTML
      ).toContain('Drawer body content');
    });

    it('should render footer slot', async () => {
      mountDrawer(
        {},
        {
          footer: '<button class="custom-footer-btn">Submit</button>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.custom-footer-btn')).toBeTruthy();
      expect(document.querySelector('.chips-drawer__footer')).toBeTruthy();
    });

    it('should render closeIcon slot', async () => {
      mountDrawer(
        { closable: true, title: 'Test' },
        {
          closeIcon: '<span class="custom-close-icon">X</span>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.custom-close-icon')).toBeTruthy();
    });

    it('should render extra slot', async () => {
      mountDrawer(
        { title: 'Test' },
        {
          extra: '<span class="extra-content">Extra</span>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.extra-content')).toBeTruthy();
      expect(document.querySelector('.chips-drawer__extra')).toBeTruthy();
    });
  });

  describe('destroyOnClose', () => {
    it('should destroy content when closed with destroyOnClose', async () => {
      const wrapper = mount(Drawer, {
        props: {
          modelValue: true,
          destroyOnClose: true,
          appendTo: '#drawer-target',
        },
        attachTo: document.body,
      });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-drawer')).toBeTruthy();

      await wrapper.setProps({ modelValue: false });
      await wrapper.vm.$nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-drawer')).toBeFalsy();
    });
  });

  describe('zIndex', () => {
    it('should apply custom zIndex', async () => {
      mountDrawer({ zIndex: 2000 });
      await new Promise((r) => setTimeout(r, 10));

      const wrapper = document.querySelector('.chips-drawer__wrapper') as HTMLElement;
      expect(wrapper?.style.zIndex).toBe('2000');
    });
  });

  describe('open state class', () => {
    it('should apply open class when visible', async () => {
      mountDrawer();
      await new Promise((r) => setTimeout(r, 10));

      const drawer = document.querySelector('.chips-drawer');
      expect(drawer?.classList.contains('chips-drawer--open')).toBe(true);
    });
  });
});
