import { UserRole } from '../entities/user.entity';

export interface IUserResponse {
  name: string;
  surname: string;
  email: string;
  phone: string;
  roles: UserRole[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface IUserRegistrationRequest {
  email: string;
  password: string;
  name?: string;
}

export interface IUserRegistrationResponse {
  name: string;
  surname: string;
  email: string;
  phone: string;
  roles: UserRole[];
  emailVerified: boolean;
  phoneVerified: boolean;
  verificationNeeded: boolean;
}

export interface IUserLoginRequest {
  remember?: boolean;
  email: string;
  password: string;
}

export interface IUserLoginResponse {
  token: string;
}

export interface IUserChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface IUserChangePasswordResponse {
  success: boolean;
}
