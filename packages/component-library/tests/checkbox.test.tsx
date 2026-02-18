import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../src/components/Checkbox';

describe('Checkbox', () => {
  it('renders label content', () => {
    render(<Checkbox>Agree</Checkbox>);

    expect(screen.getByText('Agree')).toBeTruthy();
  });

  it('supports controlled checked state', () => {
    render(<Checkbox checked>Accept</Checkbox>);

    const input = screen.getByRole('checkbox');
    expect(input.getAttribute('checked')).not.toBeNull();
  });
});
