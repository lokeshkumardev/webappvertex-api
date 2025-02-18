import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule

@Module({
  imports: [ConfigModule],  // Import ConfigModule to inject ConfigService
  providers: [RazorpayService],
  exports: [RazorpayService],  // Export RazorpayService so it can be used in other modules
})
export class RazorpayModule {}
