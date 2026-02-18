import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../src/components/Tabs';

describe('Tabs', () => {
  it('renders tab triggers and tablist role', () => {
    render(
      <Tabs
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
