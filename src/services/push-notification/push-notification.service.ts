import { Injectable } from '@nestjs/common';
var FCM = require('fcm-node');
var serverKey = 'AAAAvv0Y5Dk:APA91bGjqLFytOsy7wPngeuBftJaNQjjCY_SDM7N3qAL4WrXVXgM8kBwOCMUlu-irDHwykNKSQxaGP4WznVQAB6p-NPAVKglBFaR_kSb5A0G3FvYlTjTURAOqSQekuLEM6ukOEa6RXYj';
var fcm = new FCM(serverKey);

@Injectable()
export class PushNotificationsService {

  constructor(
  ) {
  }

  // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
  //   to: 'registration_token',
  //   collapse_key: 'your_collapse_key',

  //   notification: {
  //     title: 'Title of your push notification',
  //     body: 'Body of your push notification'
  //   },

  //   data: {  //you can send only notification or only data(or include both)
  //     my_key: 'my value',
  //     my_another_key: 'my another value'
  //   }
  // };


  public async sendMessage(message): Promise<any> {
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
        return err
      } else {
        console.log("Successfully sent with response: ", response);
        return response;
      }
    });
  }
}
