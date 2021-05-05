import { ApiImplicitParam, ApiOperation, ApiUseTags, ApiBearerAuth, ApiConsumes, ApiImplicitFile, ApiModelProperty, ApiImplicitBody } from '@nestjs/swagger';
import { Request } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorHandlerHelper } from '../../helpers/error-handler';
import { UserService } from './services/user.service';
import { IUser } from '../../interfaces/user.interface';
import { SignUpDto } from './dto/sign-up.dto';
import { UserAuthService } from './services/user-auth.service';
import { UserAuthGuard } from '../../guard/user-auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { CheckCodeDto } from './dto/check-code.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiImplicitFormData } from '../../helpers/api-implicit-form-data.decorator';
import { GoogleFacebookDto } from './dto/googleFacebook.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FindByRadiusDto } from './dto/find-users.dto';
import { NotificationDto } from './dto/notification.dto';
import { RequestToUpdateService } from './services/request-to-update.service';
import { CreateRequestToUpdateDto } from './dto/create-request-to-update.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { CreateWalletPasswordDto } from './dto/create-wallet-password.dto';
import { UpdateWalletPasswordDto } from './dto/update-wallet-password.dto';
import { CheckWalletPasswordDto } from './dto/check-wallet-password.dto';
import { GetUserPageDto } from './dto/get-users-page.dto';
import { UniqueNickNameDto } from './dto/unique-nick-name.dto';
import { DeleteDto } from '../friends-request/dto/delete.dto';
import { CardService } from './services/card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { IdDto } from '../admin/dto/id.dto';

