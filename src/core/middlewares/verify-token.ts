import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { __ } from 'i18n';
import { NotAuthorized } from '../utils/errors';

export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers.authorization;
  if (!token) throw new NotAuthorized(__('error.notLoggedIn'));
  try {
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.jwtToken = verifiedToken;
    next();
  } catch (error) {
    throw new NotAuthorized(__('error.notLoggedIn'));
  }
};
