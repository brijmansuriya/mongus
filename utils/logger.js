import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import 'winston-mongodb';
import config from '../config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Get directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsDir = path.join(dirname(__dirname), 'logs');

// Ensure logs directory exists
import fs from 'fs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Define the logger format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.metadata(),
    winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: config.APP_NAME },
    transports: [
        // Error log file
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d'
        }),
        
        // Combined log file
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        }),

        // MongoDB transport
        new winston.transports.MongoDB({
            level: 'info',
            db: config.MONGODB_URI,
            collection: 'logs',
            format: winston.format.metadata()
        })
    ]
});

// Add console transport for non-production environments
if (config.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Request logging middleware
logger.requestMiddleware = (req, res, next) => {
    req.requestId = uuidv4();
    req.logger = logger.child({
        requestId: req.requestId,
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('user-agent')
    });
    next();
};

// Morgan stream
logger.stream = {
    write: (message) => logger.info(message.trim())
};

export default logger;
