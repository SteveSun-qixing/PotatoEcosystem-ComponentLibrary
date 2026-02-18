# Chips 组件库（Greenfield）

薯片组件库的绿地重建仓库，当前技术方案为 Ark UI + Style Dictionary。

## 目录结构

- `packages/tokens`: 设计令牌与主题包构建流水线
- `packages/component-library`: Headless React 组件层
- `需求文档` / `技术文档` / `开发计划`: 全量手册与阶段记录

## 常用命令

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm test:contracts
pnpm smoke:ecosystem
pnpm verify
```

## 当前进度

- 阶段01：工程基线完成（workspace + build/test/typecheck）
- 阶段02：Token 契约与主题流水线完成（default/glass/material3/fluent）
- 阶段03：P0 组件骨架完成（Button/Input/Checkbox/Switch/RadioGroup/Select/Dialog/Tabs/Menu/Form）
- 阶段04：主题分层回退完成（ThemeScope + hooks + 测试）
- 阶段05：Core/SDK 适配层与日志基座完成（合同测试通过）
- 阶段06：门禁与生态 smoke 基线完成（verify + smoke 脚本）
