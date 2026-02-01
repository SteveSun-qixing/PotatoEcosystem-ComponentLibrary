import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, h, defineComponent, ref } from 'vue';
import Layout from '../Layout.vue';
import Header from '../Header.vue';
import Sider from '../Sider.vue';
import Content from '../Content.vue';
import Footer from '../Footer.vue';

describe('Layout', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Layout, {
        slots: {
          default: 'Layout Content',
        },
      });

      expect(wrapper.find('section').exists()).toBe(true);
      expect(wrapper.text()).toContain('Layout Content');
    });

    it('should render with base class', () => {
      const wrapper = mount(Layout);
      expect(wrapper.find('section').classes()).toContain('chips-layout');
    });
  });

  describe('hasSider', () => {
    it('should add has-sider class when hasSider prop is true', () => {
      const wrapper = mount(Layout, {
        props: { hasSider: true },
      });

      expect(wrapper.find('section').classes()).toContain('chips-layout--has-sider');
    });

    it('should not add has-sider class when hasSider prop is false', () => {
      const wrapper = mount(Layout, {
        props: { hasSider: false },
      });

      expect(wrapper.find('section').classes()).not.toContain('chips-layout--has-sider');
    });

    it('should auto detect Sider child and add has-sider class', async () => {
      const wrapper = mount(Layout, {
        slots: {
          default: () => h(Sider),
        },
      });

      await nextTick();
      expect(wrapper.find('section').classes()).toContain('chips-layout--has-sider');
    });
  });

  describe('nesting', () => {
    it('should support nested layouts', () => {
      const wrapper = mount(Layout, {
        slots: {
          default: () => h(Layout, {}, () => 'Nested Content'),
        },
      });

      const layouts = wrapper.findAll('.chips-layout');
      expect(layouts.length).toBe(2);
    });
  });
});

describe('Header', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Header, {
        slots: {
          default: 'Header Content',
        },
      });

      expect(wrapper.find('header').exists()).toBe(true);
      expect(wrapper.text()).toContain('Header Content');
    });

    it('should render with base class', () => {
      const wrapper = mount(Header);
      expect(wrapper.find('header').classes()).toContain('chips-layout-header');
    });
  });

  describe('height', () => {
    it('should apply height style when passed as number', () => {
      const wrapper = mount(Header, {
        props: { height: 64 },
      });

      expect(wrapper.find('header').attributes('style')).toContain('height: 64px');
    });

    it('should apply height style when passed as string', () => {
      const wrapper = mount(Header, {
        props: { height: '4rem' },
      });

      expect(wrapper.find('header').attributes('style')).toContain('height: 4rem');
    });

    it('should not have style when height is not provided', () => {
      const wrapper = mount(Header);
      expect(wrapper.find('header').attributes('style')).toBeUndefined();
    });
  });
});

