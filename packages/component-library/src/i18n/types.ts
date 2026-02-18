export type Locale = string;
export type TranslationValue = string;
export interface TranslationMap {
  [key: string]: TranslationValue | TranslationMap;
}
export type Dictionaries = Record<Locale, TranslationMap>;
