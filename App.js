// Importing modules using ES6 syntax
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Initialize the express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

export default app;