/**
 * 主题系统类型定义
 */

/**
 * 颜色令牌
 */
export interface ColorTokens {
  /** 主色 */
  primary: string;
  /** 主色浅色 */
  primaryLight: string;
  /** 主色深色 */
  primaryDark: string;
  /** 成功色 */
  success: string;
  /** 警告色 */
  warning: string;
  /** 错误色 */
  error: string;
  /** 信息色 */
  info: string;
  /** 文本颜色 */
  text: string;
  /** 次要文本颜色 */
  textSecondary: string;
  /** 禁用文本颜色 */
  textDisabled: string;
  /** 背景色 */
  background: string;
  /** 表面色（卡片等） */
  surface: string;
  /** 边框色 */
  border: string;
  /** 分割线色 */
  divider: string;
}

/**
 * 字体令牌
 */
export interface TypographyTokens {
  /** 字体家族 */
  fontFamily: string;
  /** 代码字体家族 */
  fontFamilyMono: string;
  /** 基础字号 */
  fontSizeBase: string;
  /** 小字号 */
  fontSizeSm: string;
  /** 大字号 */
  fontSizeLg: string;
  /** 标题字号 */
  fontSizeHeading: string;
  /** 行高 */
  lineHeight: number;
  /** 字重正常 */
  fontWeightNormal: number;
  /** 字重中等 */
  fontWeightMedium: number;
  /** 字重加粗 */
  fontWeightBold: number;
}

/**
 * 间距令牌
 */
export interface SpacingTokens {
  /** 超小间距 */
  xs: string;
  /** 小间距 */
  sm: string;
  /** 中等间距 */
  md: string;
  /** 大间距 */
  lg: string;
  /** 超大间距 */
  xl: string;
  /** 特大间距 */
  xxl: string;
}

/**
 * 圆角令牌
 */
export interface BorderRadiusTokens {
  /** 无圆角 */
  none: string;
  /** 小圆角 */
  sm: string;
  /** 中等圆角 */
  md: string;
  /** 大圆角 */
  lg: string;
  /** 完全圆角 */
  full: string;
}

/**
 * 阴影令牌
 */
export interface ShadowTokens {
  /** 无阴影 */
  none: string;
  /** 小阴影 */
  sm: string;
  /** 中等阴影 */
  md: string;
  /** 大阴影 */
  lg: string;
  /** 特大阴影 */
  xl: string;
}

/**
 * 过渡动画令牌
 */
export interface TransitionTokens {
  /** 快速 */
  fast: string;
  /** 正常 */
  normal: string;
  /** 缓慢 */
  slow: string;
}

/**
 * 主题变量
 */
export interface ThemeVariables {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  transitions: TransitionTokens;
}

/**
 * 组件主题覆盖
 */
export interface ComponentTheme {
  /** CSS 变量覆盖 */
  variables?: Record<string, string>;
  /** 自定义 CSS */
  customCSS?: string;
}

/**
 * 主题定义
 */
export interface Theme {
  /** 主题 ID */
  id: string;
  /** 主题名称 */
  name: string;
  /** 是否为深色主题 */
  isDark?: boolean;
  /** 主题变量 */
  variables: ThemeVariables;
  /** 组件主题覆盖 */
  components?: Record<string, ComponentTheme>;
  /** 自定义 CSS */
  customCSS?: string;
}

/**
 * 主题上下文值
 */
export interface ThemeContextValue {
  /** 当前主题 */
  theme: Theme | null;
  /** 设置主题 */
  setTheme: (theme: Theme | string) => void;
  /** 获取有效主题 */
  getEffectiveTheme: () => Theme;
  /** 是否为深色主题 */
  isDark: boolean;
}
