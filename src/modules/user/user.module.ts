import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserAuthService } from './services/user-auth.service';
import { SmsService } from '../../services/sms.service';
import { ConfigService } from '../../services/config.services';
import { EmailService } from '../../services/email.service';
import { FileStorageService } from '../../services/file-storage/file-storage.service';
import { RequestToUpdateService } from './services/request-to-update.service';
import { AppModule } from '../../app.module';
import { CardService } from './services/card.service';
import { PushNotificationsService } from '../../services/push-notification/push-notification.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserAuthService,
    SmsService,
    ConfigService,
    EmailService,
    FileStorageService,
    RequestToUpdateService,
    CardService,
    PushNotificationsService
  ],
  exports: [
    UserService,
    RequestToUpdateService,
    CardService
  ],
})
export class UserModule {
}
