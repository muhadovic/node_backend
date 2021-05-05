import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config.services';
import { MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class MongooseService {
    private readonly mongodbUri: string;
    private readonly mongodbName: string;
    private configService: ConfigService = new ConfigService();

    constructor() {
        this.mongodbUri = this.configService.get('mongodb_uri');
        this.mongodbName = this.configService.get('mongodb_name');
    }

    createMongooseOptions(): MongooseModuleOptions {
        return {
            uri: `${this.mongodbUri}/${this.mongodbName}`,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        };
    }
}
