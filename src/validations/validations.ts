import Joi from '@hapi/joi';
import { IUser } from '../model/user.model';

export const registerUserSchema = (data: IUser): Joi.ValidationResult => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
}

export const loginUserSchema = (data: any): Joi.ValidationResult => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
}
