import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Tooltip from '../Tooltip.vue';

// 辅助函数：等待一段时间
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Tooltip', () => {
  afterEach(() => {
    // 清理 body 中的 teleported 内容
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip content' },
        slots: {
          default: '<button>Trigger</button>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-tooltip').exists()).toBe(true);
      expect(wrapper.find('.chips-tooltip__trigger').exists()).toBe(true);
      expect(wrapper.find('button').text()).toBe('Trigger');
    });

    it('should render with default classes', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip content' },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip');
      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--top');
      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
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
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', placement },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-tooltip').classes()).toContain(`chips-tooltip--${placement}`);
    });
  });

  describe('trigger modes', () => {
    describe('hover trigger', () => {
      it('should show on mouseenter and hide on mouseleave', async () => {
        const wrapper = mount(Tooltip, {
          props: { content: 'Tooltip', trigger: 'hover', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
          slots: {
            default: '<span>Trigger</span>',
          },
          global: {
            stubs: {
              teleport: true,
            },
          },
        });

        const trigger = wrapper.find('.chips-tooltip__trigger');

        // 鼠标移入
        await trigger.trigger('mouseenter');
        await flushPromises();

        expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

        // 鼠标移出
        await trigger.trigger('mouseleave');
        await flushPromises();

        expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
      });
    });

    describe('click trigger', () => {
      it('should toggle on click', async () => {
        const wrapper = mount(Tooltip, {
          props: { content: 'Tooltip', trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
          slots: {
            default: '<span>Trigger</span>',
          },
          global: {
            stubs: {
              teleport: true,
            },
          },
        });

        const trigger = wrapper.find('.chips-tooltip__trigger');

        // 点击显示
        await trigger.trigger('click');
        await flushPromises();

        expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

        // 再次点击隐藏
        await trigger.trigger('click');
        await flushPromises();

        expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
      });
    });

    describe('focus trigger', () => {
      it('should show on focus and hide on blur', async () => {
        const wrapper = mount(Tooltip, {
          props: { content: 'Tooltip', trigger: 'focus', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
          slots: {
            default: '<input type="text">',
          },
          global: {
            stubs: {
              teleport: true,
            },
          },
        });

        const trigger = wrapper.find('.chips-tooltip__trigger');

        // 聚焦
        await trigger.trigger('focus');
        await flushPromises();

        expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

        // 失焦
        await trigger.trigger('blur');
        await flushPromises();

        expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
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
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', trigger: 'hover', mouseEnterDelay: 300, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-tooltip__trigger');

      await trigger.trigger('mouseenter');
      await wrapper.vm.$nextTick();

      // 延迟前不显示
      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');

      // 延迟后显示
      vi.advanceTimersByTime(300);
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');
    });

    it('should delay hiding with mouseLeaveDelay', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', trigger: 'hover', mouseEnterDelay: 0, mouseLeaveDelay: 200 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-tooltip__trigger');

      // 先显示（无延迟）
      await trigger.trigger('mouseenter');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

      // 移出后延迟隐藏
      await trigger.trigger('mouseleave');
      await wrapper.vm.$nextTick();

      // 延迟期间仍然可见
      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

      // 延迟后隐藏
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
    });
  });

  describe('controlled mode', () => {
    it('should respect visible prop', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', visible: true },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

      await wrapper.setProps({ visible: false });
      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
    });

    it('should emit update:visible event', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-tooltip__trigger');
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')![0]).toEqual([true]);
    });

    it('should emit visibleChange event', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-tooltip__trigger');
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.emitted('visibleChange')).toBeTruthy();
      expect(wrapper.emitted('visibleChange')![0]).toEqual([true]);
    });
  });

  describe('uncontrolled mode', () => {
    it('should use defaultVisible', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', defaultVisible: true },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      await flushPromises();

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');
    });
  });

  describe('disabled', () => {
    it('should not show when disabled', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', disabled: true, trigger: 'hover', mouseEnterDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const trigger = wrapper.find('.chips-tooltip__trigger');
      await trigger.trigger('mouseenter');
      await flushPromises();

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
    });

    it('should hide when disabled while visible', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', visible: true },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--visible');

      await wrapper.setProps({ disabled: true });

      expect(wrapper.find('.chips-tooltip').classes()).toContain('chips-tooltip--hidden');
    });
  });

  describe('destroyOnHide', () => {
    it('should keep content when destroyOnHide is false', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', destroyOnHide: false, trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      // 初始状态：内容应该存在但隐藏
      expect(wrapper.find('.chips-tooltip__content').exists()).toBe(true);
    });

    it('should destroy content when destroyOnHide is true and hidden', async () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', destroyOnHide: true, trigger: 'click', mouseEnterDelay: 0, mouseLeaveDelay: 0 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      // 初始状态：内容不应该存在
      expect(wrapper.find('.chips-tooltip__content').exists()).toBe(false);

      // 点击显示
      const trigger = wrapper.find('.chips-tooltip__trigger');
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.find('.chips-tooltip__content').exists()).toBe(true);

      // 再次点击隐藏
      await trigger.trigger('click');
      await flushPromises();

      expect(wrapper.find('.chips-tooltip__content').exists()).toBe(false);
    });
  });

  describe('slots', () => {
    it('should render default slot as trigger', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip' },
        slots: {
          default: '<button class="custom-trigger">Click me</button>',
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

    it('should render content slot', async () => {
      const wrapper = mount(Tooltip, {
        props: { visible: true },
        slots: {
          default: '<span>Trigger</span>',
          content: '<div class="custom-content">Custom content</div>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('.custom-content').exists()).toBe(true);
      expect(wrapper.find('.custom-content').text()).toBe('Custom content');
    });
  });

  describe('accessibility', () => {
    it('should have role="tooltip" on content', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', visible: true },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);
    });

    it('should have aria-hidden when hidden', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', visible: false },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const content = wrapper.find('.chips-tooltip__content');
      expect(content.attributes('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden="false" when visible', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', visible: true },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const content = wrapper.find('.chips-tooltip__content');
      expect(content.attributes('aria-hidden')).toBe('false');
    });
  });

  describe('zIndex', () => {
    it('should apply custom zIndex', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip', visible: true, zIndex: 9999 },
        slots: {
          default: '<span>Trigger</span>',
        },
        global: {
          stubs: {
            teleport: true,
          },
        },
      });

      const content = wrapper.find('.chips-tooltip__content');
      expect(content.attributes('style')).toContain('z-index: 9999');
    });
  });
});
