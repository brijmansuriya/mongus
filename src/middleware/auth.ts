import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@models/User';
import { config } from '@config/env';
import { IUserRequest } from '@types/index';
import { Logger } from '@utils/logger';

const logger = Logger.getInstance(config);

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  let token: string | undefined;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        logger.warn('Authentication failed - User not found', {
          token,
          userId: decoded.id,
          path: req.path,
          ip: req.ip
        });
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      logger.warn('Authentication failed - Invalid token', {
        error,
        path: req.path,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    logger.warn('Authentication failed - No token', {
      path: req.path,
      ip: req.ip
    });
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};
