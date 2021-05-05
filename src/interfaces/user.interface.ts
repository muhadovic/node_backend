import { Document, Types } from 'mongoose';
import { LoginTypeEnum } from '../enums/login-types.enum';
import { IWallet } from './wallet.interface';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserStatusEnum } from '../enums/user-status.enum';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  passwordHash?: string;
  image?: any;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isFirstLogin?: boolean;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  type?: LoginTypeEnum;
  location?: any;
  advertisements?: string[];
  lastActivity: Date;
  isOnline?: boolean;
  socketId?: string;
  wallet?: IWallet;
  loveCoin?: number;
  role?: number[];
  country_code?: string;
  state_code?: string;
  deviceType ?: number;
  deviceToken ?: string;
  nickName?: string;
  completeUser?: number,
  status?: UserStatusEnum,
  customerId?: string,
}
