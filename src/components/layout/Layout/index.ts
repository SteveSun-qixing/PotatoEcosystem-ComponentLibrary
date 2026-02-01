/**
 * Layout 布局组件导出
 *
 * 提供经典的页面布局结构：
 * - Layout: 布局容器，可嵌套
 * - Header: 顶部布局
 * - Sider: 侧边栏，可折叠
 * - Content: 内容部分
 * - Footer: 底部布局
 *
 * @example
 * ```vue
 * <template>
 *   <Layout>
 *     <Header>Header</Header>
 *     <Layout>
 *       <Sider v-model:collapsed="collapsed" collapsible>
 *         Sider
 *       </Sider>
 *       <Layout>
 *         <Content>Content</Content>
 *         <Footer>Footer</Footer>
 *       </Layout>
 *     </Layout>
 *   </Layout>
 * </template>
 * ```
 */

// 组件导出
export { default as Layout } from './Layout.vue';
export { default as LayoutHeader } from './Header.vue';
export { default as LayoutSider } from './Sider.vue';
export { default as LayoutContent } from './Content.vue';
export { default as LayoutFooter } from './Footer.vue';

// 别名导出（简洁命名）
export { default as Header } from './Header.vue';
export { default as Sider } from './Sider.vue';
export { default as Content } from './Content.vue';
export { default as Footer } from './Footer.vue';

// 类型导出
export * from './types';
