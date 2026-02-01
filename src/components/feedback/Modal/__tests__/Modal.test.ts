import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import Modal from '../Modal.vue';

describe('Modal', () => {
  // 创建 teleport 挂载点
  beforeEach(() => {
    const el = document.createElement('div');
    el.id = 'modal-target';
    document.body.appendChild(el);
  });

  afterEach(() => {
    const el = document.querySelector('#modal-target');
    if (el) {
      el.remove();
    }
    // 清理可能残留的 modal 元素
    document.body.innerHTML = '';
  });

  const mountModal = (props = {}, slots = {}) => {
    return mount(Modal, {
      props: {
        modelValue: true,
        appendTo: '#modal-target',
        ...props,
      },
      slots,
      attachTo: document.body,
    });
  };

  describe('rendering', () => {
    it('should render when modelValue is true', async () => {
      const wrapper = mountModal();
      await wrapper.vm.$nextTick();

      expect(document.querySelector('.chips-modal-root')).toBeTruthy();
      expect(document.querySelector('.chips-modal')).toBeTruthy();
    });

    it('should not render when modelValue is false', async () => {
      const wrapper = mount(Modal, {
        props: {
          modelValue: false,
          appendTo: '#modal-target',
        },
        attachTo: document.body,
      });
      await wrapper.vm.$nextTick();

      expect(document.querySelector('.chips-modal-root')).toBeFalsy();
    });

    it('should render with default classes', async () => {
      mountModal();
      await new Promise((r) => setTimeout(r, 10));

      const modal = document.querySelector('.chips-modal');
      expect(modal).toBeTruthy();
    });

    it('should render mask when mask prop is true', async () => {
      mountModal({ mask: true });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal-mask')).toBeTruthy();
    });

    it('should not render mask when mask prop is false', async () => {
      mountModal({ mask: false });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal-mask')).toBeFalsy();
    });
  });

  describe('title', () => {
    it('should render title', async () => {
      mountModal({ title: 'Test Title' });
      await new Promise((r) => setTimeout(r, 10));

      const title = document.querySelector('.chips-modal__title');
      expect(title?.textContent).toContain('Test Title');
    });

    it('should render title slot', async () => {
      mountModal(
        {},
        {
          title: '<span class="custom-title">Custom Title</span>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.custom-title')).toBeTruthy();
    });
  });

  describe('closable', () => {
    it('should render close button when closable is true', async () => {
      mountModal({ closable: true });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal__close')).toBeTruthy();
    });

    it('should not render close button when closable is false', async () => {
      mountModal({ closable: false, title: '' });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal__close')).toBeFalsy();
    });
  });

  describe('centered', () => {
    it('should apply centered class when centered is true', async () => {
      mountModal({ centered: true });
      await new Promise((r) => setTimeout(r, 10));

      const modal = document.querySelector('.chips-modal');
      expect(modal?.classList.contains('chips-modal--centered')).toBe(true);
    });
  });

  describe('width', () => {
    it('should apply number width', async () => {
      mountModal({ width: 600 });
      await new Promise((r) => setTimeout(r, 10));

      const content = document.querySelector('.chips-modal__content') as HTMLElement;
      expect(content?.style.width).toBe('600px');
    });

    it('should apply string width', async () => {
      mountModal({ width: '80%' });
      await new Promise((r) => setTimeout(r, 10));

      const content = document.querySelector('.chips-modal__content') as HTMLElement;
      expect(content?.style.width).toBe('80%');
    });
  });

  describe('zIndex', () => {
    it('should apply custom zIndex', async () => {
      mountModal({ zIndex: 2000 });
      await new Promise((r) => setTimeout(r, 10));

      const content = document.querySelector('.chips-modal__content') as HTMLElement;
      expect(content?.style.zIndex).toBe('2000');
    });
  });

  describe('footer', () => {
    it('should render default footer with ok and cancel buttons', async () => {
      mountModal();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal__footer')).toBeTruthy();
      expect(document.querySelector('.chips-modal__ok-btn')).toBeTruthy();
      expect(document.querySelector('.chips-modal__cancel-btn')).toBeTruthy();
    });

    it('should not render footer when footer is null', async () => {
      mountModal({ footer: null });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal__footer')).toBeFalsy();
    });

    it('should render custom footer slot', async () => {
      mountModal(
        {},
        {
          footer: '<button class="custom-btn">Custom Button</button>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.custom-btn')).toBeTruthy();
    });

    it('should render custom okText and cancelText', async () => {
      mountModal({ okText: '确定', cancelText: '取消' });
      await new Promise((r) => setTimeout(r, 10));

      const okBtn = document.querySelector('.chips-modal__ok-btn');
      const cancelBtn = document.querySelector('.chips-modal__cancel-btn');

      expect(okBtn?.textContent).toContain('确定');
      expect(cancelBtn?.textContent).toContain('取消');
    });
  });

  describe('confirmLoading', () => {
    it('should show loading state on ok button', async () => {
      mountModal({ confirmLoading: true });
      await new Promise((r) => setTimeout(r, 10));

      const okBtn = document.querySelector('.chips-modal__ok-btn');
      expect(okBtn?.getAttribute('disabled')).toBe('');
      expect(okBtn?.getAttribute('aria-busy')).toBe('true');
      expect(document.querySelector('.chips-modal__loading-spinner')).toBeTruthy();
    });
  });

  describe('events', () => {
    it('should emit update:modelValue when close button clicked', async () => {
      const wrapper = mountModal();
      await new Promise((r) => setTimeout(r, 10));

      const closeBtn = document.querySelector('.chips-modal__close') as HTMLElement;
      closeBtn?.click();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('should emit cancel when cancel button clicked', async () => {
      const wrapper = mountModal();
      await new Promise((r) => setTimeout(r, 10));

      const cancelBtn = document.querySelector('.chips-modal__cancel-btn') as HTMLElement;
      cancelBtn?.click();

      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('should emit ok when ok button clicked', async () => {
      const wrapper = mountModal();
      await new Promise((r) => setTimeout(r, 10));

      const okBtn = document.querySelector('.chips-modal__ok-btn') as HTMLElement;
      okBtn?.click();

      expect(wrapper.emitted('ok')).toBeTruthy();
    });

    it('should emit afterOpen when opened', async () => {
      const wrapper = mount(Modal, {
        props: {
          modelValue: false,
          appendTo: '#modal-target',
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
      const wrapper = mountModal({ maskClosable: true });
      await new Promise((r) => setTimeout(r, 10));

      const modal = document.querySelector('.chips-modal') as HTMLElement;
      modal?.click();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should not close when mask clicked and maskClosable is false', async () => {
      const wrapper = mountModal({ maskClosable: false });
      await new Promise((r) => setTimeout(r, 10));

      const modal = document.querySelector('.chips-modal') as HTMLElement;
      modal?.click();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('should not close when content clicked', async () => {
      const wrapper = mountModal();
      await new Promise((r) => setTimeout(r, 10));

      const content = document.querySelector('.chips-modal__content') as HTMLElement;
      content?.click();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('keyboard', () => {
    it('should close on ESC key when keyboard is true', async () => {
      const wrapper = mountModal({ keyboard: true });
      await new Promise((r) => setTimeout(r, 10));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should not close on ESC key when keyboard is false', async () => {
      const wrapper = mountModal({ keyboard: false });
      await new Promise((r) => setTimeout(r, 10));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll when opened', async () => {
      mountModal();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes', async () => {
      mountModal({ title: 'Accessible Modal' });
      await new Promise((r) => setTimeout(r, 10));

      const root = document.querySelector('.chips-modal-root');
      expect(root?.getAttribute('role')).toBe('dialog');
      expect(root?.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-label on close button', async () => {
      mountModal();
      await new Promise((r) => setTimeout(r, 10));

      const closeBtn = document.querySelector('.chips-modal__close');
      expect(closeBtn?.getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('slots', () => {
    it('should render default slot content in body', async () => {
      mountModal(
        {},
        {
          default: '<p class="body-content">Modal body content</p>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.body-content')).toBeTruthy();
      expect(
        document.querySelector('.chips-modal__body')?.innerHTML
      ).toContain('Modal body content');
    });

    it('should render closeIcon slot', async () => {
      mountModal(
        { closable: true, title: 'Test' },
        {
          closeIcon: '<span class="custom-close-icon">X</span>',
        }
      );
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.custom-close-icon')).toBeTruthy();
    });
  });

  describe('destroyOnClose', () => {
    it('should destroy content when closed with destroyOnClose', async () => {
      const wrapper = mount(Modal, {
        props: {
          modelValue: true,
          destroyOnClose: true,
          appendTo: '#modal-target',
        },
        attachTo: document.body,
      });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal-root')).toBeTruthy();

      await wrapper.setProps({ modelValue: false });
      await wrapper.vm.$nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(document.querySelector('.chips-modal-root')).toBeFalsy();
    });
  });
});