describe('Sider', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let addListenerMock: ReturnType<typeof vi.fn>;
  let removeListenerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addListenerMock = vi.fn();
    removeListenerMock = vi.fn();
    matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: addListenerMock,
      removeEventListener: removeListenerMock,
      addListener: addListenerMock,
      removeListener: removeListenerMock,
    }));
    vi.stubGlobal('matchMedia', matchMediaMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Sider, {
        slots: {
          default: 'Sider Content',
        },
      });

      expect(wrapper.find('aside').exists()).toBe(true);
      expect(wrapper.text()).toContain('Sider Content');
    });

    it('should render with base class', () => {
      const wrapper = mount(Sider);
      expect(wrapper.find('aside').classes()).toContain('chips-layout-sider');
    });

    it('should render children wrapper', () => {
      const wrapper = mount(Sider, {
        slots: {
          default: 'Content',
        },
      });

      expect(wrapper.find('.chips-layout-sider__children').exists()).toBe(true);
      expect(wrapper.find('.chips-layout-sider__children').text()).toBe('Content');
    });
  });

  describe('width', () => {
    it('should apply default width', () => {
      const wrapper = mount(Sider);
      const style = wrapper.find('aside').attributes('style');

      expect(style).toContain('width: 200px');
    });

    it('should apply custom width as number', () => {
      const wrapper = mount(Sider, {
        props: { width: 300 },
      });

      expect(wrapper.find('aside').attributes('style')).toContain('width: 300px');
    });

    it('should apply custom width as string', () => {
      const wrapper = mount(Sider, {
        props: { width: '20%' },
      });

      expect(wrapper.find('aside').attributes('style')).toContain('width: 20%');
    });
  });

  describe('collapsible', () => {
    it('should add collapsible class when collapsible', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true },
      });

      expect(wrapper.find('aside').classes()).toContain('chips-layout-sider--collapsible');
    });

    it('should render trigger when collapsible', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true },
      });

      expect(wrapper.find('.chips-layout-sider__trigger').exists()).toBe(true);
    });

    it('should not render trigger when not collapsible', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: false },
      });

      expect(wrapper.find('.chips-layout-sider__trigger').exists()).toBe(false);
    });
  });

  describe('collapsed', () => {
    it('should apply collapsed width when collapsed', () => {
      const wrapper = mount(Sider, {
        props: { collapsed: true },
      });

      expect(wrapper.find('aside').attributes('style')).toContain('width: 80px');
    });

    it('should apply custom collapsed width', () => {
      const wrapper = mount(Sider, {
        props: { collapsed: true, collapsedWidth: 50 },
      });

      expect(wrapper.find('aside').attributes('style')).toContain('width: 50px');
    });

    it('should add collapsed class when collapsed', () => {
      const wrapper = mount(Sider, {
        props: { collapsed: true },
      });

      expect(wrapper.find('aside').classes()).toContain('chips-layout-sider--collapsed');
    });

    it('should toggle collapsed on trigger click', async () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true },
      });

      await wrapper.find('.chips-layout-sider__trigger').trigger('click');

      expect(wrapper.emitted('update:collapsed')).toBeTruthy();
      expect(wrapper.emitted('update:collapsed')![0]).toEqual([true]);
      expect(wrapper.emitted('collapse')).toBeTruthy();
      expect(wrapper.emitted('collapse')![0]).toEqual([true, 'clickTrigger']);
    });

    it('should support v-model:collapsed', async () => {
      const TestComponent = defineComponent({
        setup() {
          const collapsed = ref(false);
          return { collapsed };
        },
        render() {
          return h(Sider, {
            collapsed: this.collapsed,
            collapsible: true,
            'onUpdate:collapsed': (val: boolean) => {
              this.collapsed = val;
            },
          });
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.find('aside').classes()).not.toContain('chips-layout-sider--collapsed');

      await wrapper.find('.chips-layout-sider__trigger').trigger('click');
      await nextTick();

      expect(wrapper.find('aside').classes()).toContain('chips-layout-sider--collapsed');
    });
  });

  describe('reverseArrow', () => {
    it('should add reverse class to trigger when reverseArrow is true', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true, reverseArrow: true },
      });

      expect(wrapper.find('.chips-layout-sider__trigger').classes()).toContain(
        'chips-layout-sider__trigger--reverse'
      );
    });
  });

  describe('breakpoint', () => {
    it('should setup media query listener when breakpoint is provided', () => {
      mount(Sider, {
        props: { breakpoint: 'md' },
      });

      expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 768px)');
      expect(addListenerMock).toHaveBeenCalled();
    });

    it('should emit breakpoint event when media query matches', async () => {
      let changeCallback: ((e: { matches: boolean }) => void) | null = null;

      matchMediaMock.mockImplementation(() => ({
        matches: false,
        addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
          changeCallback = cb;
        },
        removeEventListener: vi.fn(),
        addListener: (cb: (e: { matches: boolean }) => void) => {
          changeCallback = cb;
        },
        removeListener: vi.fn(),
      }));

      const wrapper = mount(Sider, {
        props: { breakpoint: 'md' },
      });

      // Initial breakpoint event should be emitted with false (matches: false from mock)
      expect(wrapper.emitted('breakpoint')).toBeTruthy();
      expect(wrapper.emitted('breakpoint')![0]).toEqual([false]);

      // Simulate media query change to matches: true
      if (changeCallback) {
        changeCallback({ matches: true });
      }

      await nextTick();

      // Second event should be with true
      expect(wrapper.emitted('breakpoint')!.length).toBe(2);
      expect(wrapper.emitted('breakpoint')![1]).toEqual([true]);
    });

    it('should cleanup media query listener on unmount', () => {
      const wrapper = mount(Sider, {
        props: { breakpoint: 'md' },
      });

      wrapper.unmount();

      expect(removeListenerMock).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes on trigger', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true },
      });

      const trigger = wrapper.find('.chips-layout-sider__trigger');
      expect(trigger.attributes('role')).toBe('button');
      expect(trigger.attributes('tabindex')).toBe('0');
      expect(trigger.attributes('aria-expanded')).toBe('true');
    });

    it('should update aria-expanded when collapsed', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true, collapsed: true },
      });

      expect(wrapper.find('.chips-layout-sider__trigger').attributes('aria-expanded')).toBe('false');
    });

    it('should respond to keyboard events', async () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true },
      });

      await wrapper.find('.chips-layout-sider__trigger').trigger('keydown.enter');
      expect(wrapper.emitted('collapse')).toBeTruthy();
    });
  });

  describe('slots', () => {
    it('should render custom trigger slot', () => {
      const wrapper = mount(Sider, {
        props: { collapsible: true },
        slots: {
          trigger: '<span class="custom-trigger">Toggle</span>',
        },
      });

      expect(wrapper.find('.custom-trigger').exists()).toBe(true);
      expect(wrapper.find('.custom-trigger').text()).toBe('Toggle');
    });
  });
});

