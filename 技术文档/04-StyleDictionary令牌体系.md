# Style Dictionary 令牌体系

## 1. 令牌分层

1. Primitive Token：原子值（色板、间距、字体、阴影参数）。
2. Semantic Token：语义值（surface、text、action、state）。
3. Component Token：组件值（button.bg.default、input.border.focus）。
4. Motion Token：动效值（duration、easing、spring）。

## 2. 命名契约

- 统一前缀：`sys` / `cmp` / `motion` / `density`。
- 禁止直接业务名耦合。
- 所有主题包必须完整实现语义层契约。

## 3. 产物

- Web CSS Variables
- TS 类型定义
- 主题清单 manifest
- 可选平台扩展（后续 iOS/Android）

## 4. 质量校验

- schema 校验：缺项即构建失败。
- token 冲突校验：命名冲突阻断发布。
- 主题差异报告：版本升级前生成 diff。
