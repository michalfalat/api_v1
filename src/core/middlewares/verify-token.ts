import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { __ } from 'i18n';
import { NotAuthorized } from '../utils/errors';

export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new NotAuthorized(req.__('error.notLoggedIn'));
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.jwtToken = verifiedToken;
    next();
  } catch (error) {
    throw new NotAuthorized(req.__('error.notLoggedIn'));
  }
};
