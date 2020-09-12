import { Request, Response } from 'express';
import { genSalt, hash, compare } from 'bcrypt';
import { registerUserSchema, loginUserSchema } from '../validations/validations';
import UserModel from '../model/user.model';
import * as jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const { error } = registerUserSchema(req.body);
    if (!!error) {
        return res.status(400).send(error.details[0].message);
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (!!existingUser) {
        return res.status(400).send('User already exists');
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(req.body.password, salt);

    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const login = async (req: Request, res: Response) => {

    const { error } = loginUserSchema(req.body);
    if (!!error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('User does not exist');
    }

    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Wrong password');
    }

    const token = jwt.sign({ id: user._id}, process.env.TOKEN_SECRET);
    res.send(token)
}

export const userInfo = async (req: Request, res: Response) => {
    const token = res.locals.jwtToken;
    const user = await UserModel.findOne({ _id: token.id });
    if (!user) {
        return res.status(400).send('User does not exist');
    }
    res.send(user);
}

export const logout = async (req: Request, res: Response) => {
    res.send('OK')
}