import Joi from '@hapi/joi';
import { IUserLoginRequest, IUserRegistrationRequest } from '../models/auth.model';

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
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
