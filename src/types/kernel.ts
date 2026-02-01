/**
 * 内核通信类型定义
 */

/**
 * 内核请求参数
 */
export interface KernelRequest {
  /** 目标模块 */
  target: string;
  /** 动作名称 */
  action: string;
  /** 请求参数 */
  params?: Record<string, unknown>;
  /** 请求超时（毫秒） */
  timeout?: number;
}

/**
 * 内核响应
 */
export interface KernelResponse<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: KernelError;
}

/**
 * 内核错误
 */
export interface KernelError {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 详细信息 */
  details?: unknown;
}

/**
 * 内核连接状态
 */
export type KernelConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * 内核上下文值
 */
export interface KernelContextValue {
  /** 连接状态 */
  status: KernelConnectionStatus;
  /** 发送请求 */
  request: <T>(req: KernelRequest) => Promise<KernelResponse<T>>;
  /** 是否已连接 */
  isConnected: boolean;
}

/**
 * 公共基础层模块列表
 */
export type FoundationModule =
  | 'ChromiumCore'
  | 'VideoPlayer'
  | 'AudioPlayer'
  | 'MarkdownParser'
  | 'RichTextEditor'
  | 'CodeEditor'
  | 'ImageViewer'
  | 'PDFViewer'
  | 'OfficeViewer'
  | 'ModelViewer3D'
  | 'CanvasEngine'
  | 'MapRenderer'
  | 'ChartRenderer'
  | 'UIControls'
  | 'DragDropSystem'
  | 'WindowManager'
  | 'VirtualKeyboard'
  | 'I18nSystem'
  | 'DateTimeFormatter'
  | 'DataSerializer'
  | 'MediaConverter'
  | 'LogSystem'
  | 'DownloadManager'
  | 'SearchEngine'
  | 'NotificationCenter';

/**
 * 公共基础层请求参数
 */
export interface FoundationRequest<T extends FoundationModule = FoundationModule> {
  module: T;
  action: string;
  params?: Record<string, unknown>;
}
