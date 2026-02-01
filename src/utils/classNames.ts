/**
 * 动态类名组合工具函数
 */

/**
 * 类名值类型
 */
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | { [key: string]: boolean | undefined | null };

/**
 * 将单个值转换为类名字符串
 */
function toClassName(value: ClassValue): string {
  if (!value) return '';

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(' ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(' ');
  }

  return '';
}

/**
 * 组合多个类名
 *
 * @example
 * classNames('foo', 'bar')
 * // => 'foo bar'
 *
 * classNames('foo', { bar: true, baz: false })
 * // => 'foo bar'
 *
 * classNames(['foo', 'bar'], { baz: true })
 * // => 'foo bar baz'
 *
 * classNames('foo', null, undefined, 'bar')
 * // => 'foo bar'
 */
export function classNames(...args: ClassValue[]): string {
  return args.map(toClassName).filter(Boolean).join(' ');
}

/**
 * 创建带前缀的类名生成器
 *
 * @example
 * const bem = createBEM('button')
 * bem() // => 'chips-button'
 * bem('icon') // => 'chips-button__icon'
 * bem('', 'primary') // => 'chips-button--primary'
 * bem('icon', 'large') // => 'chips-button__icon--large'
 */
export function createBEM(block: string, prefix = 'chips') {
  const blockClass = `${prefix}-${block}`;

  return function bem(element?: string, modifier?: string): string {
    let result = blockClass;

    if (element) {
      result += `__${element}`;
    }

    if (modifier) {
      result += `--${modifier}`;
    }

    return result;
  };
}

export default classNames;
