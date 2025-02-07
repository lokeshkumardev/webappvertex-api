import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from './order.schema/order.schema';
import { SubcategoryModule } from 'src/category/subcategory/subcategory.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    SubcategoryModule, // Ensure this is correctly imported
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
