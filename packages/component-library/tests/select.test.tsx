import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select } from '../src/components/Select';

describe('Select', () => {
  it('renders root classes and scope markers', () => {
    render(
      <Select
        chipsScope="select"
        options={[
          { label: 'Chinese', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
        ]}
        value="zh-CN"
      />,
    );

    const root = document.querySelector('.chips-select');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-scope')).toBe('select');
  });

  it('renders trigger and option classes for theme styling hooks', () => {
    render(
      <Select
        label="Language"
        options={[
          { label: 'Chinese', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
        ]}
        value="zh-CN"
      />,
    );

    expect(screen.getByText('Language')).toBeTruthy();
    expect(document.querySelector('.chips-select__trigger')).not.toBeNull();
    expect(document.querySelector('.chips-select__icon')).not.toBeNull();
  });
});
