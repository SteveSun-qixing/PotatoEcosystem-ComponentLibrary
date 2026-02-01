/**
 * 反馈组件导出
 *
 * 当前已实现:
 * - Loading - 加载
 * - Tooltip - 文字提示
 * - Modal - 对话框
 * - Message - 消息提示
 * - Alert - 警告提示
 *
 * 待实现组件:
 * - Drawer - 抽屉
 * - Notification - 通知提醒
 * - Popover - 气泡卡片
 */

// Loading 加载
export * from './Loading';

// Tooltip 文字提示
export * from './Tooltip';

// Modal 对话框
export { Modal } from './Modal';
export type {
  ModalProps,
  ModalEmits,
  ModalSlots,
  ModalInstance,
} from './Modal';

// Message 消息提示
export {
  Message,
  MessageContainer,
  message,
  useMessage,
} from './Message';
export type {
  MessageType,
  MessageConfig,
  MessageInstance,
  MessageGlobalConfig,
  MessageApi,
  MessageProps,
  MessageEmits,
  MessageContainerProps,
} from './Message';

// Alert 警告提示
export { Alert } from './Alert';
export type {
  AlertProps,
  AlertEmits,
  AlertSlots,
  AlertInstance,
  AlertType,
} from './Alert';

// Drawer 抽屉（如果已实现）
// export { Drawer } from './Drawer';
// export type { DrawerProps, DrawerEmits, DrawerSlots, DrawerInstance } from './Drawer';

// Popover 气泡卡片
export { Popover } from './Popover';
export type {
  PopoverProps,
  PopoverEmits,
  PopoverSlots,
  PopoverInstance,
  PopoverPlacement,
  PopoverTrigger,
} from './Popover';

// Progress 进度条
export { Progress } from './Progress';
export type {
  ProgressProps,
  ProgressEmits,
  ProgressSlots,
  ProgressType,
  ProgressStatus,
  ProgressSize,
} from './Progress';
