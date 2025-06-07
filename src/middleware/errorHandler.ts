import { Request, Response, NextFunction } from 'express';
import { Logger } from '@utils/logger';
import { ResponseError } from '@utils/responseError';
import config from '@config/env';

export const errorHandler = (
  err: Error | ResponseError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const logger = Logger.getInstance(config);
  const statusCode = err instanceof ResponseError ? err.statusCode : 500;
  const message = err instanceof ResponseError ? err.message : 'Internal Server Error';
  const details = err instanceof ResponseError ? err.details : undefined;

  // Log error with more details
  const logError = {
    statusCode,
    message: err.message,
    stack: err.stack,
    requestId: req.headers['x-request-id'],
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    originalUrl: req.originalUrl,
    details: err instanceof ResponseError ? err.details : undefined,
    error: err
  };

  if (statusCode >= 500) {
    logger.error('Server error occurred:', logError);
  } else {
    logger.warn('Client error occurred:', logError);
  }

  // Send response
  return res.status(statusCode).json({
    success: false,
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    ...(details && { details })
  });
};
