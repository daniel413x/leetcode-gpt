import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import ApiError from '../error/ApiError';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const authToken = req.headers.authorization?.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    if (!decodedToken) {
      return next(ApiError.unauthorized('Unauthorized request'));
    }
    const { uid } = decodedToken;
    res.locals.User = uid;
    return next();
  } catch (e) {
    return next(ApiError.unauthorized('Token expired. Please relog in.'));
  }
};
