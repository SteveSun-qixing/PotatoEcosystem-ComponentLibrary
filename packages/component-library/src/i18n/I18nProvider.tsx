import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { Dictionaries, Locale, TranslationMap } from './types';

interface I18nContextValue {
  locale: Locale;
  fallbackLocale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

interface I18nProviderProps extends PropsWithChildren {
  locale: Locale;
  fallbackLocale?: Locale;
  dictionaries: Dictionaries;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  t: (key) => key,
});

function getByPath(record: TranslationMap | undefined, key: string): string | undefined {
  if (!record) {
    return undefined;
  }

  const parts = key.split('.');
  let current: TranslationMap | string | undefined = record;

  for (const part of parts) {
    if (!current || typeof current === 'string') {
      return undefined;
    }

    current = current[part] as TranslationMap | string | undefined;
  }

  return typeof current === 'string' ? current : undefined;
}

function applyVars(message: string, vars: Record<string, string | number> | undefined): string {
  if (!vars) {
    return message;
  }

  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value));
  }, message);
}

export function I18nProvider({ children, locale, fallbackLocale = 'en-US', dictionaries }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, vars?: Record<string, string | number>) => {
      const primary = getByPath(dictionaries[locale], key);
      const fallback = getByPath(dictionaries[fallbackLocale], key);
      return applyVars(primary ?? fallback ?? key, vars);
    };

    return {
      locale,
      fallbackLocale,
      t,
    };
  }, [dictionaries, fallbackLocale, locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
