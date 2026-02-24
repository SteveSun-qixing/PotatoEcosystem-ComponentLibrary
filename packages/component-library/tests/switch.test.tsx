import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChipsSwitch } from '../src/components/Switch';

describe('Switch', () => {
  it('renders checkbox semantics with label', () => {
    render(<ChipsSwitch>Enable notifications</ChipsSwitch>);

    expect(screen.getByText('Enable notifications')).toBeTruthy();
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('supports controlled checked state', () => {
    render(<ChipsSwitch checked>Enabled</ChipsSwitch>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('checked')).not.toBeNull();
  });
});
