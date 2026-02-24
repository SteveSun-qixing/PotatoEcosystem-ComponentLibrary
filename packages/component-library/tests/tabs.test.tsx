import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChipsTabs } from '../src/components/Tabs';

describe('Tabs', () => {
  const globalAny = globalThis as any;

  if (!globalAny.CSS) {
    globalAny.CSS = {};
  }

  if (!globalAny.CSS.escape) {
    globalAny.CSS.escape = (value: string) => value;
  }

  if (!globalAny.ResizeObserver) {
    globalAny.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  it('renders tab triggers and tablist role', () => {
    render(
      <ChipsTabs
        defaultValue="one"
        items={[
          { id: 'one', label: 'One', content: <div>Panel One</div> },
          { id: 'two', label: 'Two', content: <div>Panel Two</div> },
        ]}
      />,
    );

    expect(screen.getByRole('tablist')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'One' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Two' })).toBeTruthy();
  });
});
