# ChipsFileUpload 组件规范

- 文档版本：1.0.0
- 适用范围：`@chips/component-library` 上传组件

## 1. 设计目标

`ChipsFileUpload` 用于设置面板的插件/主题安装入口，提供以下能力：

1. 支持拖拽和点击选择文件。
2. 支持受控和非受控两种使用方式。
3. 提供稳定 class/data 锚点，不内置视觉样式。
4. 提供标准错误码回调，便于 GUI 展示错误详情。

## 2. Props

```ts
export interface ChipsFileUploadError {
  code:
    | 'FILE_EXTENSION_NOT_ALLOWED'
    | 'FILE_MISSING'
    | 'FILE_DISABLED'
    | 'FILE_READ_FAILED';
  message: string;
  details?: Record<string, unknown>;
}

export interface ChipsFileUploadProps {
  value?: File | null;
  defaultValue?: File | null;
  disabled?: boolean;
  acceptExtensions?: string[];
  multiple?: boolean;
  chipsScope?: string;
  onChange?: (file: File | null) => void;
  onError?: (error: ChipsFileUploadError) => void;
  onDragStateChange?: (dragging: boolean) => void;
}
```

## 3. 结构契约

### 3.1 class

1. `chips-file-upload`
2. `chips-file-upload__dropzone`
3. `chips-file-upload__input`
4. `chips-file-upload__meta`
5. `chips-file-upload--disabled`
6. `chips-file-upload--dragging`
7. `chips-file-upload--invalid`
8. `chips-file-upload--has-file`

### 3.2 data 属性

1. `data-scope="file-upload"`（可由 `chipsScope` 覆盖）
2. `data-part="root|dropzone|input|meta"`
3. `data-state="idle|dragging|disabled|invalid|selected"`

## 4. 行为约束

1. 点击 dropzone 会触发 `<input type="file">`。
2. 键盘 Enter/Space 可触发文件选择。
3. 拖拽进入时进入 dragging 状态，离开恢复 idle。
4. 扩展名不满足 `acceptExtensions` 时触发 `FILE_EXTENSION_NOT_ALLOWED`。
5. `disabled=true` 时禁止点击和拖拽接收。
6. 错误信息区通过 `aria-live="polite"` 输出，便于辅助技术读取。

## 5. 测试门禁

组件合同测试覆盖以下场景：

1. 点击触发 input。
2. 拖拽状态切换。
3. 扩展名过滤和错误回调。
4. 禁用态不可交互。
5. 受控与非受控模式行为一致。
