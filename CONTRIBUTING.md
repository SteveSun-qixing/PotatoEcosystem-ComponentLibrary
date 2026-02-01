# 贡献指南

感谢您对 @chips/components 的关注！本文档将指导您如何为项目做出贡献。

## 开发环境

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 设置开发环境

```bash
# 克隆仓库
git clone https://github.com/chips/components.git
cd components

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 开发规范

### 代码风格

本项目使用 ESLint 和 Prettier 进行代码规范检查和格式化：

```bash
# 检查代码规范
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

### 组件开发规范

1. **功能与样式分离**
   - 组件代码不包含任何 CSS 样式
   - 使用 `chips-` 前缀的类名作为样式接口点

2. **多语言支持**
   - 不硬编码任何文本
   - 使用 `t()` 函数获取翻译文本

3. **TypeScript**
   - 所有代码使用 TypeScript 编写
   - 提供完整的类型定义

4. **测试**
   - 为组件编写单元测试
   - 测试覆盖率 ≥ 80%

### 提交规范

提交信息格式：

```
type(scope): subject

body

footer
```

类型（type）：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：

```
feat(button): add loading state support

- Add loading prop
- Add spinner slot
- Add disabled state when loading

Closes #123
```

## 测试

```bash
# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 构建

```bash
# 构建
pnpm build

# 类型检查
pnpm type-check
```

## 目录结构

```
src/
├── components/          # 组件
│   ├── basic/          # 基础组件
│   ├── layout/         # 布局组件
│   ├── form/           # 表单组件
│   ├── feedback/       # 反馈组件
│   ├── navigation/     # 导航组件
│   ├── data/           # 数据组件
│   ├── card/           # 卡片辅助组件
│   └── providers/      # Provider 组件
├── composables/        # 组合式函数
├── utils/              # 工具函数
├── theme/              # 主题系统
├── kernel/             # 内核通信
├── i18n/               # 多语言
├── types/              # 类型定义
├── constants/          # 常量
└── test/               # 测试工具
```

## 新组件开发

1. 在对应目录创建组件文件夹
2. 创建以下文件：
   - `ComponentName.vue` - 组件实现
   - `types.ts` - 类型定义
   - `index.ts` - 导出
   - `__tests__/ComponentName.test.ts` - 测试

3. 在父级 `index.ts` 中导出组件

## 问题反馈

如果您发现 bug 或有功能建议，请：

1. 搜索现有 Issues，避免重复
2. 创建新 Issue，详细描述问题或建议
3. 如果可能，提供可复现的最小示例

## 许可证

通过提交代码，您同意您的贡献将按照 MIT 许可证授权。
