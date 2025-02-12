import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import * as dotenv from 'dotenv';
import CustomError from '../providers/customer-error.service';
dotenv.config({ path: './.env' });

@Injectable()
export class TwilioService {
  private client: any;

  constructor() {
    // console.log('Starting', process.env)
    const accountSid = process.env.TWILIO_ACCOUNT_SID as string; // Make sure this SID is correct
    const authToken = process.env.TWILIO_AUTH_TOKEN as string; // Make sure this Auth Token is correct

    if (!accountSid || !authToken) {
      throw new CustomError(500, 'Twilio SID or Auth Token is missing');
    }

    this.client = twilio(accountSid, authToken);
    console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
  }

  // Send OTP via Twilio SMS
  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your OTP is ${otp}. Please use it to log in.`;
    await this.client.messages.create({
      body: message,
      from: process.env.TWILIO_ACCOUNT_PHONE_NUMBER as string,
      to: phoneNumber,
    });
  }
}
