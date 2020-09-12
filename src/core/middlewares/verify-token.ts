import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).send('Access denied');
    try {
        const verifiedToken =  jwt.verify(token, process.env.TOKEN_SECRET);
        res.locals.jwtToken = verifiedToken;
        next();
    } catch (error) {
        return res.status(400).send('Invalid token');
    }
}