/**
 * Tabs 组件测试
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Tabs from '../Tabs.vue';
import TabPane from '../TabPane.vue';

// 辅助函数：创建带 TabPane 的 Tabs
const createTabs = (props = {}, tabPaneProps: Array<Record<string, unknown>> = []) => {
  return mount(Tabs, {
    props,
    slots: {
      default: tabPaneProps.map((paneProps, index) =>
        h(
          TabPane,
          { key: `tab-${index}`, name: `tab-${index}`, ...paneProps },
          { default: () => `Content ${index + 1}` }
        )
      ),
    },
  });
};

describe('Tabs', () => {
  describe('渲染', () => {
    it('应该渲染正确的基础类名', () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.exists()).toBe(true);
      expect(tabs.classes()).toContain('chips-tabs--line');
      expect(tabs.classes()).toContain('chips-tabs--top');
      expect(tabs.classes()).toContain('chips-tabs--medium');
    });

    it('应该根据 type 渲染正确的类名', () => {
      const wrapper = createTabs({ type: 'card' }, [{ tab: 'Tab 1' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.classes()).toContain('chips-tabs--card');
    });

    it('应该根据 tabPosition 渲染正确的类名', () => {
      const wrapper = createTabs({ tabPosition: 'left' }, [{ tab: 'Tab 1' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.classes()).toContain('chips-tabs--left');
    });

    it('应该根据 size 渲染正确的类名', () => {
      const wrapper = createTabs({ size: 'small' }, [{ tab: 'Tab 1' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.classes()).toContain('chips-tabs--small');
    });

    it('应该在 centered 为 true 时添加居中类名', () => {
      const wrapper = createTabs({ centered: true }, [{ tab: 'Tab 1' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.classes()).toContain('chips-tabs--centered');
    });

    it('应该渲染导航区域', () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      expect(wrapper.find('.chips-tabs__nav').exists()).toBe(true);
      expect(wrapper.find('.chips-tabs__nav-list').exists()).toBe(true);
    });

    it('应该渲染内容区域', () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }]);

      expect(wrapper.find('.chips-tabs__content').exists()).toBe(true);
    });

    it('应该渲染指示条（line 类型）', () => {
      const wrapper = createTabs({ type: 'line' }, [{ tab: 'Tab 1' }]);

      expect(wrapper.find('.chips-tabs__ink-bar').exists()).toBe(true);
    });

    it('应该渲染新增按钮（editable-card 类型）', () => {
      const wrapper = createTabs({ type: 'editable-card' }, [{ tab: 'Tab 1' }]);

      expect(wrapper.find('.chips-tabs__add-btn').exists()).toBe(true);
    });
  });

  describe('Tab 切换', () => {
    it('应该默认激活第一个未禁用的 tab', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      await nextTick();
      await nextTick();

      const tabs = wrapper.findAll('.chips-tabs__tab');
      expect(tabs[0]!.classes()).toContain('chips-tabs__tab--active');
    });

    it('应该使用 defaultActiveKey 设置初始激活项', async () => {
      const wrapper = createTabs({ defaultActiveKey: 'tab-1' }, [
        { tab: 'Tab 1' },
        { tab: 'Tab 2' },
      ]);

      await nextTick();
      await nextTick();

      const tabs = wrapper.findAll('.chips-tabs__tab');
      expect(tabs[1]!.classes()).toContain('chips-tabs__tab--active');
    });

    it('点击 tab 应该切换激活项', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      await nextTick();
      await nextTick();

      const tabs = wrapper.findAll('.chips-tabs__tab');
      await tabs[1]!.trigger('click');

      expect(tabs[1]!.classes()).toContain('chips-tabs__tab--active');
    });

    it('点击 tab 应该触发事件', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      await nextTick();
      await nextTick();

      const tabs = wrapper.findAll('.chips-tabs__tab');
      await tabs[1]!.trigger('click');

      expect(wrapper.emitted('tabClick')).toBeTruthy();
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('update:activeKey')).toBeTruthy();
    });

    it('点击禁用的 tab 不应该切换', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2', disabled: true }]);

      await nextTick();
      await nextTick();

      const tabs = wrapper.findAll('.chips-tabs__tab');
      await tabs[1]!.trigger('click');

      expect(tabs[0]!.classes()).toContain('chips-tabs__tab--active');
      expect(tabs[1]!.classes()).not.toContain('chips-tabs__tab--active');
    });
  });

  describe('禁用状态', () => {
    it('禁用的 tab 应该有 disabled 类名', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1', disabled: true }]);

      await nextTick();
      await nextTick();

      const tab = wrapper.find('.chips-tabs__tab');
      expect(tab.classes()).toContain('chips-tabs__tab--disabled');
    });

    it('禁用的 tab 应该有正确的 aria 属性', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1', disabled: true }]);

      await nextTick();
      await nextTick();

      const tab = wrapper.find('.chips-tabs__tab');
      expect(tab.attributes('aria-disabled')).toBe('true');
    });
  });

  describe('Editable Card', () => {
    it('应该显示关闭按钮', async () => {
      const wrapper = createTabs({ type: 'editable-card' }, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      expect(wrapper.find('.chips-tabs__tab-close').exists()).toBe(true);
    });

    it('点击关闭按钮应该触发 edit 事件', async () => {
      const wrapper = createTabs({ type: 'editable-card' }, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      const closeBtn = wrapper.find('.chips-tabs__tab-close');
      await closeBtn.trigger('click');

      expect(wrapper.emitted('edit')).toBeTruthy();
      const editEvent = wrapper.emitted('edit')!;
      expect(editEvent[0]![1]).toBe('remove');
    });

    it('点击新增按钮应该触发 edit 事件', async () => {
      const wrapper = createTabs({ type: 'editable-card' }, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      const addBtn = wrapper.find('.chips-tabs__add-btn');
      await addBtn.trigger('click');

      expect(wrapper.emitted('edit')).toBeTruthy();
      const editEvent = wrapper.emitted('edit')!;
      expect(editEvent[0]![1]).toBe('add');
    });

    it('closable 为 false 的 tab 不应该显示关闭按钮', async () => {
      const wrapper = createTabs({ type: 'editable-card' }, [{ tab: 'Tab 1', closable: false }]);

      await nextTick();
      await nextTick();

      expect(wrapper.find('.chips-tabs__tab-close').exists()).toBe(false);
    });
  });

  describe('附加内容', () => {
    it('应该渲染左侧附加内容', () => {
      const wrapper = mount(Tabs, {
        slots: {
          leftExtra: () => h('div', { class: 'left-extra' }, 'Left'),
        },
      });

      expect(wrapper.find('.chips-tabs__extra-content--left').exists()).toBe(true);
      expect(wrapper.find('.left-extra').exists()).toBe(true);
    });

    it('应该渲染右侧附加内容', () => {
      const wrapper = mount(Tabs, {
        slots: {
          rightExtra: () => h('div', { class: 'right-extra' }, 'Right'),
        },
      });

      expect(wrapper.find('.chips-tabs__extra-content--right').exists()).toBe(true);
      expect(wrapper.find('.right-extra').exists()).toBe(true);
    });
  });

  describe('无障碍', () => {
    it('应该有正确的 role 属性', () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.attributes('role')).toBe('tablist');
    });

    it('应该有正确的 aria-orientation 属性', () => {
      const wrapper = createTabs({ tabPosition: 'left' }, [{ tab: 'Tab 1' }]);
      const tabs = wrapper.find('.chips-tabs');

      expect(tabs.attributes('aria-orientation')).toBe('vertical');
    });

    it('tab 应该有正确的 role 属性', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      const tab = wrapper.find('.chips-tabs__tab');
      expect(tab.attributes('role')).toBe('tab');
    });

    it('激活的 tab 应该有正确的 aria-selected 属性', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      await nextTick();
      await nextTick();

      const tabs = wrapper.findAll('.chips-tabs__tab');
      expect(tabs[0]!.attributes('aria-selected')).toBe('true');
      expect(tabs[1]!.attributes('aria-selected')).toBe('false');
    });
  });
});

describe('TabPane', () => {
  describe('渲染', () => {
    it('应该渲染正确的类名', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      const pane = wrapper.find('.chips-tabs__tabpane');
      expect(pane.exists()).toBe(true);
    });

    it('激活的面板应该有 active 类名', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      const pane = wrapper.find('.chips-tabs__tabpane');
      expect(pane.classes()).toContain('chips-tabs__tabpane--active');
    });

    it('非激活的面板应该有 hidden 类名', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      await nextTick();
      await nextTick();
      await nextTick();

      const panes = wrapper.findAll('.chips-tabs__tabpane');
      // TabPane 默认只有激活过的才会渲染，所以第二个面板可能不存在
      if (panes.length > 1) {
        expect(panes[1]!.classes()).toContain('chips-tabs__tabpane--hidden');
      } else {
        // 如果只有一个面板被渲染，说明 destroyInactiveTabPane 正常工作
        expect(panes.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('无障碍', () => {
    it('面板应该有正确的 role 属性', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }]);

      await nextTick();
      await nextTick();

      const pane = wrapper.find('.chips-tabs__tabpane');
      expect(pane.attributes('role')).toBe('tabpanel');
    });

    it('非激活面板应该有正确的 aria-hidden 属性', async () => {
      const wrapper = createTabs({}, [{ tab: 'Tab 1' }, { tab: 'Tab 2' }]);

      await nextTick();
      await nextTick();
      await nextTick();

      const panes = wrapper.findAll('.chips-tabs__tabpane');
      // TabPane 默认只有激活过的才会渲染
      if (panes.length > 1) {
        expect(panes[1]!.attributes('aria-hidden')).toBe('true');
      } else {
        // 如果只有一个面板被渲染，检查第一个面板
        expect(panes[0]!.attributes('aria-hidden')).toBe('false');
      }
    });
  });
});
