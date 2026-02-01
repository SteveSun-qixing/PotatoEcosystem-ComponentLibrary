import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Breadcrumb from '../Breadcrumb.vue';
import BreadcrumbItem from '../BreadcrumbItem.vue';

// Mock router-link
const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to', 'custom'],
  template: '<slot :navigate="navigate" />',
  setup() {
    return {
      navigate: vi.fn(),
    };
  },
};

describe('Breadcrumb', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => [
            h(BreadcrumbItem, null, () => 'Home'),
            h(BreadcrumbItem, null, () => 'Products'),
            h(BreadcrumbItem, null, () => 'Detail'),
          ],
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.chips-breadcrumb').exists()).toBe(true);
      expect(wrapper.findAll('.chips-breadcrumb__item').length).toBe(3);
    });

    it('should render with nav element', () => {
      const wrapper = mount(Breadcrumb);

      expect(wrapper.find('nav.chips-breadcrumb').exists()).toBe(true);
    });

    it('should have aria-label', () => {
      const wrapper = mount(Breadcrumb);

      expect(wrapper.find('nav').attributes('aria-label')).toBe('breadcrumb');
    });
  });

  describe('separator', () => {
    it('should render default separator', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => [
            h(BreadcrumbItem, null, () => 'Home'),
            h(BreadcrumbItem, null, () => 'Products'),
          ],
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      const separators = wrapper.findAll('.chips-breadcrumb__separator');
      expect(separators[0].text()).toBe('/');
    });

    it('should render custom separator', () => {
      const wrapper = mount(Breadcrumb, {
        props: { separator: '>' },
        slots: {
          default: () => [
            h(BreadcrumbItem, null, () => 'Home'),
            h(BreadcrumbItem, null, () => 'Products'),
          ],
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      const separators = wrapper.findAll('.chips-breadcrumb__separator');
      expect(separators[0].text()).toBe('>');
    });
  });

  describe('BreadcrumbItem', () => {
    it('should render item content', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, null, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.chips-breadcrumb__item').exists()).toBe(true);
      expect(wrapper.text()).toContain('Home');
    });

    it('should render link with href', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, { href: '/home' }, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      const link = wrapper.find('a.chips-breadcrumb__link');
      expect(link.exists()).toBe(true);
      expect(link.attributes('href')).toBe('/home');
    });

    it('should render link with to (router-link)', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, { to: '/home' }, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.chips-breadcrumb__link').exists()).toBe(true);
    });

    it('should render disabled state', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, { disabled: true }, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.chips-breadcrumb__item').classes()).toContain('chips-breadcrumb__item--disabled');
    });

    it('should emit click event', async () => {
      const handleClick = vi.fn();
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, { onClick: handleClick }, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      await wrapper.find('.chips-breadcrumb__link').trigger('click');
      expect(handleClick).toHaveBeenCalled();
    });

    it('should not emit click when disabled', async () => {
      const handleClick = vi.fn();
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, { disabled: true, onClick: handleClick }, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      await wrapper.find('.chips-breadcrumb__link').trigger('click');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not render href link when disabled', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, { href: '/home', disabled: true }, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      // 禁用时应该渲染 span 而不是 a
      expect(wrapper.find('a.chips-breadcrumb__link').exists()).toBe(false);
      expect(wrapper.find('span.chips-breadcrumb__link').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have aria-hidden on separator', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, null, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.chips-breadcrumb__separator').attributes('aria-hidden')).toBe('true');
    });

    it('should use ol element for list', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, null, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('ol.chips-breadcrumb__list').exists()).toBe(true);
    });

    it('should use li element for items', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () => h(BreadcrumbItem, null, () => 'Home'),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('li.chips-breadcrumb__item').exists()).toBe(true);
    });
  });

  describe('slots', () => {
    it('should render default slot as content', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () =>
            h(BreadcrumbItem, null, {
              default: () => h('span', { class: 'custom-content' }, 'Custom'),
            }),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.custom-content').exists()).toBe(true);
    });

    it('should render custom separator slot', () => {
      const wrapper = mount(Breadcrumb, {
        slots: {
          default: () =>
            h(BreadcrumbItem, null, {
              default: () => 'Home',
              separator: () => h('span', { class: 'custom-separator' }, '→'),
            }),
        },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      });

      expect(wrapper.find('.custom-separator').exists()).toBe(true);
      expect(wrapper.find('.custom-separator').text()).toBe('→');
    });
  });
});
