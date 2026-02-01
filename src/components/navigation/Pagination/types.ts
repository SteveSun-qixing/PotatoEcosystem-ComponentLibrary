/**
 * Pagination 分页组件类型定义
 */

import type { VNode } from 'vue';

/**
 * 分页尺寸
 */
export type PaginationSize = 'default' | 'small';

/**
 * showTotal 函数类型
 */
export type ShowTotalFn = (total: number, range: [number, number]) => string;

/**
 * Pagination Props
 */
export interface PaginationProps {
  /** 当前页码 (受控) */
  current?: number;
  /** 默认当前页码 (非受控) */
  defaultCurrent?: number;
  /** 数据总数 */
  total?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 默认每页条数 */
  defaultPageSize?: number;
  /** 每页条数选项 */
  pageSizeOptions?: number[];
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 是否显示数据总量 */
  showTotal?: boolean | ShowTotalFn;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为简洁模式 */
  simple?: boolean;
  /** 尺寸 */
  size?: PaginationSize;
  /** 是否显示较少页码 */
  showLessItems?: boolean;
  /** 只有一页时是否隐藏 */
  hideOnSinglePage?: boolean;
}

/**
 * Pagination Emits
 */
export interface PaginationEmits {
  /** 页码改变时触发 */
  (e: 'update:current', page: number): void;
  /** 页码改变时触发 */
  (e: 'change', page: number, pageSize: number): void;
  /** 每页条数改变时触发 */
  (e: 'update:pageSize', size: number): void;
  /** 每页条数改变时触发 */
  (e: 'pageSizeChange', current: number, size: number): void;
}

/**
 * Pagination Slots
 */
export interface PaginationSlots {
  /** 上一页按钮内容 */
  prevIcon?: () => VNode[];
  /** 下一页按钮内容 */
  nextIcon?: () => VNode[];
  /** 向前跳转按钮内容 */
  jumpPrevIcon?: () => VNode[];
  /** 向后跳转按钮内容 */
  jumpNextIcon?: () => VNode[];
}

/**
 * 分页项类型
 */
export type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

/**
 * 分页项
 */
export interface PaginationItem {
  /** 类型 */
  type: PaginationItemType;
  /** 页码（仅 page 类型有效） */
  page?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否激活 */
  active?: boolean;
}

/**
 * Pagination 暴露的方法
 */
export interface PaginationInstance {
  /** 获取 DOM 元素 */
  $el: HTMLElement | null;
}
