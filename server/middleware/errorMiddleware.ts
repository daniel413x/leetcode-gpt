import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError';
import logger from './logger';

// error handler needs 4 params or won't execute
// eslint-disable-next-line no-unused-vars
export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  logger(err);
  return res.status(500).json({ message: 'Internal server or validation error' });
};
