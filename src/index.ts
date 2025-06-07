import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from '@routes/index';
import { errorHandler } from '@middleware/errorHandler';
import { config } from '@config/env';
import { connectDB } from '@config/database';
import { Logger } from '@utils/logger';

const app = express();

// Initialize logger
const logger = Logger.getInstance(config);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
app.use(rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS
}));

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// API routes
app.use(config.API_PREFIX, routes);

// Development logging
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get('/', (_, res) => {
  return res.status(200).json({
    message: 'Welcome to the API',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'success',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API routes
console.log('User routes initialized');
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const server = await new Promise((resolve, reject) => {
      const srv = app.listen(config.PORT)
        .once('listening', () => {
          logger.info('Server started', {
            port: config.PORT,
            env: config.NODE_ENV,
            version: process.version
          });
          resolve(srv);
        })
        .once('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            logger.error(`Port ${config.PORT} is already in use. Please try a different port or kill the process using this port.`);
            process.exit(1);
          }
          reject(err);
        });
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
