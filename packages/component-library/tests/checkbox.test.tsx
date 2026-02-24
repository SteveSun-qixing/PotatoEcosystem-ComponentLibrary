import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChipsCheckbox } from '../src/components/Checkbox';

describe('Checkbox', () => {
  it('renders label content', () => {
    render(<ChipsCheckbox>Agree</ChipsCheckbox>);

    expect(screen.getByText('Agree')).toBeTruthy();
  });

  it('supports controlled checked state', () => {
    render(<ChipsCheckbox checked>Accept</ChipsCheckbox>);

    const input = screen.getByRole('checkbox');
    expect(input.getAttribute('checked')).not.toBeNull();
  });
});
