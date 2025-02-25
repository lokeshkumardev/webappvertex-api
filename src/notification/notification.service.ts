import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { settings } from './firebase_config';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class NotificationService implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(settings as admin.ServiceAccount),
    });
  }

  async sendNotification(token: string, title: string, body: string, data?: any) {
    const message = {
      notification: {
        title,
        body,
      },
      token,
      data,
    };

    try {
      const response = await admin.messaging().send(message);
      return new CustomResponse(200,'Successfully sent message:',response)
    } catch (error) {
      throwException(error);
    }
  }
}
