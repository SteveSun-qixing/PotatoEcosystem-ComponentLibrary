/**
 * 事件类型定义
 */

/**
 * 通用事件处理器
 */
export type EventHandler<E = Event> = (event: E) => void;

/**
 * 值变更事件处理器
 */
export type ValueChangeHandler<T> = (value: T) => void;

/**
 * 键盘事件处理器
 */
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;

/**
 * 鼠标事件处理器
 */
export type MouseEventHandler = EventHandler<MouseEvent>;

/**
 * 焦点事件处理器
 */
export type FocusEventHandler = EventHandler<FocusEvent>;

/**
 * 表单事件处理器
 */
export type FormEventHandler = EventHandler<Event>;

/**
 * 组合事件处理器参数
 */
export interface ComposeEventHandlersOptions {
  /** 是否检查 defaultPrevented */
  checkDefaultPrevented?: boolean;
}
