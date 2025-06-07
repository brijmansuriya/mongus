import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ResponseError } from '@utils/responseError';

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }

  next(new ResponseError(400, 'Validation failed', errors.array()));
};

export default validateRequest;
