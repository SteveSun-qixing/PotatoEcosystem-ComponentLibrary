/**
 * useMessage - Message 函数式 API 实现
 *
 * 提供函数式调用方式创建消息提示
 */

import { createApp, reactive, h, type App } from 'vue';
import MessageContainer from './MessageContainer.vue';
import type {
  MessageType,
  MessageConfig,
  MessageInstance,
  MessageGlobalConfig,
  MessageApi,
} from './types';
import { generateId } from '@/utils';

// 全局配置
const globalConfig: Required<MessageGlobalConfig> = {
  duration: 3000,
  maxCount: 5,
  top: 24,
  appendTo: 'body',
};

// 消息列表（响应式）
const messages = reactive<MessageConfig[]>([]);

// 容器实例
let containerApp: App | null = null;
let containerMounted = false;

/**
 * 创建消息容器
 */
const createContainer = (): void => {
  if (containerMounted) return;

  // 创建挂载点
  const containerEl = document.createElement('div');
  containerEl.id = 'chips-message-container';

  // 挂载到 body
  const appendTarget =
    typeof globalConfig.appendTo === 'string'
      ? document.querySelector(globalConfig.appendTo)
      : globalConfig.appendTo;

  if (!appendTarget) {
    console.warn('[ChipsMessage] appendTo target not found');
    return;
  }

  appendTarget.appendChild(containerEl);

  // 创建 Vue 应用
  containerApp = createApp({
    render() {
      return h(MessageContainer, {
        messages,
        top: globalConfig.top,
        appendTo: containerEl,
        onClose: (id: string) => {
          removeMessage(id);
        },
      });
    },
  });

  containerApp.mount(containerEl);
  containerMounted = true;
};

/**
 * 添加消息
 */
const addMessage = (config: MessageConfig): MessageInstance => {
  // 确保容器已创建
  if (typeof document !== 'undefined') {
    createContainer();
  }

  // 生成唯一 ID
  const id = config.id || generateId('message');

  // 创建消息配置
  const messageConfig: MessageConfig = {
    ...config,
    id,
    duration: config.duration ?? globalConfig.duration,
  };

  // 控制最大数量
  while (messages.length >= globalConfig.maxCount) {
    const first = messages[0];
    if (first?.id) {
      removeMessage(first.id);
    }
  }

  // 添加消息
  messages.push(messageConfig);

  // 设置自动关闭
  let timer: ReturnType<typeof setTimeout> | null = null;

  if (messageConfig.duration && messageConfig.duration > 0) {
    timer = setTimeout(() => {
      removeMessage(id);
    }, messageConfig.duration);
  }

  // 返回实例
  return {
    id,
    close: () => {
      if (timer) {
        clearTimeout(timer);
      }
      removeMessage(id);
    },
  };
};

/**
 * 移除消息
 */
const removeMessage = (id: string): void => {
  const index = messages.findIndex((msg) => msg.id === id);
  if (index !== -1) {
    const msg = messages[index];
    msg.onClose?.();
    messages.splice(index, 1);
  }
};

/**
 * 创建特定类型的消息方法
 */
const createMessageMethod =
  (type: MessageType) =>
  (content: string, duration?: number): MessageInstance => {
    return addMessage({
      type,
      content,
      duration,
    });
  };

/**
 * Message API
 */
export const message: MessageApi = {
  info: createMessageMethod('info'),
  success: createMessageMethod('success'),
  warning: createMessageMethod('warning'),
  error: createMessageMethod('error'),
  loading: createMessageMethod('loading'),

  open: (config: MessageConfig): MessageInstance => {
    return addMessage(config);
  },

  destroy: (): void => {
    messages.splice(0, messages.length);

    if (containerApp && containerMounted) {
      containerApp.unmount();
      containerApp = null;
      containerMounted = false;

      // 移除容器 DOM
      const containerEl = document.getElementById('chips-message-container');
      containerEl?.remove();
    }
  },

  config: (options: MessageGlobalConfig): void => {
    Object.assign(globalConfig, options);
  },
};

/**
 * useMessage 组合式函数
 *
 * 用于在组件中获取 Message API
 *
 * @example
 * ```vue
 * <script setup>
 * import { useMessage } from '@chips/components';
 *
 * const message = useMessage();
 *
 * const showSuccess = () => {
 *   message.success('操作成功');
 * };
 * </script>
 * ```
 */
export function useMessage(): MessageApi {
  return message;
}

export default message;
