import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

@Injectable()
export class TwilioService {
  private client: any;

  constructor() {
    // console.log('Starting', process.env)
    const accountSid = process.env.TWILIO_ACCOUNT_SID as string; // Make sure this SID is correct
    const authToken = process.env.TWILIO_AUTH_TOKEN as string; // Make sure this Auth Token is correct

    if (!accountSid || !authToken) {
      throw new Error('Twilio SID or Auth Token is missing');
    }

    this.client = twilio(
      accountSid,
      authToken,
    );

  }

  // Send OTP via Twilio SMS
  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your OTP is ${otp}. Please use it to log in.`;
    await this.client.messages.create({
      body: message,
      from: '+18454724893',
      to: phoneNumber,
    });
  }
}
