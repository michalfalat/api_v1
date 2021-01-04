import express from 'express';
import mongoose from 'mongoose';
import * as authController from './controllers/auth.controller';
import * as dotenv from 'dotenv';
import * as i18n from 'i18n';
import * as path from 'path';
import * as cors from 'cors';
import { verifyToken } from './core/middlewares/verify-token';
import { verifyRole } from './core/middlewares/verify-role';
import { UserRole } from './core/entities/user.entity';
import cookieParser from 'cookie-parser';
import { handleErrors } from './core/utils/error-handle';

const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('Connected to DB!');
});

i18n.configure({
  locales: ['en', 'sk'],
  directory: path.join(__dirname, 'locales'),
  cookie: 'lang',
  defaultLocale: 'en',
});

// Middlewares
app.use(cors.default());
app.use(cookieParser());
app.use(i18n.init);
app.use(express.json());

// Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.post('/api/auth/user-info', [verifyToken], authController.userInfo);
app.get('/api/auth/change-password', [verifyToken], authController.changePassword);
app.get('/api/auth/users', [verifyToken, verifyRole(UserRole.ADMIN)], authController.listOfUsers);

// Error handler
app.use(handleErrors);

export default app;
