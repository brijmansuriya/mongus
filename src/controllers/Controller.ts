import { Response } from 'express';
import { ValidationError, Result, validationResult } from 'express-validator';
import { Model } from 'mongoose';
import { Logger } from '@utils/logger';
import { config } from '@config/env';
import { IUserRequest } from '@types/index';

const logger = Logger.getInstance(config);

export class Controller {
  protected success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected error(
    res: Response,
    error: Error | string | null,
    message = 'Error occurred',
    statusCode = 500
  ): Response {
    if (statusCode >= 500) {
      logger.error(message, {
        error: error instanceof Error ? error : new Error(String(error)),
        stack: error instanceof Error ? error.stack : undefined,
      });
    } else {
      logger.warn(message, { error });
    }

    return res.status(statusCode).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  protected validationError(
    res: Response,
    errors: ValidationError[],
    message = 'Validation failed',
    statusCode = 400
  ): Response {
    logger.warn('Validation error', { errors });
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  protected validateRequest(req: IUserRequest, res: Response): boolean {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      this.validationError(res, errors.array());
      return false;
    }
    return true;
  }

  protected async checkRecordExists<T>(
    Model: Model<T>,
    field: keyof T,
    value: unknown,
    res: Response
  ): Promise<boolean> {
    try {
      const record = await Model.findOne({ [field]: value });
      if (record) {
        this.error(res, null, `${String(field)} already exists`, 400);
        return false;
      }
      return true;
    } catch (err) {
      this.error(res, err as Error, 'Error while checking record existence');
      return false;
    }
  }
}
