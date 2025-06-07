import config from './env.js';

export default {
    // General logging configuration
    logging: {
        // Default logging level
        level: config.LOG_LEVEL,
        
        // File transport configuration
        file: {
            enabled: true,
            maxSize: '20m',
            maxFiles: '14d',
            dirname: 'logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            // Separate files for different log levels
            errorFile: 'error-%DATE%.log',
            combinedFile: 'combined-%DATE%.log',
            exceptionFile: 'exceptions-%DATE%.log',
        },
        
        // Database transport configuration
        database: {
            enabled: true,
            collection: 'logs',
            expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days
            cappedSize: 5242880, // 5MB
            cappedMax: 5000, // Maximum number of documents
        },
        
        // Console transport configuration
        console: {
            enabled: config.NODE_ENV !== 'production',
            level: config.NODE_ENV === 'production' ? 'error' : 'debug',
            colorize: true,
        }
    }
};
