import { Schema, model, Document } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  roles: UserRole[];
  obsolete: boolean;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      min: 2,
      max: 255,
    },
    surname: {
      type: String,
      required: false,
      min: 2,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    phone: {
      type: String,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
    },
    roles: {
      type: Array,
      required: true,
    },
    obsolete: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const UserEntity = model<IUser>('User', userSchema);
export default UserEntity;
