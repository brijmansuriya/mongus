import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import config from './config/env.js';
import logger from './utils/logger.js';
import connectDB from './database.js';
import { AppError } from './utils/AppError.js';
import userRoutes from './routes/userRoutes.js';

// Initialize the express app
const app = express();

// Global Error Handlers
process.on('uncaughtException', (err) => {
    logger.error('❌ Uncaught Exception:', { error: err, stack: err.stack });
    // Give logger time to write before exiting
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('❌ Unhandled Rejection:', { 
        reason: reason, 
        stack: reason?.stack,
        promise: promise 
    });
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000, // Convert minutes to milliseconds
    max: config.RATE_LIMIT_MAX // Max requests per window
});
app.use(limiter);

// Basic middleware
app.use(express.json({ limit: config.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.BODY_LIMIT }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('combined', { stream: logger.stream }));
app.use(logger.requestMiddleware);

// Compress all responses
app.use(compression());

// Development specific middleware
if (config.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        logger.debug(`${req.method} ${req.originalUrl}`);
        next();
    });
}

// API Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Error handling for non-existent routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error
    const logError = {
        statusCode: err.statusCode,
        status: err.status,
        message: err.message,
        stack: err.stack,
        requestId: req.requestId,
        path: req.path,
        method: req.method,
        ip: req.ip,
        body: req.body,
        query: req.query,
        params: req.params,
        userId: req.user?._id
    };

    if (err.statusCode >= 500) {
        logger.error('Server error occurred:', logError);
    } else {
        logger.warn('Client error occurred:', logError);
    }

    // Different error responses for development and production
    if (config.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
            requestId: req.requestId
        });
    } else {
        // Production error response - don't leak error details
        res.status(err.statusCode).json({
            status: err.status,
            message: err.statusCode === 500 ? 'Internal server error' : err.message,
            requestId: req.requestId
        });
    }
});

export default app;