import Joi from '@hapi/joi';
import { IUserChangePasswordRequest, IUserLoginRequest, IUserRegistrationRequest } from '../models/auth.model';

export const registerUserSchema = (data: IUserRegistrationRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).optional(),
  });
  return schema.validate(data);
};

export const loginUserSchema = (data: IUserLoginRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    remember: Joi.bool().optional(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export const changePasswordSchema = (data: IUserChangePasswordRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
