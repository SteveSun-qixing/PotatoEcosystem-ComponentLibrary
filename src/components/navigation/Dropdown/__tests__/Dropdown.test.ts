import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Dropdown from '../Dropdown.vue';

describe('Dropdown', () => {
  afterEach(() => {
    // 清理 body 中的 teleported 内容
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Dropdown, {
        slots: {
          default: '<button>Trigger</button>',
          overlay: '<div>Menu content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-dropdown').exists()).toBe(true);
      expect(wrapper.find('.chips-dropdown__trigger').exists()).toBe(true);
      expect(wrapper.find('button').text()).toBe('Trigger');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Dropdown, {
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown');
      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--bottomLeft');
    });
  });

  describe('placement', () => {
    const placements = [
      'top',
      'topLeft',
      'topRight',
      'bottom',
      'bottomLeft',
      'bottomRight',
      'left',
      'leftTop',
      'leftBottom',
      'right',
      'rightTop',
      'rightBottom',
    ] as const;

    it.each(placements)('should render %s placement', (placement) => {
      const wrapper = mount(Dropdown, {
        props: { placement },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-dropdown').classes()).toContain(`chips-dropdown--${placement}`);
    });
  });

  describe('trigger modes', () => {
    describe('hover trigger', () => {
      it('should show on mouseenter and hide on mouseleave', async () => {
        const wrapper = mount(Dropdown, {
          props: { trigger: 'hover', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
          slots: {
            default: '<span>Trigger</span>',
            overlay: '<div>Content</div>',
          },
          global: {
            stubs: {
              teleport: true,
            },
          },
        });

        const trigger = wrapper.find('.chips-dropdown__trigger');

        // 鼠标移入
        await trigger.trigger('mouseenter');
        await flushPromises();

        expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

        // 鼠标移出
        await trigger.trigger('mouseleave');
        await flushPromises();

        expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
      });
    });

    describe('click trigger', () => {
      it('should toggle on click', async () => {
        const wrapper = mount(Dropdown, {
          props: { trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
          slots: {
            default: '<span>Trigger</span>',
            overlay: '<div>Content</div>',
          },
          global: {
            stubs: {
              teleport: true,
            },
          },
        });

        const trigger = wrapper.find('.chips-dropdown__trigger');

        // 点击显示
        await trigger.trigger('click');
        await flushPromises();

        expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

        // 再次点击隐藏
        await trigger.trigger('click');
        await flushPromises();

        expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
      });
    });

    describe('contextmenu trigger', () => {
      it('should toggle on contextmenu', async () => {
        const wrapper = mount(Dropdown, {
          props: { trigger: 'contextmenu', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
          slots: {
            default: '<span>Trigger</span>',
            overlay: '<div>Content</div>',
          },
          global: {
            stubs: {
              teleport: true,
            },
          },
        });

        const trigger = wrapper.find('.chips-dropdown__trigger');

        // 右键点击显示
        await trigger.trigger('contextmenu');
        await flushPromises();

        expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

        // 再次右键点击隐藏
        await trigger.trigger('contextmenu');
        await flushPromises();

        expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
      });
    });
  });

  describe('delay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay showing with mouseEnterDelay', async () => {
      const wrapper = mount(Dropdown, {
        props: { trigger: 'hover', mouseEnterDelay: 300, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-dropdown__trigger');

      await trigger.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      // 延迟前不显示
      expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');

      // 延迟后显示
      vi.advanceTimersByTime(300);
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');
    });

    it('should delay hiding with mouseLeaveDelay', async () => {
      const wrapper = mount(Dropdown, {
        props: { trigger: 'hover', mouseEnterDelay: 0, mouseLeaveDelay: 200 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-dropdown__trigger');

      // 先显示
      await trigger.trigger('mouseenter');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

      // 移出后延迟隐藏
      await trigger.trigger('mouseleave');
      await wrapper.vm.$nextTick();

      // 延迟期间仍然可见
      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

      // 延迟后隐藏
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
    });
  });

  describe('controlled mode', () => {
    it('should respect visible prop', async () => {
      const wrapper = mount(Dropdown, {
        props: { visible: true },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

      await wrapper.setProps({ visible: false });
      expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
    });

    it('should emit update:visible event', async () => {
      const wrapper = mount(Dropdown, {
        props: { trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-dropdown__trigger');
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')![0]).toEqual([true]);
    });

    it('should emit visibleChange event', async () => {
      const wrapper = mount(Dropdown, {
        props: { trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-dropdown__trigger');
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.emitted('visibleChange')).toBeTruthy();
      expect(wrapper.emitted('visibleChange')![0]).toEqual([true]);
    });
  });

  describe('uncontrolled mode', () => {
    it('should use defaultVisible', async () => {
      const wrapper = mount(Dropdown, {
        props: { defaultVisible: true },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');
    });
  });

  describe('disabled', () => {
    it('should not show when disabled', async () => {
      const wrapper = mount(Dropdown, {
        props: { disabled: true, trigger: 'hover', mouseEnterDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-dropdown__trigger');
      await trigger.trigger('mouseenter');
      await flushPromises();

      expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--disabled');
    });

    it('should hide when disabled while visible', async () => {
      const wrapper = mount(Dropdown, {
        props: { visible: true },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-dropdown').classes()).toContain('chips-dropdown--open');

      await wrapper.setProps({ disabled: true });

      expect(wrapper.find('.chips-dropdown').classes()).not.toContain('chips-dropdown--open');
    });
  });

  describe('destroyOnHide', () => {
    it('should keep content when destroyOnHide is false', async () => {
      const wrapper = mount(Dropdown, {
        props: { destroyOnHide: false, trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div class="overlay-content">Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      // 初始状态：内容应该存在但隐藏
      expect(wrapper.find('.chips-dropdown__overlay').exists()).toBe(true);
    });

    it('should destroy content when destroyOnHide is true and hidden', async () => {
      const wrapper = mount(Dropdown, {
        props: { destroyOnHide: true, trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div class="overlay-content">Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      // 初始状态：内容不应该存在
      expect(wrapper.find('.chips-dropdown__overlay').exists()).toBe(false);

      // 点击显示
      const trigger = wrapper.find('.chips-dropdown__trigger');
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.find('.chips-dropdown__overlay').exists()).toBe(true);

      // 再次点击隐藏
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.find('.chips-dropdown__overlay').exists()).toBe(false);
    });
  });

  describe('slots', () => {
    it('should render default slot as trigger', () => {
      const wrapper = mount(Dropdown, {
        slots: {
          default: '<button class="custom-trigger">Click me</button>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.custom-trigger').exists()).toBe(true);
      expect(wrapper.find('.custom-trigger').text()).toBe('Click me');
    });

    it('should render overlay slot', async () => {
      const wrapper = mount(Dropdown, {
        props: { visible: true },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div class="custom-overlay">Custom content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.custom-overlay').exists()).toBe(true);
      expect(wrapper.find('.custom-overlay').text()).toBe('Custom content');
    });
  });

  describe('accessibility', () => {
    it('should have role="menu" on overlay', () => {
      const wrapper = mount(Dropdown, {
        props: { visible: true },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    });

    it('should have aria-hidden when hidden', () => {
      const wrapper = mount(Dropdown, {
        props: { visible: false },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const overlay = wrapper.find('.chips-dropdown__overlay');
      expect(overlay.attributes('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden="false" when visible', () => {
      const wrapper = mount(Dropdown, {
        props: { visible: true },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const overlay = wrapper.find('.chips-dropdown__overlay');
      expect(overlay.attributes('aria-hidden')).toBe('false');
    });
  });

  describe('zIndex', () => {
    it('should apply custom zIndex', () => {
      const wrapper = mount(Dropdown, {
        props: { visible: true, zIndex: 9999 },
        slots: {
          default: '<span>Trigger</span>',
          overlay: '<div>Content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const overlay = wrapper.find('.chips-dropdown__overlay');
      expect(overlay.attributes('style')).toContain('z-index: 9999');
    });
  });
});
