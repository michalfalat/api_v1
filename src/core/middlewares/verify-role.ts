import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../model/user.model';
import { __ } from 'i18n';

export const verifyRole = (role: UserRole): any => (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token, { complete: true });
  console.log('decodedToken :>> ', decodedToken);
  if (decodedToken?.['roles']?.includes(role)) next();
  else return res.status(403).send(__('error.accessDenied'));
};
