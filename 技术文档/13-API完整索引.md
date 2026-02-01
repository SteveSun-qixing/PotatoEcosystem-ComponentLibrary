# API完整索引

## API分类概览

| 分类 | 说明 |
|------|------|
| 主题API | 主题加载、切换、定制 |
| 组件API | 组件实例方法和静态方法 |
| Hooks API | React Hooks |
| 工具函数API | 通用工具函数 |
| Context API | React Context |
| 内核通信API | 与薯片内核交互 |
| 多语言API | 国际化相关 |
| 插件API | 插件系统 |

---

## 一、主题API

### 1. ThemeLoader 主题加载器

**类**: `ThemeLoader`

#### load()
加载主题包

```typescript
async load(themeId: string): Promise<Theme>
```

**参数**:
- `themeId`: 主题ID

**返回**: Promise<Theme>

**示例**:
```typescript
import { themeLoader } from '@chips-ui/core';

const theme = await themeLoader.load('dark');
```

---

#### unload()
卸载主题包

```typescript
unload(themeId: string): void
```

**参数**:
- `themeId`: 主题ID

**示例**:
```typescript
themeLoader.unload('dark');
```

---

#### preload()
预加载主题

```typescript
async preload(themeId: string): Promise<void>
```

**参数**:
- `themeId`: 主题ID

**示例**:
```typescript
await themeLoader.preload('dark');
```

---

#### getLoadedTheme()
获取已加载的主题

```typescript
getLoadedTheme(themeId: string): Theme | null
```

**参数**:
- `themeId`: 主题ID

**返回**: Theme对象或null

---

### 2. Theme 主题对象

**接口**: `Theme`

```typescript
interface Theme {
  id: string;
  name: string;
  variables: Record<string, string>;
  cssUrl?: string;
}
```

---

### 3. 主题操作函数

#### setTheme()
设置主题

```typescript
function setTheme(themeId: string): Promise<void>
```

**参数**:
- `themeId`: 主题ID

**示例**:
```typescript
import { setTheme } from '@chips-ui/core';

await setTheme('dark');
```

---

#### getTheme()
获取当前主题

```typescript
function getTheme(): string
```

**返回**: 当前主题ID

**示例**:
```typescript
import { getTheme } from '@chips-ui/core';

const currentTheme = getTheme();
```

---

#### switchTheme()
切换主题（带动画）

```typescript
function switchTheme(
  element: HTMLElement,
  newThemeId: string,
  options?: SwitchOptions
): Promise<void>

interface SwitchOptions {
  animate?: boolean;
  duration?: number;
  onStart?: () => void;
  onComplete?: () => void;
}
```

**参数**:
- `element`: 目标元素
- `newThemeId`: 新主题ID
- `options`: 切换选项

**示例**:
```typescript
import { switchTheme } from '@chips-ui/core';

await switchTheme(document.body, 'dark', {
  animate: true,
  duration: 300,
  onComplete: () => console.log('主题切换完成')
});
```

---

#### applyTheme()
应用主题到元素

```typescript
function applyTheme(element: HTMLElement, themeId: string): void
```

**参数**:
- `element`: 目标元素
- `themeId`: 主题ID

---

#### getEffectiveTheme()
获取元素的有效主题

```typescript
function getEffectiveTheme(element: HTMLElement): string
```

**参数**:
- `element`: 目标元素

**返回**: 有效主题ID

---

### 4. CSS变量操作

#### injectCSSVariables()
注入CSS变量

```typescript
function injectCSSVariables(
  element: HTMLElement,
  variables: Record<string, string>
): void
```

**参数**:
- `element`: 目标元素
- `variables`: CSS变量对象

**示例**:
```typescript
import { injectCSSVariables } from '@chips-ui/core';

injectCSSVariables(document.body, {
  '--chips-color-primary': '#ff6b9d',
  '--chips-font-size-base': '14px'
});
```

---

#### getCSSVariable()
获取CSS变量值

```typescript
function getCSSVariable(
  element: HTMLElement,
  variableName: string
): string
```

**参数**:
- `element`: 目标元素
- `variableName`: 变量名

**返回**: 变量值

---

#### updateCSSVariables()
批量更新CSS变量

```typescript
function updateCSSVariables(
  element: HTMLElement,
  updates: Record<string, string>
): void
```

**参数**:
- `element`: 目标元素
- `updates`: 更新的变量对象

---

### 5. 主题验证

#### validateTheme()
验证主题完整性

```typescript
function validateTheme(theme: Theme): ValidationResult

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

**参数**:
- `theme`: 主题对象

**返回**: 验证结果

**示例**:
```typescript
import { validateTheme } from '@chips-ui/core';

