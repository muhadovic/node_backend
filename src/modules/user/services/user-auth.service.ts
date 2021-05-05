import { HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { VerifyCodeRepository } from '../../../repositories/verify-code.repository';
import { IUser } from '../../../interfaces/user.interface';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { IVerifyCode } from '../../../interfaces/verify-code.interface';
import { SmsService } from '../../../services/sms.service';
import { EmailService } from '../../../services/email.service';
import { GoogleFacebookDto } from '../dto/googleFacebook.dto';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '../../../services/config.services';
import { AdvertisementService } from '../../advertisement/services/advertisement.service';
import { CartService } from '../../../modules/market/services/cart.service';
import { UserRoleEnum } from '../../../enums/user-role.enum';
import randomize = require('randomatic');
import { UserStatusEnum } from '../../../enums/user-status.enum';

@Injectable()
export class UserAuthService {
  private client: ClientProxy;
  constructor(
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly verifyCodeRepository: VerifyCodeRepository,
    private advertisementService: AdvertisementService,
    private configService: ConfigService,
    private cartService: CartService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get('user_ms_host'),
        port: this.configService.get('user_ms_port'),
      }
    });
  }

  public async signUp(userData: SignUpDto): Promise<any> {
    const checkUser = await this.client.send('user-find-one', { email: userData.email }).toPromise();
    if (!checkUser) {
      const dataToCreate: any = { ...userData };
      dataToCreate.role = [UserRoleEnum.usual];
      const user = await this.client.send('user-create', dataToCreate).toPromise();
      await this.sendVerifyCodeToEmail(userData.email)
      await this.cartService.create({ user: user.user._id });
      return { token: user.accessToken };
    } else {
      throw {
        message: 'User with this email already exist',
        status: 400,
      }
    }
  }

  public async signIn(signInData: SignInDto): Promise<any> {
    const checkUser = await this.client.send('user-find-one', { email: signInData.email }).toPromise();
    const token = await this.client.send('user-login', signInData).toPromise();
    if (!token) {
      throw {
        message: 'Wrong credentials',
        status: 401,
      }
    } else {
      if (checkUser.status == UserStatusEnum.inactive) {
        throw {
          message: 'Your account is suspended by admin. Please contact the support team.',
          status: 401,
        }
      }
      if (signInData.deviceToken) {
        await this.client.send('user-find-and-update', { conditions: { email: signInData.email }, dataToUpdate: { deviceToken: signInData.deviceToken, deviceType: signInData.deviceType } }).toPromise();
      }
      return {
        token: token.token,
      }
    }
  }

  public async login(data: GoogleFacebookDto): Promise<any> {
    const user = await this.client.send('find-or-create', data).toPromise();
    if (user.user.type === data.type) {
      user.user.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
      return {
        token: user.accessToken,
        profile: user.user,
      };
    } else {
      throw {
        message: 'User with this email already exist',
        status: 400,
      }
    }
  }

  public async sendVerifyCode(userId: string, phoneNumber: string): Promise<any> {
    await this.client.send('user-find-and-update', { conditions: { _id: userId }, dataToUpdate: { isPhoneVerified: false, phoneNumber } }).toPromise();
    await this.verifyCodeRepository.deleteMany({ phone: phoneNumber });
    const verifyCode: IVerifyCode = await this.verifyCodeRepository.create({
      phone: phoneNumber,
      // code: randomize('0', 4),
      code: '1111',
      _id: Types.ObjectId(),
    } as IVerifyCode);
    await this.smsService.sendSms(phoneNumber, 'Your code', verifyCode.code);
    return {
      message: 'success'
    }
  }

  public async sendVerifyEmailCode(userId: string): Promise<any> {
    const user = await this.client.send('user-find-and-update', { conditions: { _id: userId }, dataToUpdate: { isEmailVerified: false } }).toPromise();
    await this.sendVerifyCodeToEmail(user.email)
    return {
      message: 'success'
    }
  }

  public async sendVerifyCodeToEmail(email: string): Promise<any> {
    await this.verifyCodeRepository.deleteMany({ email: email });
    const verifyCode: IVerifyCode = await this.verifyCodeRepository.create({
      email: email,
      code: randomize('0', 4),
      _id: Types.ObjectId(),
    } as IVerifyCode);
    await this.emailService.sendEmail(
      email,
      'Welcome to 3D-PESA',
      `<p>Your veyfication code => ${verifyCode.code}</p>`,
    );
  }

  public async checkEmailVerifyCode(userId: string, code: string): Promise<any> {
    const user = await this.client.send('user-find-one', { _id: userId }).toPromise();
    const verifyCode: IVerifyCode = await this.verifyCodeRepository.findOne({ email: user.email }, []);
    if (verifyCode && (verifyCode.code === code)) {
      await this.client.send('user-find-and-update',
        {
          conditions: { _id: userId },
          dataToUpdate: { isEmailVerified: true }
        }).toPromise();
      await this.verifyCodeRepository.deleteOne({
        _id: verifyCode._id,
      });
      return {
        message: 'success'
      }
    } else {
      throw {
        message: 'Сode entered incorrectly',
        status: 400,
      }
    }
  }

  public async checkVerifyCode(userId: string, code: string): Promise<IUser> {
    const user = await this.client.send('user-find-one', { _id: userId }).toPromise();
    const verifyCode: IVerifyCode = await this.verifyCodeRepository.findOne({ phone: user.phoneNumber }, []);
    if (verifyCode && (verifyCode.code === code)) {
      await this.verifyCodeRepository.deleteOne({
        _id: verifyCode._id,
      });
      const userData = await this.client.send('user-find-and-update',
        {
          conditions: { _id: userId },
          dataToUpdate: { isPhoneVerified: true }
        }).toPromise();
      userData.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
      return userData;
    } else {
      throw {
        message: 'Сode entered incorrectly',
        status: 400,
      }
    }
  }

  public async forgotPassword(email: string): Promise<any> {
    const user = await this.client.send('user-find-one', { email: email }).toPromise();
    if (user) {
      const newPassword = generatePassword(10);
      await this.client.send('user-forgot-password', { _id: user._id, password: newPassword }).toPromise();
      await this.emailService.sendEmail(
        email,
        'New password 3D-PESA',
        `<p>Your new password => ${newPassword}</p>`,
      );
      return {
        message: 'success'
      }
    } else {
      throw {
        message: 'This email does not match any user',
        status: 400,
      }
    }
  }

  public async updatePassword(userId: string, data: any): Promise<IUser> {
    const user = await this.client.send('user-change-password', { _id: userId, oldPassword: data.oldPassword, newPassword: data.newPassword }).toPromise();
    if (user.message) {
      throw user
    }
    user.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
    return user;
  }

  public async updateEmail(userId: string, data: any): Promise<IUser> {
    const user = await this.client.send('user-change-email', { _id: userId, oldEmail: data.oldEmail, newEmail: data.newEmail }).toPromise();
    if (user.message) {
      throw user
    }
    await this.sendVerifyCodeToEmail(data.newEmail);
    user.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
    return user;
  }
}

const generatePassword = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
