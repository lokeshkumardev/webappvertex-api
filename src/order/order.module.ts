// order.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from './order.schema/order.schema';
import { SubcategoryModule } from 'src/category/subcategory/subcategory.module'; // Import the Subcategory module
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { RazorpayModule } from 'src/razorpay/razorpay.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    SubcategoryModule, // Add the SubcategoryModule here'
    RazorpayModule, // Add the RazorpayService here
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService, MongooseModule],
})
export class OrderModule {}