describe('Content', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Content, {
        slots: {
          default: 'Content Area',
        },
      });

      expect(wrapper.find('main').exists()).toBe(true);
      expect(wrapper.text()).toContain('Content Area');
    });

    it('should render with base class', () => {
      const wrapper = mount(Content);
      expect(wrapper.find('main').classes()).toContain('chips-layout-content');
    });
  });
});

describe('Footer', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Footer, {
        slots: {
          default: 'Footer Content',
        },
      });

      expect(wrapper.find('footer').exists()).toBe(true);
      expect(wrapper.text()).toContain('Footer Content');
    });

    it('should render with base class', () => {
      const wrapper = mount(Footer);
      expect(wrapper.find('footer').classes()).toContain('chips-layout-footer');
    });
  });
});

describe('Layout Integration', () => {
  it('should render complete layout structure', () => {
    const wrapper = mount(Layout, {
      slots: {
        default: () => [
          h(Header, {}, () => 'Header'),
          h(Layout, {}, () => [
            h(Sider, {}, () => 'Sider'),
            h(Layout, {}, () => [
              h(Content, {}, () => 'Content'),
              h(Footer, {}, () => 'Footer'),
            ]),
          ]),
        ],
      },
    });

    expect(wrapper.find('.chips-layout-header').text()).toBe('Header');
    expect(wrapper.find('.chips-layout-sider').exists()).toBe(true);
    expect(wrapper.find('.chips-layout-content').text()).toBe('Content');
    expect(wrapper.find('.chips-layout-footer').text()).toBe('Footer');
  });

  it('should auto detect Sider in nested layout', async () => {
    const wrapper = mount(Layout, {
      slots: {
        default: () => [
          h(Header, {}, () => 'Header'),
          h(Layout, {}, () => [h(Sider), h(Content)]),
        ],
      },
    });

    await nextTick();

    // The inner Layout should have has-sider class
    const layouts = wrapper.findAll('.chips-layout');
    expect(layouts[1].classes()).toContain('chips-layout--has-sider');
  });
});
