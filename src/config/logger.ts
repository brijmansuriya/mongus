import { Config } from './types';

export const loggerConfig = {
  console: {
    level: 'info',
    handleExceptions: true,
    format: 'dev',
    enabled: true
  },
  file: {
    level: 'info',
    filename: 'logs/app.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: 'combined'
  },
  mongo: {
    enabled: false, // Disable MongoDB logging by default
    collection: 'logs',
    cappedSize: 5242880,
    cappedMax: 5000
  }
} as const;

export const getLoggerConfig = (config: Config) => ({
  ...loggerConfig,
  console: {
    ...loggerConfig.console,
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',
    enabled: config.NODE_ENV !== 'production'
  },
  mongo: {
    ...loggerConfig.mongo,
    enabled: config.NODE_ENV === 'production'
  }
});
