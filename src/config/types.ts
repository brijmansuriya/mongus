export interface Config {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string;
  APP_NAME: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
  LOG_FILE_PATH: string;
  API_PREFIX: string;
  CORS_ORIGIN: string;
}

export interface LoggerConfig {
  console: {
    enabled: boolean;
    level: string;
  };
  file: {
    filename: string;
    level: string;
    maxsize: number;
    maxFiles: number;
  };
}
