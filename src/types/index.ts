import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isActive: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserRequest extends Request {
  user?: IUser;
}

export interface IConfig {
  NODE_ENV: string;
  PORT: number;
  APP_NAME: string;
  API_VERSION: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  RATE_LIMIT: {
    WINDOW_MS: number;
    MAX_REQUESTS: number;
  };
  LOG_LEVEL: string;
  LOG_FILE: string;
  CACHE_TTL: number;
  SMTP: {
    HOST: string;
    PORT: number;
    USER: string;
    PASS: string;
  };
}

export interface IAppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}
