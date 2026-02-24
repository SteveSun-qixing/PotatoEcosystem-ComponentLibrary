import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, ThemeScope } from '../src/theme/ThemeProvider';
import { useThemeToken } from '../src/theme/useThemeTokens';

function Probe() {
  const token = useThemeToken('chips-comp-button-bg');
  return <div data-testid="token">{token ?? 'none'}</div>;
}

describe('ThemeProvider', () => {
  it('resolves nested scope tokens first', () => {
    render(
      <ThemeProvider defaults={{ 'chips-comp-button-bg': '#111111' }} tokens={{ 'chips-comp-button-bg': '#222222' }}>
        <ThemeScope tokens={{ 'chips-comp-button-bg': '#333333' }}>
          <Probe />
        </ThemeScope>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('token').textContent).toBe('#333333');
  });

  it('falls back to defaults when no scope token exists', () => {
    render(
      <ThemeProvider defaults={{ 'chips-comp-button-bg': '#111111' }}>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('token').textContent).toBe('#111111');
  });
});
