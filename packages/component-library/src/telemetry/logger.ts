export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  sink?: (entry: { level: LogLevel; message: string; context?: Record<string, unknown> }) => void;
}

const ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function createLogger(options: LoggerOptions = {}): Logger {
  const minLevel = options.minLevel ?? 'info';
  const sink =
    options.sink ??
    ((entry) => {
      const method = entry.level === 'debug' ? 'log' : entry.level;
      // eslint-disable-next-line no-console
      console[method](`[chips:${entry.level}] ${entry.message}`, entry.context ?? {});
    });

  const canLog = (level: LogLevel) => ORDER[level] >= ORDER[minLevel];

  const log = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
    if (!canLog(level)) {
      return;
    }

    if (context === undefined) {
      sink({ level, message });
      return;
    }

    sink({ level, message, context });
  };

  return {
    debug: (message, context) => log('debug', message, context),
    info: (message, context) => log('info', message, context),
    warn: (message, context) => log('warn', message, context),
    error: (message, context) => log('error', message, context),
  };
}
