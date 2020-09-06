import { Router } from 'express';
import { genSalt, hash } from 'bcrypt';
import { registerUserSchema } from '../validations/validations';
import UserModel from '../model/user';

const authRoute = Router();

authRoute.post('/register', async (req, res) => {

    const { error } = registerUserSchema(req.body);
    if (!!error) {
        res.status(400).send(error.details[0].message);
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (!!existingUser) {
        res.status(400).send('User already exists');
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
})

authRoute.post('/login', (req, res) => {
    res.send('login');
})

authRoute.get('/login', (req, res) => {
    res.send('login 4');
})

export default authRoute;