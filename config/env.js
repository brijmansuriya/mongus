import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load appropriate .env file based on environment
const environment = process.env.NODE_ENV || 'development';
const envFile = environment === 'test' ? '.env.test' : '.env';
dotenv.config({ path: join(dirname(__dirname), envFile) });

// Validate and cache environment variables
const validateEnvVar = (name, defaultValue = undefined, validator = null) => {
    const value = process.env[name] || defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    if (validator && !validator(value)) {
        throw new Error(`Environment variable ${name} failed validation`);
    }
    return value;
};

// Define and validate configuration once at startup
const config = Object.freeze({
    // Server Configuration
    NODE_ENV: validateEnvVar('NODE_ENV', 'development', 
        (value) => ['development', 'production', 'test'].includes(value)),
    PORT: parseInt(validateEnvVar('PORT', '3000', 
        (value) => !isNaN(value) && value > 0)),
    APP_NAME: validateEnvVar('APP_NAME', 'Mongus API'),
    API_VERSION: validateEnvVar('API_VERSION', 'v1'),

    // Database Configuration
    MONGODB_URI: validateEnvVar('MONGODB_URI', 'mongodb://localhost:27017/mongus',
        (value) => value.startsWith('mongodb://')||value.startsWith('mongodb+srv://')),
    
    // JWT Configuration
    JWT_SECRET: validateEnvVar('JWT_SECRET', null), // Required, no default
    JWT_EXPIRES_IN: validateEnvVar('JWT_EXPIRES_IN', '30d'),
    
    // Security Configuration
    CORS_ORIGIN: validateEnvVar('CORS_ORIGIN', '*'),
    RATE_LIMIT: {
        WINDOW_MS: parseInt(validateEnvVar('RATE_LIMIT_WINDOW', '15')) * 60 * 1000,
        MAX_REQUESTS: parseInt(validateEnvVar('RATE_LIMIT_MAX', '100')),
    },
    
    // Logging Configuration
    LOG_LEVEL: validateEnvVar('LOG_LEVEL', 'info',
        (value) => ['error', 'warn', 'info', 'debug'].includes(value)),
    LOG_FILE: validateEnvVar('LOG_FILE', 'logs/app.log'),
    
    // Cache Configuration
    CACHE_TTL: parseInt(validateEnvVar('CACHE_TTL', '60')),
    
    // Email Configuration
    SMTP: {
        HOST: validateEnvVar('SMTP_HOST', ''),
        PORT: parseInt(validateEnvVar('SMTP_PORT', '587')),
        USER: validateEnvVar('SMTP_USER', ''),
        PASS: validateEnvVar('SMTP_PASS', '')
    }
});

// Validate essential environment variables at startup
// In development, provide default values for essential variables
if (process.env.NODE_ENV === 'development') {
    if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'dev_jwt_secret_not_for_production_use';
        console.warn('Warning: Using default JWT_SECRET. This is only for development!');
    }
    if (!process.env.MONGODB_URI) {
        process.env.MONGODB_URI = 'mongodb://localhost:27017/mongus_db';
        console.warn('Warning: Using default MongoDB URI');
    }
} else {
    // In production, strictly require these variables
    const essentialVars = ['JWT_SECRET', 'MONGODB_URI'];
    essentialVars.forEach(varName => {
        if (!config[varName]) {
            throw new Error(`Essential environment variable ${varName} is not configured`);
        }
    });
}

// Log configuration on startup (excluding sensitive data)
const sanitizedConfig = { ...config };
delete sanitizedConfig.JWT_SECRET;
delete sanitizedConfig.SMTP.PASS;
// console.log('Loaded configuration:', JSON.stringify(sanitizedConfig, null, 2));

export default config;
