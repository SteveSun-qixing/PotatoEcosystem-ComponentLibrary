# 与 Core / Foundation / SDK 集成

## 1. Core 对接

- 组件库不直接访问业务数据源。
- 业务调用通过 SDK，再由 SDK 对接 Core 路由。
- 组件库仅消费标准化响应模型。

## 2. Foundation 对接

- 复用 Foundation 的 i18n、日志、配置、窗口能力。
- 组件库定义适配层，屏蔽底层实现差异。

## 3. SDK 对接

- 与 `ThemeManager` 对齐主题注册与查询。
- 与 `RendererEngine` 对齐卡片/布局渲染协议。
- 与 `EventBus` 对齐事件命名和负载结构。

## 4. 联调策略

- 先 mock 合同测试，再进入真实模块联调。
- 联调失败优先修复协议偏差，不做临时绕过。
