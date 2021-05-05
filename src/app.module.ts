import { Module } from '@nestjs/common';
import { Mongoose } from './services/mongoose/mongoose.module';
import { MongooseService } from './services/mongoose/mongoose.service';
import { ConfigService } from './services/config.services';
import { UserModule } from './modules/user/user.module';
import { AdvertisementModule } from './modules/advertisement/advertisement.module';
import { FriendsRequestModule } from './modules/friends-request/friends-request.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { ChatModule } from './modules/chat/chat.module';
import { MarketModule } from './modules/market/market.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './modules/admin/admin.module';
import { FeedModule } from './modules/feed/feed.module';
import { CommentModule } from './modules/comment/comment.module';
import { AfricaFeatureModule } from './modules/africa-feature/africa-feature.module';
import { ShipEngineService } from './services/ship-engine/ship-engine.service';
import { TransferOfFundsModule } from './modules/transfer-of-funds/transfer-of-funds.module';
import { WalletService } from './services/wallet/wallet.service';
import { AdvertisingModule } from './modules/advertising/advertising.module';
import { BartendarTradingModule } from './modules/bartendar-trading/bartendar-trading.module';
import { HyperloopModule } from './modules/hyperloop/hyperloop.module';
import { RepositoryModule } from './repositories/@repository.module';
import { PushNotificationsService } from './services/push-notification/push-notification.service';

const modules = [
  ScheduleModule.forRoot(),
  Mongoose,
  UserModule,
  AdvertisementModule,
  FriendsRequestModule,
  CalendarModule,
  ChatModule,
  MarketModule,
  AdminModule,
  FeedModule,
  CommentModule,
  AfricaFeatureModule,
  TransferOfFundsModule,
  AdvertisingModule,
  BartendarTradingModule,
  HyperloopModule,
  RepositoryModule
];

@Module({
  imports: [
    ...modules
  ],
  controllers: [],
  providers: [
    MongooseService,
    ConfigService,
    ShipEngineService,
    WalletService,
    PushNotificationsService
  ],
  exports: [
    ConfigService,
    ShipEngineService,
    WalletService,
    PushNotificationsService,
    ...modules
  ],
})
export class AppModule {
}

