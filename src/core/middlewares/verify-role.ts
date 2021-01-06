import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entities/user.entity';
import { __ } from 'i18n';
import { AccessForbidden } from '../utils/errors';

export const verifyRole = (role: UserRole): any => (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token, { complete: true });
  if (decodedToken?.['roles']?.includes(role)) next();
  else throw new AccessForbidden(req.__('error.accessDenied'));
};
