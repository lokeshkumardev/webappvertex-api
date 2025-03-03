import { Injectable } from '@nestjs/common';
import twilio from 'twilio';
import * as dotenv from 'dotenv';
import CustomError from '../providers/customer-error.service';
dotenv.config({ path: './.env' });

@Injectable()
export class TwilioService {
  private client: any;

  constructor() {
    // console.log('Starting', process.env);
    const accountSid = process.env.TWILIO_ACCOUNT_SID as string; // Make sure this SID is correct
    const authToken = process.env.TWILIO_AUTH_TOKEN as string; // Make sure this Auth Token is correct

    if (!accountSid || !authToken) {
      throw new CustomError(500, 'Twilio SID or Auth Token is missing');
    }

    this.client = twilio(accountSid, authToken);
    console.log(this.client);
  }

  // Send OTP via Twilio SM
  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your TSJ verification code is ${otp}. It will expire in 1 minutes. Do not share this code.`;
    await this.client.messages.create({
      body: message,
      from: process.env.TWILIO_ACCOUNT_PHONE_NUMBER as string,
      to: phoneNumber,
    });
  }
}
