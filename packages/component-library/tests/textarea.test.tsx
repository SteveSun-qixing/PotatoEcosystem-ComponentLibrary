import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChipsTextarea } from '../src/components/Textarea';

describe('Textarea', () => {
  it('renders label, helper and error sections', () => {
    render(
      <ChipsTextarea
        label="Payload"
        helperText="Input JSON text"
        errorText="Invalid JSON"
        invalid
        aria-label="payload"
      />,
    );

    expect(screen.getByText('Payload')).toBeTruthy();
    expect(screen.getByText('Input JSON text')).toBeTruthy();
    expect(screen.getByText('Invalid JSON')).toBeTruthy();
  });

  it('renders themed control class and scope marker', () => {
    render(<ChipsTextarea chipsScope="chips-textarea" aria-label="dictionary" />);

    const control = screen.getByRole('textbox');
    expect(control.classList.contains('chips-textarea')).toBe(true);
    expect(control.closest('[data-scope="chips-textarea"]')).not.toBeNull();
  });
});
