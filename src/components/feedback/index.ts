/**
 * 反馈组件导出
 *
 * 当前已实现:
 * - Loading - 加载
 * - Tooltip - 文字提示
 * - Modal - 对话框
 * - Message - 消息提示
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
