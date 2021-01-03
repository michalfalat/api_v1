import { Request, Response } from 'express';
import { genSalt, hash, compare } from 'bcrypt';
import { registerUserSchema, loginUserSchema } from '../validations/validations';
import UserModel, { UserRole } from '../model/user.model';
import * as jwt from 'jsonwebtoken';
import { userListMappper, userDetailMappper, userRegistrationMappper } from '../core/mappers/auth.mapper';
import { __ } from 'i18n';

export const register = async (req: Request, res: Response) => {
  console.log('req.cookies :>> ', JSON.stringify(req.cookies));
  const verificationNeeded = false;
  const { error } = registerUserSchema(req.body);
  if (!!error) {
    return res.status(400).send(error.details[0].message);
  }

  const existingUser = await UserModel.findOne({ email: req.body.email });
  if (!!existingUser) {
    return res.status(400).send(__('error.existingUser'));
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(req.body.password, salt);

  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    roles: [UserRole.USER],
  });
  try {
    const savedUser = await user.save();
    res.send(userRegistrationMappper(savedUser, verificationNeeded));
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = loginUserSchema(req.body);
  if (!!error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send(__('error.invalidCredentials'));
  }

  const validPassword = await compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send(__('error.invalidCredentials'));
  }

  const token = jwt.sign({ id: user._id, name: user.name, roles: user.roles }, process.env.TOKEN_SECRET);
  res.send(token);
};

export const userInfo = async (req: Request, res: Response) => {
  const token = res.locals.jwtToken;
  const user = await UserModel.findOne({ _id: token.id });
  if (!user) {
    return res.status(400).send(__('error.notFound'));
  }
  res.send(userDetailMappper(user));
};

export const listOfUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find();
  if (!users) {
    return res.status(400).send(__('error.notFound'));
  }
  res.send(userListMappper(users));
};

export const logout = async (req: Request, res: Response) => {
  res.send(__('error.notFound'));
};
