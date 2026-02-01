import { describe, it, expect } from 'vitest';
import { classNames, createBEM } from '../classNames';

describe('classNames', () => {
  it('should return empty string for falsy values', () => {
    expect(classNames()).toBe('');
    expect(classNames(null)).toBe('');
    expect(classNames(undefined)).toBe('');
    expect(classNames(false)).toBe('');
    expect(classNames('')).toBe('');
  });

  it('should handle string arguments', () => {
    expect(classNames('foo')).toBe('foo');
    expect(classNames('foo', 'bar')).toBe('foo bar');
    expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should handle number arguments', () => {
    expect(classNames(1)).toBe('1');
    expect(classNames(1, 2, 3)).toBe('1 2 3');
  });

  it('should handle object arguments', () => {
    expect(classNames({ foo: true })).toBe('foo');
    expect(classNames({ foo: true, bar: false })).toBe('foo');
    expect(classNames({ foo: true, bar: true })).toBe('foo bar');
    expect(classNames({ foo: false, bar: false })).toBe('');
  });

  it('should handle array arguments', () => {
    expect(classNames(['foo', 'bar'])).toBe('foo bar');
    expect(classNames(['foo', null, 'bar'])).toBe('foo bar');
  });

  it('should handle mixed arguments', () => {
    expect(classNames('foo', { bar: true, baz: false }, ['qux'])).toBe('foo bar qux');
    expect(classNames('foo', null, { bar: true }, undefined, ['baz'])).toBe('foo bar baz');
  });

  it('should handle nested arrays', () => {
    expect(classNames(['foo', ['bar', 'baz']])).toBe('foo bar baz');
  });
});

describe('createBEM', () => {
  it('should create block class', () => {
    const bem = createBEM('button');
    expect(bem()).toBe('chips-button');
  });

  it('should create element class', () => {
    const bem = createBEM('button');
    expect(bem('icon')).toBe('chips-button__icon');
    expect(bem('content')).toBe('chips-button__content');
  });

  it('should create modifier class', () => {
    const bem = createBEM('button');
    expect(bem('', 'primary')).toBe('chips-button--primary');
    expect(bem('', 'disabled')).toBe('chips-button--disabled');
  });

  it('should create element modifier class', () => {
    const bem = createBEM('button');
    expect(bem('icon', 'large')).toBe('chips-button__icon--large');
  });

  it('should support custom prefix', () => {
    const bem = createBEM('button', 'custom');
    expect(bem()).toBe('custom-button');
    expect(bem('icon')).toBe('custom-button__icon');
    expect(bem('', 'primary')).toBe('custom-button--primary');
  });
});