const result = validateTheme(myTheme);
if (!result.valid) {
  console.error('主题验证失败:', result.errors);
}
```

---

#### checkThemeCompatibility()
检查主题兼容性

```typescript
function checkThemeCompatibility(
  theme: Theme,
  libraryVersion: string
): CompatibilityResult

interface CompatibilityResult {
  compatible: boolean;
  reason: string;
}
```

**参数**:
- `theme`: 主题对象
- `libraryVersion`: 组件库版本

**返回**: 兼容性结果

---

## 二、组件API

### 1. Form 表单

#### FormInstance 实例方法

**getFieldValue()**
获取字段值

```typescript
getFieldValue(name: string): any
```

**示例**:
```typescript
const value = form.getFieldValue('username');
```

---

**getFieldsValue()**
获取多个字段值

```typescript
getFieldsValue(names?: string[]): Record<string, any>
```

**示例**:
```typescript
const values = form.getFieldsValue(['username', 'email']);
```

---

**setFieldValue()**
设置字段值

```typescript
setFieldValue(name: string, value: any): void
```

**示例**:
```typescript
form.setFieldValue('username', 'newValue');
```

---

**setFieldsValue()**
设置多个字段值

```typescript
setFieldsValue(values: Record<string, any>): void
```

**示例**:
```typescript
form.setFieldsValue({
  username: 'test',
  email: 'test@example.com'
});
```

---

**validateFields()**
验证字段

```typescript
validateFields(names?: string[]): Promise<Record<string, any>>
```

**示例**:
```typescript
try {
  const values = await form.validateFields();
  console.log('验证通过:', values);
} catch (errorInfo) {
  console.log('验证失败:', errorInfo);
}
```

---

**resetFields()**
重置字段

```typescript
resetFields(names?: string[]): void
```

**示例**:
```typescript
form.resetFields(); // 重置所有字段
form.resetFields(['username']); // 重置特定字段
```

---

**submit()**
提交表单

```typescript
submit(): void
```

**示例**:
```typescript
form.submit();
```

---

### 2. Modal 对话框

#### Modal 静态方法

**Modal.confirm()**
显示确认对话框

```typescript
Modal.confirm(config: ModalConfig): ModalInstance

interface ModalConfig {
  title?: ReactNode;
  content?: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}
```

**示例**:
```typescript
Modal.confirm({
  title: '确认删除',
  content: '确定要删除这条记录吗？',
  onOk: async () => {
    await deleteRecord();
  }
});
```

---

**Modal.info()**
显示信息对话框

```typescript
Modal.info(config: ModalConfig): ModalInstance
```

---

**Modal.success()**
显示成功对话框

```typescript
Modal.success(config: ModalConfig): ModalInstance
```

---

**Modal.warning()**
显示警告对话框

```typescript
Modal.warning(config: ModalConfig): ModalInstance
```

---

**Modal.error()**
显示错误对话框

```typescript
Modal.error(config: ModalConfig): ModalInstance
```

---

### 3. Message 消息提示

#### Message API

**message.info()**
显示信息提示

```typescript
message.info(content: ReactNode, duration?: number): MessageInstance
```

**示例**:
```typescript
import { message } from '@chips-ui/react';

message.info('这是一条信息提示');
```

---

**message.success()**
显示成功提示

```typescript
message.success(content: ReactNode, duration?: number): MessageInstance
```

---

**message.warning()**
显示警告提示

```typescript
message.warning(content: ReactNode, duration?: number): MessageInstance
```

---

**message.error()**
显示错误提示

```typescript
message.error(content: ReactNode, duration?: number): MessageInstance
```

---

**message.loading()**
显示加载提示

```typescript
message.loading(content: ReactNode, duration?: number): MessageInstance
```

**示例**:
```typescript
const hide = message.loading('加载中...', 0);
// 执行异步操作
await fetchData();
hide(); // 关闭加载提示
```

---

### 4. Notification 通知

#### Notification API

**notification.open()**
打开通知

```typescript
notification.open(config: NotificationConfig): NotificationInstance

interface NotificationConfig {
  message: ReactNode;
  description?: ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  icon?: ReactNode;
  btn?: ReactNode;
  onClose?: () => void;
  key?: string;
}
```

**示例**:
```typescript
import { notification } from '@chips-ui/react';

notification.open({
  message: '通知标题',
  description: '这是通知的详细内容',
  type: 'success',
  duration: 4.5
});
```

---

**notification.success()**

```typescript
notification.success(config: NotificationConfig): NotificationInstance
```

---

**notification.error()**

```typescript
notification.error(config: NotificationConfig): NotificationInstance
```

---

**notification.close()**
关闭通知

```typescript
notification.close(key: string): void
```

---

**notification.destroy()**
销毁所有通知

```typescript
notification.destroy(): void
```

---

## 三、Hooks API

### 1. useTheme()
使用主题

```typescript
function useTheme(): {
  theme: string;
  setTheme: (themeId: string) => Promise<void>;
}
```

**示例**:
```typescript
import { useTheme } from '@chips-ui/react';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      当前主题: {theme}
    </button>
  );
}
```

---

### 2. useKernel()
使用内核通信

```typescript
function useKernel(): {
  call: (method: string, params: any) => Promise<any>;
  subscribe: (eventType: string, handler: Function) => () => void;
}
```

**示例**:
```typescript
import { useKernel } from '@chips-ui/react';

