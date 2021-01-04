import { Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { __ } from 'i18n';
import UserEntity, { UserRole } from '../entities/user.entity';
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

// REGISTER
export const register = async (registerUser: IUserRegistrationRequest): Promise<IUserRegistrationResponse> => {
  const verificationNeeded = false;
  const { error } = registerUserSchema(registerUser);
  if (!!error) {
    throw new BadRequest(error.details[0].message);
  }

  const existingUser = await UserEntity.findOne({ email: registerUser.email });
  if (!!existingUser) {
    throw new BadRequest(__('error.existingUser'));
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
export const login = async (loginUser: IUserLoginRequest): Promise<IUserLoginResponse> => {
  const { error } = loginUserSchema(loginUser);
  if (!!error) {
    throw new BadRequest(error.details[0].message);
  }

  const user = await UserEntity.findOne({ email: loginUser.email });
  if (!user) {
    throw new BadRequest(__('error.invalidCredentials'));
  }

  const validPassword = await compare(loginUser.password, user.password);
  if (!validPassword) {
    throw new BadRequest(__('error.invalidCredentials'));
  }

  const token = jwt.sign({ id: user._id, name: user.name, roles: user.roles }, process.env.TOKEN_SECRET);
  return { token };
};

// USER INFO
export const userInfo = async (response: Response): Promise<IUserResponse> => {
  const token = response.locals.jwtToken;
  const user = await UserEntity.findOne({ _id: token.id });
  if (!user) {
    throw new NotFound(__('error.notFound'));
  }
  return userDetailMappper(user);
};

// CHANGE PASSWORD
export const changePassword = async (
  changePasswordRequest: IUserChangePasswordRequest,
  response: Response,
): Promise<IUserChangePasswordResponse> => {
  const { error } = changePasswordSchema(changePasswordRequest);
  if (!!error) {
    throw new BadRequest(error.details[0].message);
  }
  const token = response.locals.jwtToken;
  const user = await UserEntity.findOne({ _id: token.id });
  if (!user) {
    throw new NotFound(__('error.notFound'));
  }

  const validPassword = await compare(changePasswordRequest.oldPassword, user.password);
  if (!validPassword) {
    throw new BadRequest(__('error.invalidCredentials'));
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(changePasswordRequest.newPassword, salt);

  await UserEntity.updateOne({ _id: token.id }, { $set: { password: hashedPassword } });

  return { success: true };
};

// LIST OF USERS
export const listOfUsers = async (): Promise<IUserResponse[]> => {
  const users = await UserEntity.find();
  if (!users) {
    throw new NotFound(__('error.notFound'));
  }
  return userListMappper(users);
};
