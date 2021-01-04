import { NextFunction, Request, Response } from 'express';
import * as authService from './../core/services/auth.service';

// REGISTER
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerResponse = await authService.register(req.body);
    res.send(registerResponse).json();
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authService.login(req.body);
    res.send({ token }).json();
  } catch (err) {
    next(err);
  }
};

// USER INFO
export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDetail = await authService.userInfo(res);
    res.send(userDetail).json();
  } catch (err) {
    next(err);
  }
};

// LIST OF USERS
export const listOfUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await authService.listOfUsers();
    res.send(users).json();
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({}).json();
  } catch (err) {
    next(err);
  }
};