function MyComponent() {
  const { call, subscribe } = useKernel();
  
  useEffect(() => {
    const unsubscribe = subscribe('card.updated', (data) => {
      console.log('卡片更新:', data);
    });
    
    return unsubscribe;
  }, []);
  
  const handleSave = async () => {
    await call('card.save', { id: '123', data: {...} });
  };
  
  return <button onClick={handleSave}>保存</button>;
}
```

---

### 3. useForm()
使用表单

```typescript
function useForm(config?: FormConfig): FormInstance

interface FormConfig {
  initialValues?: Record<string, any>;
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errorInfo: any) => void;
}
```

**示例**:
```typescript
import { useForm } from '@chips-ui/react';

function MyForm() {
  const [form] = useForm({
    initialValues: { username: '' },
    onFinish: (values) => {
      console.log('提交:', values);
    }
  });
  
  return <Form form={form}>...</Form>;
}
```

---

### 4. useControllableState()
使用可控状态

```typescript
function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void]
```

**示例**:
```typescript
import { useControllableState } from '@chips-ui/react';

function MyComponent({ value, defaultValue, onChange }) {
  const [state, setState] = useControllableState(
    value,
    defaultValue,
    onChange
  );
  
  return <input value={state} onChange={(e) => setState(e.target.value)} />;
}
```

---

### 5. useDebounce()
防抖Hook

```typescript
function useDebounce<T>(value: T, delay: number): T
```

**示例**:
```typescript
import { useDebounce } from '@chips-ui/react';

function SearchInput() {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  
  useEffect(() => {
    if (debouncedSearchText) {
      performSearch(debouncedSearchText);
    }
  }, [debouncedSearchText]);
  
  return <input value={searchText} onChange={(e) => setSearchText(e.target.value)} />;
}
```

---

### 6. useThrottle()
节流Hook

```typescript
function useThrottle<T>(value: T, delay: number): T
```

---

### 7. useMediaQuery()
媒体查询Hook

```typescript
function useMediaQuery(query: string): boolean
```

**示例**:
```typescript
import { useMediaQuery } from '@chips-ui/react';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return <div>{isMobile ? '移动端' : '桌面端'}</div>;
}
```

---

### 8. useLocalStorage()
本地存储Hook

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void]
```

**示例**:
```typescript
import { useLocalStorage } from '@chips-ui/react';

function MyComponent() {
  const [name, setName] = useLocalStorage('name', '');
  
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

---

### 9. usePrevious()
获取上一个值

```typescript
function usePrevious<T>(value: T): T | undefined
```

---

### 10. useClickOutside()
点击外部Hook

```typescript
function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void
): void
```

**示例**:
```typescript
import { useClickOutside } from '@chips-ui/react';

function Dropdown() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  
  useClickOutside(ref, () => setOpen(false));
  
  return (
    <div ref={ref}>
      {open && <div>下拉内容</div>}
    </div>
  );
}
```

---

## 四、工具函数API

### 1. classNames()
合并类名

```typescript
function classNames(...args: ClassValue[]): string

type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];
```

**示例**:
```typescript
import { classNames } from '@chips-ui/core';

const className = classNames(
  'button',
  { 'button-primary': isPrimary },
  ['button-large'],
  isDisabled && 'button-disabled'
);
```

---

### 2. mergeRefs()
合并ref

```typescript
function mergeRefs<T>(...refs: Array<Ref<T>>): RefCallback<T>
```

**示例**:
```typescript
import { mergeRefs } from '@chips-ui/core';

function MyComponent() {
  const internalRef = useRef(null);
  const externalRef = useRef(null);
  
  return <div ref={mergeRefs(internalRef, externalRef)} />;
}
```

---

### 3. composeEventHandlers()
组合事件处理器

```typescript
function composeEventHandlers<E>(
  externalHandler?: (event: E) => void,
  internalHandler?: (event: E) => void
): (event: E) => void
```

**示例**:
```typescript
import { composeEventHandlers } from '@chips-ui/core';

const handleClick = composeEventHandlers(
  props.onClick,
  () => console.log('内部处理')
);
```

---

### 4. debounce()
防抖函数

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T
```

**示例**:
```typescript
import { debounce } from '@chips-ui/core';

const debouncedSearch = debounce((text: string) => {
  performSearch(text);
}, 500);
```

---

