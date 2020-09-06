const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const { registerUserSchema } = require('../validations/validations');

router.post('/register', async (req, res) => {
    
    const { error } = registerUserSchema(req.body);
    if(!!error) {
        res.status(400).send(error.details[0].message);
    }

    const existingUser = await User.findOne({ email: req.body.email});
    if(!!existingUser){
        res.status(400).send('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);

    } catch (error) {
        res.status(400).send(err);
        
    }
})

router.post('/login', (req, res) => {
    res.send('login');
})

router.get('/login', (req, res) => {
    res.send('login');
})

module.exports = router;