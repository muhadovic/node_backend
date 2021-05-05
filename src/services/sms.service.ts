import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from './config.services';
import twilio = require('twilio');

@Injectable()
export class SmsService {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  public async sendSms(phoneNumber: string, subject: string, message: any): Promise<void> {
    const accountSid: string = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken: string = this.configService.get('TWILIO_AUTH_TOKEN');
    const from: string = this.configService.get('TWILIO_SENDER_NUMBER');
    Logger.log(`Function:sendSms, number:${phoneNumber}`);
    const client: twilio.Twilio = twilio(accountSid, authToken);
    client.messages
      .create({
        body: `${subject} => ${message}`,
        from,
        to: `${phoneNumber}`,
      })
      .catch(error => {
        Logger.error(`Function:sendSms, ${error}, Error sending sms for number`);
      });
  }

}
