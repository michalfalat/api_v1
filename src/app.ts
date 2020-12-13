import express from 'express';
import mongoose from 'mongoose';
import * as authController from './controllers/auth.controller';
import * as dotenv from 'dotenv';
import { verifyToken } from './core/middlewares/verify-token';
const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('Connected to DB!');
});

// Middlewares
app.use(express.json());

// Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/user-info', [verifyToken], authController.userInfo);

export default app;
