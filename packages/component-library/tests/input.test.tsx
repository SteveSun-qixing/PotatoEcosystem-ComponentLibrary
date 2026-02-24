import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChipsInput } from '../src/components/Input';

describe('ChipsInput', () => {
  it('renders label, helper and error sections', () => {
    render(
      <ChipsInput
        label="Name"
        helperText="Please input a name"
        errorText="Name is required"
        invalid
        aria-label="name"
      />,
    );

    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Please input a name')).toBeTruthy();
    expect(screen.getByText('Name is required')).toBeTruthy();
  });

  it('keeps native textbox role and scope markers', () => {
    render(<ChipsInput label="Email" aria-label="email" chipsScope="chips-input" />);

    const control = screen.getByRole('textbox');
    expect(control.getAttribute('data-part')).toBe('control');
    expect(control.closest('[data-scope="chips-input"]')).not.toBeNull();
  });
});
