import { describe, it, expect, vi } from 'vitest';
import { useControllableState } from '../useControllableState';

describe('useControllableState', () => {
  describe('uncontrolled mode', () => {
    it('should use defaultValue when value is undefined', () => {
      const [state] = useControllableState({
        value: undefined,
        defaultValue: 'default',
      });

      expect(state.value).toBe('default');
    });

    it('should update internal state when setValue is called', () => {
      const [state, setValue] = useControllableState({
        value: undefined,
        defaultValue: 'initial',
      });

      expect(state.value).toBe('initial');

      setValue('updated');
      expect(state.value).toBe('updated');
    });

    it('should call onChange when setValue is called', () => {
      const onChange = vi.fn();
      const [_, setValue] = useControllableState({
        value: undefined,
        defaultValue: 'initial',
        onChange,
      });

      setValue('updated');
      expect(onChange).toHaveBeenCalledWith('updated');
    });

    it('should return isControlled as false', () => {
      const [_, __, isControlled] = useControllableState({
        value: undefined,
        defaultValue: 'initial',
      });

      expect(isControlled).toBe(false);
    });
  });

  describe('controlled mode', () => {
    it('should use controlled value when provided', () => {
      const [state] = useControllableState({
        value: 'controlled',
        defaultValue: 'default',
      });

      expect(state.value).toBe('controlled');
    });

    it('should not update internal state in controlled mode', () => {
      const [state, setValue] = useControllableState({
        value: 'controlled',
        defaultValue: 'default',
      });

      setValue('new-value');
      // In controlled mode, the value should still be the controlled value
      expect(state.value).toBe('controlled');
    });

    it('should call onChange in controlled mode', () => {
      const onChange = vi.fn();
      const [_, setValue] = useControllableState({
        value: 'controlled',
        defaultValue: 'default',
        onChange,
      });

      setValue('new-value');
      expect(onChange).toHaveBeenCalledWith('new-value');
    });

    it('should return isControlled as true', () => {
      const [_, __, isControlled] = useControllableState({
        value: 'controlled',
        defaultValue: 'default',
      });

      expect(isControlled).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle null as controlled value', () => {
      const [state, _, isControlled] = useControllableState<string | null>({
        value: null,
        defaultValue: 'default',
      });

      // null is a valid controlled value
      expect(state.value).toBe(null);
      expect(isControlled).toBe(true);
    });

    it('should handle 0 as controlled value', () => {
      const [state, _, isControlled] = useControllableState({
        value: 0,
        defaultValue: 100,
      });

      expect(state.value).toBe(0);
      expect(isControlled).toBe(true);
    });

    it('should handle empty string as controlled value', () => {
      const [state, _, isControlled] = useControllableState({
        value: '',
        defaultValue: 'default',
      });

      expect(state.value).toBe('');
      expect(isControlled).toBe(true);
    });

    it('should handle false as controlled value', () => {
      const [state, _, isControlled] = useControllableState({
        value: false,
        defaultValue: true,
      });

      expect(state.value).toBe(false);
      expect(isControlled).toBe(true);
    });
  });
});
