# Ark UI 封装分层设计

## 1. 封装目标

将 Ark UI 的 primitives 转换为符合薯片生态协议的“稳定部件”，统一输出结构、状态和事件语义。

## 0. 阶段18-阶段02补充

- 对外依赖已切换为 `@chips/ui-primitives-react`。
- 业务层禁止直接导入 `@ark-ui/react/*`。
- 组件对外导出统一 `Chips` 前缀（如 `ChipsButton`）。

## 2. 分层

- Layer A：Ark 原语直连封装（仅适配 props 和 events）。
- Layer B：薯片语义组件（增加尺寸、密度、状态策略）。
- Layer C：场景装配（卡片编辑、查看、表单模板）。

## 3. 统一接口

- props 命名统一、事件签名统一、暴露 ref 能力统一。
- 强制注入 `data-scope` 和 `data-part`，作为主题匹配锚点。
- 每个组件提供 `variants` 接口，但具体视觉由 token 决定。

## 4. 可访问性

- 继承 Ark UI 的键盘与焦点管理。
- 统一 a11y 测试清单，逐组件验收。
