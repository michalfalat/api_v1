import { NextFunction, Request, Response } from 'express';
import * as authService from './../core/services/auth.service';

// REGISTER
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerResponse = await authService.register(req, res);
    res.send(registerResponse);
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authService.login(req, res);
    res.send(token);
  } catch (err) {
    next(err);
  }
};

// USER INFO
export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDetail = await authService.userInfo(req, res);
    res.send(userDetail);
  } catch (err) {
    next(err);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const changeResult = await authService.changePassword(req, res);
    res.send(changeResult);
  } catch (err) {
    next(err);
  }
};

// LIST OF USERS
export const listOfUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await authService.listOfUsers(req, res);
    res.send(users);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({});
  } catch (err) {
    next(err);
  }
};
