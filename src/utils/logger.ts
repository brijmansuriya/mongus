import winston from 'winston';
import { Config } from '@config/types';
import { getLoggerConfig } from '@config/logger';

export class Logger {
  private static instance: winston.Logger;

  static getInstance(config: Config): winston.Logger {
    if (!this.instance) {
      const logConfig = getLoggerConfig(config);
      const transports: winston.transport[] = [];

      // Console transport
      if (logConfig.console.enabled) {
        transports.push(
          new winston.transports.Console({
            level: logConfig.console.level,
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          })
        );
      }

      // File transport
      transports.push(
        new winston.transports.File({
          filename: logConfig.file.filename,
          level: logConfig.file.level,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          maxsize: logConfig.file.maxsize,
          maxFiles: logConfig.file.maxFiles
        })
      );

      this.instance = winston.createLogger({
        level: config.NODE_ENV === 'development' ? 'debug' : 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
        defaultMeta: { 
          service: config.APP_NAME,
          environment: config.NODE_ENV
        },
        transports
      });
    }

    return this.instance;
  }
}

export type LoggerType = winston.Logger;
