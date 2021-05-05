import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };
    private readonly env: string = '';

    constructor() {
        if (process.env.NODE_ENV) {
            this.env = process.env.NODE_ENV;
        }
        this.envConfig = dotenv.parse(fs.readFileSync(`configs/${this.env}.env`));
    }

    get(key: any): any {
        return this.envConfig[key];
    }
}
