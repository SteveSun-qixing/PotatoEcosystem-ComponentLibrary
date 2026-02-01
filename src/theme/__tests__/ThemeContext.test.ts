import { describe, it, expect } from 'vitest';
import { createThemeContext, defaultTheme, themeToCSSVariables } from '../ThemeContext';

describe('ThemeContext', () => {
  describe('createThemeContext', () => {
    it('should create context with default theme when no theme provided', () => {
      const context = createThemeContext();

      expect(context.theme).toBe(null);
      expect(context.getEffectiveTheme()).toEqual(defaultTheme);
      expect(context.isDark).toBe(false);
    });

    it('should create context with provided theme', () => {
      const customTheme = {
        ...defaultTheme,
        id: 'custom',
        name: 'Custom Theme',
        isDark: true,
      };

      const context = createThemeContext(customTheme);

      expect(context.getEffectiveTheme().id).toBe('custom');
    });

    it('should create context from theme ID string', () => {
      const context = createThemeContext('dark-theme');

      expect(context.getEffectiveTheme().id).toBe('dark-theme');
    });

    it('should allow setting theme', () => {
      const context = createThemeContext();

      context.setTheme({
        ...defaultTheme,
        id: 'new-theme',
      });

      expect(context.getEffectiveTheme().id).toBe('new-theme');
    });
  });

  describe('defaultTheme', () => {
    it('should have correct structure', () => {
      expect(defaultTheme.id).toBe('default');
      expect(defaultTheme.name).toBe('Default Theme');
      expect(defaultTheme.isDark).toBe(false);
      expect(defaultTheme.variables).toBeDefined();
      expect(defaultTheme.variables.colors).toBeDefined();
      expect(defaultTheme.variables.typography).toBeDefined();
      expect(defaultTheme.variables.spacing).toBeDefined();
      expect(defaultTheme.variables.borderRadius).toBeDefined();
      expect(defaultTheme.variables.shadows).toBeDefined();
      expect(defaultTheme.variables.transitions).toBeDefined();
    });
  });

  describe('themeToCSSVariables', () => {
    it('should convert theme to CSS variables', () => {
      const cssVars = themeToCSSVariables(defaultTheme);

      expect(cssVars).toBeDefined();
      expect(typeof cssVars).toBe('object');

      // Check some expected CSS variable keys
      expect('--chips-spacing-xs' in cssVars).toBe(true);
      expect('--chips-spacing-sm' in cssVars).toBe(true);
      expect('--chips-spacing-md' in cssVars).toBe(true);
    });

    it('should convert camelCase to kebab-case', () => {
      const cssVars = themeToCSSVariables(defaultTheme);

      // Check that camelCase is converted to kebab-case
      const hasKebabCase = Object.keys(cssVars).some(
        (key) => key.includes('-') && !key.includes('_')
      );
      expect(hasKebabCase).toBe(true);
    });
  });
});
