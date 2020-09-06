import express from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/auth';
import * as dotenv from 'dotenv';
const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Connected to DB')
    }
);



// Middlewares
app.use(express.json());
app.use('/api/user', authRoute);

app.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}`));