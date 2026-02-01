/**
 * Pagination 组件测试
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../Pagination.vue';

describe('Pagination', () => {
  describe('渲染', () => {
    it('应该渲染正确的基础类名', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
        },
      });
      const pagination = wrapper.find('.chips-pagination');

      expect(pagination.exists()).toBe(true);
    });

    it('应该根据 size 渲染正确的类名', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          size: 'small',
        },
      });
      const pagination = wrapper.find('.chips-pagination');

      expect(pagination.classes()).toContain('chips-pagination--small');
    });

    it('应该在 simple 模式下渲染正确的类名', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          simple: true,
        },
      });
      const pagination = wrapper.find('.chips-pagination');

      expect(pagination.classes()).toContain('chips-pagination--simple');
    });

    it('应该在 disabled 状态下渲染正确的类名', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          disabled: true,
        },
      });
      const pagination = wrapper.find('.chips-pagination');

      expect(pagination.classes()).toContain('chips-pagination--disabled');
    });

    it('应该渲染上一页和下一页按钮', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
        },
      });

      expect(wrapper.find('.chips-pagination__prev').exists()).toBe(true);
      expect(wrapper.find('.chips-pagination__next').exists()).toBe(true);
    });

    it('应该渲染页码项', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          pageSize: 10,
        },
      });

      const items = wrapper.findAll('.chips-pagination__page');
      expect(items.length).toBeGreaterThan(0);
    });

    it('hideOnSinglePage 为 true 且只有一页时应该隐藏', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 5,
          pageSize: 10,
          hideOnSinglePage: true,
        },
      });

      expect(wrapper.find('.chips-pagination').exists()).toBe(false);
    });
  });

  describe('页码切换', () => {
    it('点击下一页应该切换到下一页', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 1,
        },
      });

      await wrapper.find('.chips-pagination__next').trigger('click');

      expect(wrapper.emitted('update:current')).toBeTruthy();
      expect(wrapper.emitted('update:current')![0]).toEqual([2]);
    });

    it('点击上一页应该切换到上一页', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 5,
        },
      });

      await wrapper.find('.chips-pagination__prev').trigger('click');

      expect(wrapper.emitted('update:current')).toBeTruthy();
      expect(wrapper.emitted('update:current')![0]).toEqual([4]);
    });

    it('点击页码应该切换到对应页', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 1,
        },
      });

      const pageItems = wrapper.findAll('.chips-pagination__page');
      // 点击第三个页码（应该是第 3 页）
      await pageItems[2]!.trigger('click');

      expect(wrapper.emitted('update:current')).toBeTruthy();
      expect(wrapper.emitted('update:current')![0]).toEqual([3]);
    });

    it('第一页时上一页按钮应该禁用', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 1,
        },
      });

      const prevBtn = wrapper.find('.chips-pagination__prev');
      expect(prevBtn.classes()).toContain('chips-pagination__item--disabled');
      expect(prevBtn.attributes('disabled')).toBeDefined();
    });

    it('最后一页时下一页按钮应该禁用', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          pageSize: 10,
          current: 10,
        },
      });

      const nextBtn = wrapper.find('.chips-pagination__next');
      expect(nextBtn.classes()).toContain('chips-pagination__item--disabled');
      expect(nextBtn.attributes('disabled')).toBeDefined();
    });
  });

  describe('禁用状态', () => {
    it('禁用状态下点击不应触发事件', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 5,
          disabled: true,
        },
      });

      await wrapper.find('.chips-pagination__next').trigger('click');
      await wrapper.find('.chips-pagination__prev').trigger('click');

      expect(wrapper.emitted('update:current')).toBeFalsy();
    });
  });

  describe('showTotal', () => {
    it('showTotal 为 true 时应该显示总数', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          showTotal: true,
        },
      });

      expect(wrapper.find('.chips-pagination__total').exists()).toBe(true);
      expect(wrapper.find('.chips-pagination__total').text()).toContain('100');
    });

    it('showTotal 为函数时应该使用自定义格式', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          pageSize: 10,
          current: 1,
          showTotal: (total: number, range: [number, number]) =>
            `显示 ${range[0]}-${range[1]} 共 ${total} 条`,
        },
      });

      expect(wrapper.find('.chips-pagination__total').text()).toBe('显示 1-10 共 100 条');
    });
  });

  describe('showSizeChanger', () => {
    it('应该显示每页条数选择器', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          showSizeChanger: true,
        },
      });

      expect(wrapper.find('.chips-pagination__options-size-changer').exists()).toBe(true);
    });

    it('改变每页条数应该触发事件', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        },
      });

      const select = wrapper.find('.chips-pagination__options-size-changer select');
      await select.setValue('20');

      expect(wrapper.emitted('update:pageSize')).toBeTruthy();
      expect(wrapper.emitted('update:pageSize')![0]).toEqual([20]);
    });
  });

  describe('showQuickJumper', () => {
    it('应该显示快速跳转', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          showQuickJumper: true,
        },
      });

      expect(wrapper.find('.chips-pagination__options-quick-jumper').exists()).toBe(true);
    });

    it('输入页码并回车应该跳转', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          showQuickJumper: true,
          current: 1,
        },
      });

      const input = wrapper.find('.chips-pagination__options-quick-jumper input');
      await input.setValue('5');
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:current')).toBeTruthy();
      expect(wrapper.emitted('update:current')![0]).toEqual([5]);
    });
  });

  describe('简洁模式', () => {
    it('应该渲染简洁模式', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          simple: true,
        },
      });

      expect(wrapper.find('.chips-pagination__simple-pager').exists()).toBe(true);
      expect(wrapper.find('.chips-pagination__simple-input').exists()).toBe(true);
    });

    it('简洁模式不应该显示页码列表', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          simple: true,
        },
      });

      expect(wrapper.findAll('.chips-pagination__page').length).toBe(0);
    });
  });

  describe('跳页功能', () => {
    it('点击 jump-prev 应该向前跳 5 页', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 200,
          pageSize: 10,
          current: 10,
        },
      });

      const jumpPrev = wrapper.find('.chips-pagination__jump-prev');
      if (jumpPrev.exists()) {
        await jumpPrev.trigger('click');

        expect(wrapper.emitted('update:current')).toBeTruthy();
        expect(wrapper.emitted('update:current')![0]).toEqual([5]);
      }
    });

    it('点击 jump-next 应该向后跳 5 页', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 200,
          pageSize: 10,
          current: 5,
        },
      });

      const jumpNext = wrapper.find('.chips-pagination__jump-next');
      if (jumpNext.exists()) {
        await jumpNext.trigger('click');

        expect(wrapper.emitted('update:current')).toBeTruthy();
        expect(wrapper.emitted('update:current')![0]).toEqual([10]);
      }
    });
  });

  describe('无障碍', () => {
    it('应该有正确的 role 属性', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
        },
      });
      const pagination = wrapper.find('.chips-pagination');

      expect(pagination.attributes('role')).toBe('navigation');
    });

    it('应该有正确的 aria-label 属性', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
        },
      });
      const pagination = wrapper.find('.chips-pagination');

      expect(pagination.attributes('aria-label')).toBe('Pagination');
    });

    it('激活的页码应该有 aria-current 属性', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 1,
        },
      });

      const activePage = wrapper.find('.chips-pagination__item--active');
      expect(activePage.attributes('aria-current')).toBe('page');
    });

    it('上一页按钮应该有 aria-label', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
        },
      });

      const prevBtn = wrapper.find('.chips-pagination__prev');
      expect(prevBtn.attributes('aria-label')).toBe('Previous page');
    });

    it('下一页按钮应该有 aria-label', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
        },
      });

      const nextBtn = wrapper.find('.chips-pagination__next');
      expect(nextBtn.attributes('aria-label')).toBe('Next page');
    });
  });

  describe('事件触发', () => {
    it('页码改变时应该触发 change 事件', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 1,
        },
      });

      await wrapper.find('.chips-pagination__next').trigger('click');

      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')![0]).toEqual([2, 10]);
    });

    it('每页条数改变时应该触发 pageSizeChange 事件', async () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 100,
          current: 1,
          showSizeChanger: true,
        },
      });

      const select = wrapper.find('.chips-pagination__options-size-changer select');
      await select.setValue('20');

      expect(wrapper.emitted('pageSizeChange')).toBeTruthy();
      expect(wrapper.emitted('pageSizeChange')![0]).toEqual([1, 20]);
    });
  });
});
