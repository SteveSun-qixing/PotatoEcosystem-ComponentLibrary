import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { h } from 'vue';
import Menu from '../Menu.vue';
import MenuItem from '../MenuItem.vue';
import SubMenu from '../SubMenu.vue';
import MenuItemGroup from '../MenuItemGroup.vue';
import MenuDivider from '../MenuDivider.vue';

describe('Menu', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
          ],
        },
      });

      expect(wrapper.find('.chips-menu').exists()).toBe(true);
      expect(wrapper.findAll('.chips-menu-item').length).toBe(2);
    });

    it('should render with default mode (vertical)', () => {
      const wrapper = mount(Menu);

      expect(wrapper.find('.chips-menu').classes()).toContain('chips-menu--vertical');
    });

    it('should render with horizontal mode', () => {
      const wrapper = mount(Menu, {
        props: { mode: 'horizontal' },
      });

      expect(wrapper.find('.chips-menu').classes()).toContain('chips-menu--horizontal');
    });

    it('should render with inline mode', () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
      });

      expect(wrapper.find('.chips-menu').classes()).toContain('chips-menu--inline');
    });
  });

  describe('theme', () => {
    it('should render with light theme by default', () => {
      const wrapper = mount(Menu);

      expect(wrapper.find('.chips-menu').classes()).toContain('chips-menu--light');
    });

    it('should render with dark theme', () => {
      const wrapper = mount(Menu, {
        props: { theme: 'dark' },
      });

      expect(wrapper.find('.chips-menu').classes()).toContain('chips-menu--dark');
    });
  });

  describe('collapsed', () => {
    it('should have collapsed class when collapsed', () => {
      const wrapper = mount(Menu, {
        props: { collapsed: true },
      });

      expect(wrapper.find('.chips-menu').classes()).toContain('chips-menu--collapsed');
    });
  });

  describe('selection', () => {
    it('should select item on click', async () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
          ],
        },
      });

      const items = wrapper.findAll('.chips-menu-item');
      await items[0].trigger('click');

      expect(items[0].classes()).toContain('chips-menu-item--selected');
    });

    it('should emit select event', async () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
          ],
        },
      });

      const item = wrapper.find('.chips-menu-item');
      await item.trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')![0][0]).toMatchObject({
        key: 'item1',
        keyPath: ['item1'],
      });
    });

    it('should emit click event', async () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
          ],
        },
      });

      const item = wrapper.find('.chips-menu-item');
      await item.trigger('click');

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')![0][0]).toMatchObject({
        key: 'item1',
      });
    });

    it('should respect defaultSelectedKeys', () => {
      const wrapper = mount(Menu, {
        props: { defaultSelectedKeys: ['item2'] },
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
          ],
        },
      });

      const items = wrapper.findAll('.chips-menu-item');
      expect(items[1].classes()).toContain('chips-menu-item--selected');
    });

    it('should respect controlled selectedKeys', async () => {
      const wrapper = mount(Menu, {
        props: { selectedKeys: ['item1'] },
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
          ],
        },
      });

      const items = wrapper.findAll('.chips-menu-item');
      expect(items[0].classes()).toContain('chips-menu-item--selected');

      await wrapper.setProps({ selectedKeys: ['item2'] });
      expect(items[0].classes()).not.toContain('chips-menu-item--selected');
      expect(items[1].classes()).toContain('chips-menu-item--selected');
    });

    it('should support multiple selection', async () => {
      const wrapper = mount(Menu, {
        props: { multiple: true },
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
          ],
        },
      });

      const items = wrapper.findAll('.chips-menu-item');
      await items[0].trigger('click');
      await items[1].trigger('click');

      expect(items[0].classes()).toContain('chips-menu-item--selected');
      expect(items[1].classes()).toContain('chips-menu-item--selected');
    });
  });

  describe('MenuItem', () => {
    it('should render with disabled state', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuItem, { itemKey: 'item1', disabled: true }, () => 'Item 1'),
        },
      });

      const item = wrapper.find('.chips-menu-item');
      expect(item.classes()).toContain('chips-menu-item--disabled');
    });

    it('should not select disabled item', async () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuItem, { itemKey: 'item1', disabled: true }, () => 'Item 1'),
        },
      });

      const item = wrapper.find('.chips-menu-item');
      await item.trigger('click');

      expect(item.classes()).not.toContain('chips-menu-item--selected');
      expect(wrapper.emitted('select')).toBeFalsy();
    });

    it('should render with danger state', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuItem, { itemKey: 'item1', danger: true }, () => 'Item 1'),
        },
      });

      const item = wrapper.find('.chips-menu-item');
      expect(item.classes()).toContain('chips-menu-item--danger');
    });

    it('should render icon slot', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () =>
            h(MenuItem, { itemKey: 'item1' }, {
              default: () => 'Item 1',
              icon: () => h('span', { class: 'custom-icon' }, '★'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-item__icon').exists()).toBe(true);
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
    });
  });

  describe('SubMenu', () => {
    it('should render submenu', () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-submenu').exists()).toBe(true);
      expect(wrapper.find('.chips-menu-submenu__title').exists()).toBe(true);
    });

    it('should toggle submenu on click in inline mode', async () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      const title = wrapper.find('.chips-menu-submenu__title');

      // 点击展开
      await title.trigger('click');
      expect(wrapper.find('.chips-menu-submenu').classes()).toContain('chips-menu-submenu--open');

      // 再次点击收起
      await title.trigger('click');
      expect(wrapper.find('.chips-menu-submenu').classes()).not.toContain('chips-menu-submenu--open');
    });

    it('should emit openChange event', async () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      const title = wrapper.find('.chips-menu-submenu__title');
      await title.trigger('click');

      expect(wrapper.emitted('openChange')).toBeTruthy();
      expect(wrapper.emitted('openChange')![0]).toEqual([['sub1']]);
    });

    it('should respect defaultOpenKeys', () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline', defaultOpenKeys: ['sub1'] },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-submenu').classes()).toContain('chips-menu-submenu--open');
    });

    it('should respect controlled openKeys', async () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline', openKeys: [] },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-submenu').classes()).not.toContain('chips-menu-submenu--open');

      await wrapper.setProps({ openKeys: ['sub1'] });
      expect(wrapper.find('.chips-menu-submenu').classes()).toContain('chips-menu-submenu--open');
    });

    it('should render disabled submenu', () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu', disabled: true }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-submenu').classes()).toContain('chips-menu-submenu--disabled');
    });

    it('should not toggle disabled submenu', async () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu', disabled: true }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      const title = wrapper.find('.chips-menu-submenu__title');
      await title.trigger('click');

      expect(wrapper.find('.chips-menu-submenu').classes()).not.toContain('chips-menu-submenu--open');
    });
  });

  describe('MenuItemGroup', () => {
    it('should render menu item group', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () =>
            h(MenuItemGroup, { title: 'Group 1' }, {
              default: () => [
                h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
                h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
              ],
            }),
        },
      });

      expect(wrapper.find('.chips-menu-group').exists()).toBe(true);
      expect(wrapper.find('.chips-menu-group__title').exists()).toBe(true);
      expect(wrapper.findAll('.chips-menu-item').length).toBe(2);
    });
  });

  describe('MenuDivider', () => {
    it('should render menu divider', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => [
            h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            h(MenuDivider),
            h(MenuItem, { itemKey: 'item2' }, () => 'Item 2'),
          ],
        },
      });

      expect(wrapper.find('.chips-menu-divider').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have role="menu" on menu', () => {
      const wrapper = mount(Menu);

      expect(wrapper.find('.chips-menu').attributes('role')).toBe('menu');
    });

    it('should have role="menuitem" on menu item', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
        },
      });

      expect(wrapper.find('.chips-menu-item').attributes('role')).toBe('menuitem');
    });

    it('should have aria-disabled on disabled item', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuItem, { itemKey: 'item1', disabled: true }, () => 'Item 1'),
        },
      });

      expect(wrapper.find('.chips-menu-item').attributes('aria-disabled')).toBe('true');
    });

    it('should have aria-selected on selected item', async () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
        },
      });

      const item = wrapper.find('.chips-menu-item');
      await item.trigger('click');

      expect(item.attributes('aria-selected')).toBe('true');
    });

    it('should have aria-expanded on submenu', () => {
      const wrapper = mount(Menu, {
        props: { mode: 'inline' },
        slots: {
          default: () =>
            h(SubMenu, { itemKey: 'sub1', title: 'SubMenu' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-submenu__title').attributes('aria-expanded')).toBe('false');
    });

    it('should have role="separator" on divider', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () => h(MenuDivider),
        },
      });

      expect(wrapper.find('.chips-menu-divider').attributes('role')).toBe('separator');
    });

    it('should have role="group" on menu item group', () => {
      const wrapper = mount(Menu, {
        slots: {
          default: () =>
            h(MenuItemGroup, { title: 'Group' }, {
              default: () => h(MenuItem, { itemKey: 'item1' }, () => 'Item 1'),
            }),
        },
      });

      expect(wrapper.find('.chips-menu-group').attributes('role')).toBe('group');
    });
  });
});
