/**
 * 导航组件导出
 */

// Dropdown 下拉菜单
export { Dropdown } from './Dropdown';
export type {
  DropdownProps,
  DropdownEmits,
  DropdownSlots,
  DropdownInstance,
  DropdownPlacement,
  DropdownTrigger,
} from './Dropdown';

// Menu 菜单
export {
  Menu,
  MenuItem,
  SubMenu,
  MenuItemGroup,
  MenuDivider,
} from './Menu';
export type {
  MenuProps,
  MenuEmits,
  MenuSlots,
  MenuInstance,
  MenuMode,
  MenuTheme,
  MenuItemProps,
  MenuItemEmits,
  MenuItemSlots,
  SubMenuProps,
  SubMenuSlots,
  MenuItemGroupProps,
  MenuItemGroupSlots,
  MenuClickEventInfo,
  MenuSelectEventInfo,
  MenuContext,
  MENU_INJECTION_KEY,
} from './Menu';

// Breadcrumb 面包屑
export { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
export type {
  BreadcrumbProps,
  BreadcrumbSlots,
  BreadcrumbInstance,
  BreadcrumbItemProps,
  BreadcrumbItemEmits,
  BreadcrumbItemSlots,
  BreadcrumbItemInstance,
  BreadcrumbContext,
  BREADCRUMB_INJECTION_KEY,
} from './Breadcrumb';

// Tabs 标签页
export { Tabs, TabPane } from './Tabs';
export type {
  TabsProps,
  TabsEmits,
  TabsSlots,
  TabsInstance,
  TabsType,
  TabsSize,
  TabsPosition,
  TabPaneProps,
  TabPaneSlots,
  TabPaneInstance,
  TabPaneConfig,
  TabsContext,
  TABS_INJECTION_KEY,
} from './Tabs';

// Pagination 分页
export { Pagination } from './Pagination';
export type {
  PaginationProps,
  PaginationEmits,
  PaginationSlots,
  PaginationInstance,
  PaginationSize,
  PaginationItem,
  PaginationItemType,
  ShowTotalFn,
} from './Pagination';
