import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Switch } from '../src/components/Switch';

describe('Switch', () => {
  it('renders checkbox semantics with label', () => {
    render(<Switch>Enable notifications</Switch>);

    expect(screen.getByText('Enable notifications')).toBeTruthy();
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('supports controlled checked state', () => {
    render(<Switch checked>Enabled</Switch>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('checked')).not.toBeNull();
  });
});
