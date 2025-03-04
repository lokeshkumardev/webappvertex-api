// order.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from './order.schema/order.schema';
import { SubcategoryModule } from 'src/category/subcategory/subcategory.module'; // Import the Subcategory module
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { RazorpayModule } from 'src/razorpay/razorpay.module';
import { UserModule } from 'src/user/user.module';
import { RiderModule } from 'src/rider/rider.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    SubcategoryModule,
    RazorpayModule,
    UserModule,
    RiderModule, // ✅ Ensure RiderModule is imported
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService, MongooseModule],
})
export class OrderModule {}
