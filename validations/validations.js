
const Joi = require('@hapi/joi');

const registerUserSchema = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),

    })

    return schema.validate(data);
}


module.exports.registerUserSchema = registerUserSchema;