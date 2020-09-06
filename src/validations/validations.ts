import Joi from '@hapi/joi';

export const registerUserSchema = (data: any): any => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}
