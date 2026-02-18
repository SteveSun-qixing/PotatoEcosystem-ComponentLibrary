import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';

export type ConfigValue = string | number | boolean;
export type ConfigBag = Record<string, ConfigValue>;

interface ConfigContextValue {
  stack: ConfigBag[];
  getConfig: (key: string) => ConfigValue | undefined;
}

interface ConfigProviderProps extends PropsWithChildren {
  config?: ConfigBag;
}

const ConfigContext = createContext<ConfigContextValue>({
  stack: [],
  getConfig: () => undefined,
});

export function ConfigProvider({ children, config }: ConfigProviderProps) {
  const parent = useContext(ConfigContext);
  const value = useMemo<ConfigContextValue>(() => {
    const stack = config ? [config, ...parent.stack] : parent.stack;

    return {
      stack,
      getConfig: (key: string) => {
        for (const layer of stack) {
          if (key in layer) {
            return layer[key];
          }
        }
        return undefined;
      },
    };
  }, [config, parent.stack]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
