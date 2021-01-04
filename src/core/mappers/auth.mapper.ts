import { IUser } from '../entities/user.entity';
import { IUserRegistrationResponse, IUserResponse } from '../models/auth.model';

export const userListMappper = (users: IUser[]): IUserResponse[] =>
  users?.map(user => ({
    name: user.name,
    surname: user.surname,
    email: user.email,
    phone: user.phone,
    roles: user.roles,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
  }));

export const userDetailMappper = (user: IUser): IUserResponse => ({
  name: user.name,
  surname: user.surname,
  email: user.email,
  phone: user.phone,
  roles: user.roles,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
});

export const userRegistrationMappper = (user: IUser, verificationNeeded: boolean): IUserRegistrationResponse => ({
  name: user.name,
  surname: user.surname,
  email: user.email,
  phone: user.phone,
  roles: user.roles,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
  verificationNeeded,
});
