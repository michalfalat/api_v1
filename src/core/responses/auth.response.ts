import { UserRole } from '../../model/user.model';

export interface IUserResponse {
  name: string;
  surname: string;
  email: string;
  phone: string;
  roles: UserRole[];
  emailVerified: boolean;
  phoneVerified: boolean;
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