### 5. throttle()
节流函数

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T
```

---

### 6. deepClone()
深拷贝

```typescript
function deepClone<T>(obj: T): T
```

---

### 7. omit()
排除对象属性

```typescript
function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K>
```

**示例**:
```typescript
import { omit } from '@chips-ui/core';

const obj = { a: 1, b: 2, c: 3 };
const result = omit(obj, ['b']); // { a: 1, c: 3 }
```

---

### 8. pick()
选择对象属性

```typescript
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K>
```

---

## 五、Context API

### 1. ThemeContext 主题上下文

```typescript
interface ThemeContextValue {
  theme: string;
  setTheme: (themeId: string) => Promise<void>;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
```

**使用**:
```typescript
import { ThemeContext } from '@chips-ui/react';

function MyComponent() {
  const themeContext = useContext(ThemeContext);
  return <div>当前主题: {themeContext?.theme}</div>;
}
```

---

### 2. ChipsContext 系统上下文

```typescript
interface ChipsContextValue {
  config: ChipsConfig;
  updateConfig: (config: Partial<ChipsConfig>) => void;
}

const ChipsContext = React.createContext<ChipsContextValue | null>(null);
```

---

### 3. FormContext 表单上下文

```typescript
interface FormContextValue {
  form: FormInstance;
  disabled?: boolean;
}

const FormContext = React.createContext<FormContextValue | null>(null);
```

---

## 六、内核通信API

### 1. SDKIntegration SDK集成

#### initialize()
初始化SDK连接

```typescript
async initialize(config: SDKConfig): Promise<void>

interface SDKConfig {
  apiUrl?: string;
  timeout?: number;
  retry?: number;
}
```

**示例**:
```typescript
import { sdkIntegration } from '@chips-ui/core';

await sdkIntegration.initialize({
  apiUrl: 'http://localhost:3000/api',
  timeout: 5000
});
```

---

#### call()
调用内核API

```typescript
async call(method: string, params: any): Promise<any>
```

**示例**:
```typescript
const result = await sdkIntegration.call('card.get', { id: '123' });
```

---

#### subscribe()
订阅事件

```typescript
subscribe(eventType: string, handler: Function): void
```

**示例**:
```typescript
sdkIntegration.subscribe('card.updated', (data) => {
  console.log('卡片更新:', data);
});
```

---

#### unsubscribe()
取消订阅

```typescript
unsubscribe(eventType: string, handler: Function): void
```

---

### 2. RequestManager 请求管理

#### send()
发送请求

```typescript
async send(request: Request): Promise<Response>
```

---

#### batch()
批量请求

```typescript
async batch(requests: Request[]): Promise<Response[]>
```

---

#### cancel()
取消请求

```typescript
cancel(requestId: string): void
```

---

## 七、多语言API

### 1. useTranslation()
使用翻译

```typescript
function useTranslation(): {
  t: (code: string, vars?: Record<string, any>) => string;
  locale: string;
  setLocale: (locale: string) => void;
}
```

**示例**:
```typescript
import { useTranslation } from '@chips-ui/react';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <button>{t('common.ok')}</button>
      <p>{t('ui.file_count', { count: 10 })}</p>
    </div>
  );
}
```

---

### 2. formatDate()
格式化日期

```typescript
function formatDate(date: Date, format: 'short' | 'medium' | 'long' | 'full'): string
```

---

### 3. formatNumber()
格式化数字

```typescript
function formatNumber(num: number, options?: NumberFormatOptions): string
```

---

## 八、插件API

### 1. registerPlugin()
注册插件

```typescript
function registerPlugin(plugin: Plugin): void

interface Plugin {
  name: string;
  version: string;
  install(app: ChipsApp): void;
  uninstall?(app: ChipsApp): void;
}
```

**示例**:
```typescript
import { registerPlugin } from '@chips-ui/core';

const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(app) {
    // 安装插件
  }
};

registerPlugin(myPlugin);
```

---

### 2. registerComponent()
注册组件

```typescript
function registerComponent(name: string, component: ComponentType<any>): void
```

**示例**:
```typescript
import { registerComponent } from '@chips-ui/core';
import { MyCustomComponent } from './MyCustomComponent';

registerComponent('MyCustomComponent', MyCustomComponent);
```

---

### 3. registerCard()
注册卡片类型

```typescript
function registerCard(type: string, component: ComponentType<any>): void
```

**示例**:
```typescript
import { registerCard } from '@chips-ui/core';
import { MyCustomCard } from './MyCustomCard';

registerCard('custom', MyCustomCard);
```

---

## 总结

Chips前端组件库提供了完整的API体系，包括主题管理、组件操作、Hooks、工具函数、Context、内核通信、多语言和插件系统。所有API都提供了清晰的TypeScript类型定义，确保了类型安全和开发体验。通过这些API，开发者可以轻松构建功能强大的薯片应用。
