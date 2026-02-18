import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConfigProvider, useConfig } from '../src/config';

function Probe() {
  const { getConfig } = useConfig();
  return <div data-testid="cfg">{String(getConfig('density.mode') ?? 'none')}</div>;
}

describe('ConfigProvider', () => {
  it('uses nearest config value from nested stack', () => {
    render(
      <ConfigProvider config={{ 'density.mode': 'comfortable' }}>
        <ConfigProvider config={{ 'density.mode': 'compact' }}>
          <Probe />
        </ConfigProvider>
      </ConfigProvider>,
    );

    expect(screen.getByTestId('cfg').textContent).toBe('compact');
  });
});
