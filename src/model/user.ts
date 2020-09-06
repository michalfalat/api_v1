// const mongoose = require('mongoose');

import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024
    },
}, {
    timestamps: true
})

const UserModel = model('User', userSchema);
export default UserModel;