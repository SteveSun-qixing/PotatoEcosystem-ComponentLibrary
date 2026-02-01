import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  composeEventHandlers,
  debounce,
  throttle,
  generateId,
  isNullish,
  isFunction,
  isObject,
  isString,
  isNumber,
  isBoolean,
  omit,
  pick,
  deepClone,
  clamp,
  pxToNumber,
} from '../helpers';

describe('composeEventHandlers', () => {
  it('should call both handlers', () => {
    const external = vi.fn();
    const internal = vi.fn();
    const composed = composeEventHandlers(external, internal);
    const event = new Event('click');

    composed(event);

    expect(external).toHaveBeenCalledWith(event);
    expect(internal).toHaveBeenCalledWith(event);
  });

  it('should not call internal if defaultPrevented', () => {
    const external = vi.fn((e: Event) => e.preventDefault());
    const internal = vi.fn();
    const composed = composeEventHandlers(external, internal);
    const event = new Event('click', { cancelable: true });

    composed(event);

    expect(external).toHaveBeenCalledWith(event);
    expect(internal).not.toHaveBeenCalled();
  });

  it('should call internal even if defaultPrevented when checkDefaultPrevented is false', () => {
    const external = vi.fn((e: Event) => e.preventDefault());
    const internal = vi.fn();
    const composed = composeEventHandlers(external, internal, { checkDefaultPrevented: false });
    const event = new Event('click', { cancelable: true });

    composed(event);

    expect(internal).toHaveBeenCalledWith(event);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^chips-\d+-[a-z0-9]+$/);
  });

  it('should use custom prefix', () => {
    const id = generateId('custom');
    expect(id).toMatch(/^custom-\d+-[a-z0-9]+$/);
  });
});

describe('type guards', () => {
  describe('isNullish', () => {
    it('should return true for null and undefined', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction('string')).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for arrays and null', () => {
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-1.5)).toBe(true);
    });

    it('should return false for NaN and non-numbers', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('')).toBe(false);
    });
  });
});

describe('omit', () => {
  it('should remove specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['a', 'c'])).toEqual({ b: 2 });
  });
});

describe('pick', () => {
  it('should keep only specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
});

describe('deepClone', () => {
  it('should clone primitive values', () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone('string')).toBe('string');
    expect(deepClone(null)).toBe(null);
  });

  it('should clone objects', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('should clone arrays', () => {
    const arr = [1, [2, 3]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
  });
});

describe('clamp', () => {
  it('should clamp values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('pxToNumber', () => {
  it('should convert px string to number', () => {
    expect(pxToNumber('10px')).toBe(10);
    expect(pxToNumber('100px')).toBe(100);
  });

  it('should return number as is', () => {
    expect(pxToNumber(10)).toBe(10);
  });

  it('should return 0 for invalid input', () => {
    expect(pxToNumber('invalid')).toBe(0);
  });
});
