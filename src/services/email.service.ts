import { Injectable, Logger } from '@nestjs/common';
import sgMail = require('@sendgrid/mail');
import { ConfigService } from './config.services';
@Injectable()
export class EmailService {

  constructor(
    private readonly configService: ConfigService
  ) { }
  public async sendEmail(to: string, subject: string, html: string, from: string = this.configService.get('sender_email')): Promise<any> {
    try {
      sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
      const data = await sgMail.send([{
        to,
        from,
        subject,
        html,
      }]);
      Logger.log(`Function:sendEmail, email:${to}, Code is send`);
    } catch (error) {
      Logger.error(`Function:sendEmail, ${error}, Error sending sms for email`);
    }
  }
}
