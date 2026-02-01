# @chips/components

薯片生态官方 UI 组件库 - 无样式组件，支持主题系统

## 特点

- **Vue 3 + TypeScript**: 使用 Composition API 和完整的类型支持
- **无样式组件**: 组件不包含任何 CSS 样式代码，完全由主题包控制视觉效果
- **主题系统**: 通过 CSS 变量实现灵活的主题定制
- **多语言支持**: 内置多语言系统集成
- **微内核架构**: 与薯片生态微内核无缝集成

## 安装

```bash
# npm
npm install @chips/components

# pnpm
pnpm add @chips/components

# yarn
yarn add @chips/components
```

## 使用

```vue
<script setup lang="ts">
import { ChipsProvider, Button, Input } from '@chips/components';
</script>

<template>
  <ChipsProvider>
    <Button type="primary">按钮</Button>
    <Input placeholder="请输入" />
  </ChipsProvider>
</template>
```

## 组件列表

### 基础组件

- Button - 按钮
- Input - 输入框
- Textarea - 多行文本框
- Select - 选择器
- Checkbox / CheckboxGroup - 复选框
- Radio / RadioGroup - 单选框
- Switch - 开关

### 布局组件

- Grid (Row / Col) - 栅格
- Flex - 弹性布局
- Container - 容器
- Layout - 页面布局
- Space - 间距
- Card - 卡片

### 表单组件

- Form - 表单
- FormItem - 表单项
- FormList - 动态表单列表

### 反馈组件

- Modal - 对话框
- Message - 消息提示
- Notification - 通知
- Loading - 加载中
- Tooltip - 文字提示
- Popover - 气泡卡片
- Drawer - 抽屉

### 导航组件

- Menu - 菜单
- Tabs - 标签页
- Breadcrumb - 面包屑
- Pagination - 分页
- Dropdown - 下拉菜单

### 数据展示组件

- Text - 文本
- Image - 图片
- Icon - 图标
- Tag - 标签
- Badge - 徽标
- Avatar - 头像
- Divider - 分割线
- Progress - 进度条
- Table - 表格
- List - 列表
- Tree - 树形控件
- Collapse - 折叠面板

### 特殊组件

- ThemeProvider - 主题提供者
- ChipsProvider - 生态提供者
- ErrorBoundary - 错误边界
- CardWrapper - 卡片包装器
- BoxLayoutView - 箱子布局视图

## 主题定制

组件库采用无样式设计，所有视觉效果由主题包提供。每个组件暴露标准化的 CSS 类名作为样式接口点：

```css
/* 主题包示例 */
.chips-button {
  /* 按钮样式 */
}

.chips-button--primary {
  /* 主按钮样式 */
}

.chips-button--disabled {
  /* 禁用按钮样式 */
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

## 文档

详细文档请参阅 [组件库技术文档](./技术文档)

## 许可证

MIT License
