import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || '',
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || '',
    });
  }

  async createOrder(amount: number, currency: string = 'INR') {
    const options = {
      amount: amount * 100, // Amount in paisa
      currency,
      payment_capture: 1,
    };

    try {
      return await this.razorpay.orders.create(options);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
