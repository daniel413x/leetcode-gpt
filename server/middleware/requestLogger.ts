import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export default (req: Request, res: Response, next: NextFunction) => {
  const id = new Date().valueOf().toString().slice(7);
  logger('               ', `${id} (${new Date().toLocaleString('en-US', { timeZone: 'EST' })})`);
  logger('req.method:    ', req.method);
  logger('req.path:      ', req.path);
  logger('req.body:      ', req.body);
  res.on('finish', () => {
    logger(`res.statusCode: ${[res.statusCode]} (${res.statusCode}) (${id})`);
    logger('---');
  });
  next();
};