@ApiUseTags('user')
@Controller('user')

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
    private readonly requestToUpdateService: RequestToUpdateService,
    private readonly cardService: CardService,
  ) {
  }

  @Post('sign-up')
  @ApiOperation({ title: 'User action', description: 'Registration action' })
  public async signUp(@Req() req: Request, @Body() createUserDto: SignUpDto): Promise<IUser> {
    try {
      return await this.userAuthService.signUp(createUserDto);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @Post('sign-in')
  @ApiOperation({ title: 'User action', description: 'Login action' })
  public async signIn(@Req() req: Request, @Body() signInDto: SignInDto): Promise<IUser> {
    try {
      return await this.userAuthService.signIn(signInDto);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Get('getInfoByToken')
  @ApiOperation({ title: 'User action', description: 'User can get his info by passing token in headers.' })
  public async getUserInfoByToken(@Req() req: Request): Promise<any> {
    try {
      return await this.userService.getById(req['user']._id);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('verify/sendCode')
  @ApiOperation({ title: 'User action', description: 'Send verify code' })
  public async sendVerifyCode(@Req() req: Request, @Body() phone: SendCodeDto): Promise<any> {
    try {
      return await this.userAuthService.sendVerifyCode(req['user']._id, phone.phoneNumber);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('verify/checkCode')
  @ApiOperation({ title: 'User action', description: 'Check verify code' })
  public async checkVerifyCode(@Req() req: Request, @Body() code: CheckCodeDto): Promise<IUser> {
    try {
      return await this.userAuthService.checkVerifyCode(req['user']._id, code.code);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('verify/checkEmailCode')
  @ApiOperation({ title: 'User action', description: 'Check verify code' })
  public async checkEmailVerifyCode(@Req() req: Request, @Body() code: CheckCodeDto): Promise<IUser> {
    try {
      return await this.userAuthService.checkEmailVerifyCode(req['user']._id, code.code);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('verify/sendEmailCode')
  @ApiOperation({ title: 'User action', description: 'Send verify code to email' })
  public async sendVerifyCodeEmail(@Req() req: Request): Promise<any> {
    try {
      return await this.userAuthService.sendVerifyEmailCode(req['user']._id);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('update-password')
  @ApiOperation({ title: 'User action', description: 'update password' })
  public async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto): Promise<IUser> {
    try {
      return await this.userAuthService.updatePassword(req['user']._id, body);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('unique-nick-name')
  @ApiOperation({ title: 'User action', description: 'unique nick name' })
  public async uniqueNickName(@Req() req: Request, @Body() body: UniqueNickNameDto): Promise<IUser> {
    try {
      return await this.userService.uniqueNickName(req['user']._id, body.nickName);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('update-email')
  @ApiOperation({ title: 'User action', description: 'update email' })
  public async updateEmail(@Req() req: Request, @Body() body: UpdateEmailDto): Promise<IUser> {
    try {
      return await this.userAuthService.updateEmail(req['user']._id, body);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }


  @Post('forgotPassword')
  @ApiOperation({ title: 'User action', description: 'Forgot password' })
  public async forgotPassword(@Req() req: Request, @Body() email: ForgotPasswordDto): Promise<any> {
    try {
      return await this.userAuthService.forgotPassword(email.email);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ title: 'User action', description: 'Update user info' })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'userFile' })
  @UseInterceptors(FileInterceptor('userFile'))
  @ApiImplicitFormData({ name: 'data', required: false, type: Object })
  @Post('updateUser')
  async updateUser(@Req() req: Request, @Body('data') data, @UploadedFile() userFile: any): Promise<any> {
    try {
      return await this.userService.updateUser(req['user']._id, JSON.parse(data), userFile);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @Post('google-facebook-login')
  @ApiOperation({ title: 'User action', description: 'Registration action' })
  public async googleFacebookLogin(@Req() req: Request, @Body() data: GoogleFacebookDto): Promise<IUser> {
    try {
      return await this.userAuthService.login(data);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('getUserByRadius')
  @ApiOperation({ title: 'User action', description: 'The user can see users near them' })
  public async getUserByRadius(@Req() req: Request, @Body() data: FindByRadiusDto): Promise<IUser> {
    try {
      return await this.userService.getUserByRadius(req['user']._id, data);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('getUsers')
  @ApiOperation({ title: 'User action', description: 'Get users' })
  public async getUsers(@Req() req: Request, @Body() data: GetUserPageDto): Promise<IUser> {
    try {
      return await this.userService.getUsers(req['user']._id, data);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Get('getFriends')
  @ApiOperation({ title: 'User action', description: 'Get user friends' })
  public async getFriends(@Req() req: Request): Promise<any> {
    try {
      return await this.userService.findFriends(req['user']._id);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Patch('notification')
  @ApiOperation({ title: 'User action', description: 'Notification on/off' })
  public async notification(@Req() req: Request, @Body() data: NotificationDto): Promise<any> {
    try {
      return await this.userService.notification(data);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Delete('deleteFriend')
  @ApiOperation({ title: 'User action', description: 'Delete friend from contact' })
  public async deleteFriend(@Req() req: Request, @Body() data: IdDto): Promise<any> {
    try {
      return await this.userService.deleteFriend(req['user']._id, data.id);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Get('getLoveCoin')
  @ApiOperation({ title: 'User action', description: 'Get love coin' })
  public async getUserLoveCoin(@Req() req: Request): Promise<any> {
    try {
      return await this.userService.getLoveCoin(req['user']._id);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('createRequestToUpdate')
  @ApiOperation({ title: 'User action', description: 'Create request to update' })
  public async createRequestToUpdate(@Req() req: Request, @Body() data: CreateRequestToUpdateDto): Promise<any> {
    try {
      return await this.requestToUpdateService.create(req['user']._id, data);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Get('checkRequestToUpdate')
  @ApiOperation({ title: 'User action', description: 'Get requests to update' })
  public async checkRequestToUpdate(@Req() req: Request): Promise<any> {
    try {
      return await this.requestToUpdateService.getAll({ user: req['user']._id });
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Delete('deleteRequestToUpdate')
  @ApiOperation({ title: 'User action', description: 'Delete request to update' })
  public async deleteRequestToUpdate(@Req() req: Request, @Body() data: IdDto): Promise<any> {
    try {
      return await this.requestToUpdateService.delete({ _id: data.id });
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('create-pay-password')
  @ApiOperation({ title: 'User action', description: 'Create pay password' })
  public async createWalletPassword(@Req() req: Request, @Body() data: CreateWalletPasswordDto): Promise<any> {
    try {
      return await this.userService.createWalletPassword(req['user']._id, data.password);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('update-pay-password')
  @ApiOperation({ title: 'User action', description: 'Update pay password' })
  public async updateWalletPassword(@Req() req: Request, @Body() data: UpdateWalletPasswordDto): Promise<any> {
    try {
      return await this.userService.updateWalletPassword(req['user']._id, data.oldPassword, data.newPassword);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('check-pay-password')
  @ApiOperation({ title: 'User action', description: 'Check pay password' })
  public async checkWalletPassword(@Req() req: Request, @Body() data: CheckWalletPasswordDto): Promise<any> {
    try {
      return await this.userService.checkWalletPassword(req['user']._id, data.password);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('create-card')
  @ApiOperation({ title: 'User action', description: 'Create card' })
  public async createCard(@Req() req: Request, @Body() data: CreateCardDto): Promise<any> {
    try {
      return await this.userService.addCard(req['user']._id, data.card);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Delete('delete-card')
  @ApiOperation({ title: 'User action', description: 'Delete card' })
  public async deleteCard(@Req() req: Request, @Body() data: DeleteDto): Promise<any> {
    try {
      return await this.cardService.delete({ _id: data.id });
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }

  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('get-by-id')
  @ApiOperation({ title: 'User action', description: 'Get user by id' })
  public async getById(@Req() req: Request, @Body() data: IdDto): Promise<any> {
    try {
      return await this.userService.getUserById(req['user']._id, data.id);
    } catch (error) {
      throw ErrorHandlerHelper.errorHandler(error, req);
    }
  }
}
