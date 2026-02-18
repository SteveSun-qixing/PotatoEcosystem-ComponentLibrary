export type TokenBag = Record<string, string>;

export interface ThemeNode {
  stack: TokenBag[];
  defaults: TokenBag;
}
