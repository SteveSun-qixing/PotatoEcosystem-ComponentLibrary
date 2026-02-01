/**
 * 数据展示组件导出
 *
 * 阶段5已实现组件:
 * - Text
 * - Image
 * - Icon
 * - Tag
 *
 * 阶段6已实现:
 * - Badge
 * - Avatar
 * - Empty
 *
 * 阶段6待实现:
 * - Divider
 * - Progress
 * - Table
 * - List
 * - Collapse
 *
 * 阶段7将实现:
 * - Tree
 */

// Text 文本组件
export { Text } from './Text';
export type {
  TextProps,
  TextEmits,
  TextSlots,
  TextInstance,
  TextType,
  EllipsisConfig,
  CopyableConfig,
} from './Text';

// Image 图片组件
export { Image } from './Image';
export type {
  ImageProps,
  ImageEmits,
  ImageSlots,
  ImageInstance,
  ImageFit,
  ImageStatus,
} from './Image';

// Icon 图标组件
export { Icon } from './Icon';
export type { IconProps, IconEmits, IconSlots, IconInstance } from './Icon';

// Tag 标签组件
export { Tag } from './Tag';
export type {
  TagProps,
  TagEmits,
  TagSlots,
  TagInstance,
  TagPresetColor,
  TagSize,
} from './Tag';

// Badge 徽标组件
export { Badge } from './Badge';
export type {
  BadgeProps,
  BadgeEmits,
  BadgeSlots,
  BadgeInstance,
  BadgeStatus,
} from './Badge';

// Avatar 头像组件
export { Avatar } from './Avatar';
export type {
  AvatarProps,
  AvatarEmits,
  AvatarSlots,
  AvatarInstance,
  AvatarSize,
  AvatarShape,
} from './Avatar';

// Empty 空状态组件
export { Empty } from './Empty';
export type {
  EmptyProps,
  EmptyEmits,
  EmptySlots,
  EmptyInstance,
} from './Empty';
