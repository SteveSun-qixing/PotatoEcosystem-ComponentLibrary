import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider, useI18n } from '../src/i18n';

function Message() {
  const { t } = useI18n();
  return <p data-testid="msg">{t('common.greet', { name: 'Chips' })}</p>;
}

describe('I18nProvider', () => {
  it('renders locale message with vars', () => {
    render(
      <I18nProvider
        locale="zh-CN"
        fallbackLocale="en-US"
        dictionaries={{
          'zh-CN': { common: { greet: '你好，{name}' } },
          'en-US': { common: { greet: 'Hello, {name}' } },
        }}
      >
        <Message />
      </I18nProvider>,
    );

    expect(screen.getByTestId('msg').textContent).toBe('你好，Chips');
  });

  it('falls back to fallback locale when key missing', () => {
    render(
      <I18nProvider
        locale="zh-CN"
        fallbackLocale="en-US"
        dictionaries={{
          'zh-CN': { common: {} },
          'en-US': { common: { greet: 'Hello, {name}' } },
        }}
      >
        <Message />
      </I18nProvider>,
    );

    expect(screen.getByTestId('msg').textContent).toBe('Hello, Chips');
  });
});
