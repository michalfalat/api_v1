const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('connected to DB')
    }
);



//Middlewares
app.use(express.json());
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('App is running'));