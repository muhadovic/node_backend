import { Module } from '@nestjs/common';
import { MongooseService } from './mongoose.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useClass: MongooseService,
        }),
    ],
    controllers: [],
    providers: [
        MongooseService,
    ],
})
export class Mongoose {
}
