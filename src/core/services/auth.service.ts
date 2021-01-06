import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import UserEntity, { IUser, UserRole } from '../entities/user.entity';
import { changePasswordSchema, loginUserSchema, registerUserSchema } from '../validations/auth.validations';
import { BadRequest, NotFound } from '../utils/errors';
import * as jwt from 'jsonwebtoken';
import { userDetailMappper, userListMappper, userRegistrationMappper } from '../mappers/auth.mapper';
import {
  IUserChangePasswordRequest,
  IUserChangePasswordResponse,
  IUserLoginRequest,
  IUserLoginResponse,
  IUserRegistrationRequest,
  IUserRegistrationResponse,
  IUserResponse,
} from '../models/auth.model';
import { EmailTemplate } from '../models/email.model';
import { sendEmail } from './email.service';

// REGISTER
export const register = async (request: Request, response: Response): Promise<IUserRegistrationResponse> => {
  const registerUser: IUserRegistrationRequest = request.body;
  const verificationNeeded = false;
  const { error } = registerUserSchema(registerUser);
  if (!!error) {
    throw new BadRequest(error.details[0].message);
  }

  const existingUser = await UserEntity.findOne({ email: registerUser.email });
  if (!!existingUser) {
    throw new BadRequest(request.__('error.existingUser'));
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(registerUser.password, salt);

  const user = new UserEntity({
    name: registerUser.name || '',
    email: registerUser.email,
    password: hashedPassword,
    roles: [UserRole.USER],
  });
  try {
    const savedUser = await user.save();
    return userRegistrationMappper(savedUser, verificationNeeded);
  } catch (error) {
    throw new BadRequest(error);
  }
};

// LOGIN
export const login = async (request: Request, response: Response): Promise<IUserLoginResponse> => {
  const loginUser: IUserLoginRequest = request.body;
  const { error } = loginUserSchema(loginUser);
  if (!!error) {
    throw new BadRequest(error.details[0].message);
  }

  const user = await UserEntity.findOne({ email: loginUser.email });
  if (!user) {
    throw new BadRequest(request.__('error.invalidCredentials'));
  }

  const validPassword = await compare(loginUser.password, user.password);
  if (!validPassword) {
    throw new BadRequest(request.__('error.invalidCredentials'));
  }

  const token = jwt.sign({ id: user._id, name: user.name, roles: user.roles }, process.env.TOKEN_SECRET);
  return { token };
};

// USER INFO
export const userInfo = async (request: Request, response: Response): Promise<IUserResponse> => {
  const token = response.locals.jwtToken;
  const user = await UserEntity.findOne({ _id: token.id });
  if (!user) {
    throw new NotFound(request.__('error.notFound'));
  }
  await sendVerifyEmail(request, response, user);
  return userDetailMappper(user);
};

// CHANGE PASSWORD
export const changePassword = async (request: Request, response: Response): Promise<IUserChangePasswordResponse> => {
  const changePasswordRequest: IUserChangePasswordRequest = request.body;
  const { error } = changePasswordSchema(changePasswordRequest);
  if (!!error) {
    throw new BadRequest(error.details[0].message);
  }
  const token = response.locals.jwtToken;
  const user = await UserEntity.findOne({ _id: token.id });
  if (!user) {
    throw new NotFound(request.__('error.notFound'));
  }

  const validPassword = await compare(changePasswordRequest.oldPassword, user.password);
  if (!validPassword) {
    throw new BadRequest(request.__('error.invalidCredentials'));
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(changePasswordRequest.newPassword, salt);

  await UserEntity.updateOne({ _id: token.id }, { $set: { password: hashedPassword } });

  return { success: true };
};

// LIST OF USERS
export const listOfUsers = async (request: Request, response: Response): Promise<IUserResponse[]> => {
  const users = await UserEntity.find();
  if (!users) {
    throw new NotFound(request.__('error.notFound'));
  }
  return userListMappper(users);
};

export const sendVerifyEmail = async (request: Request, response: Response, user: IUser): Promise<void> => {
  const email: EmailTemplate<'verifyEmail'> = {
    template: 'verifyEmail',
    params: {
      name: user?.name?.length ? `${user.name} ${user.surname}` : user.email,
      verifyToken: '3as4d3ad43awd43aa3wd',
    },
    to: user.email,
    lang: request.getLocale(),
  };

  await sendEmail(email);
};
