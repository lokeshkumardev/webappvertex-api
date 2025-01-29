import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { RiderSchema } from './rider.schema/rider.schema';
import { OrderModule } from '../order/order.module'; // Import OrderModule to use orderService

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rider', schema: RiderSchema }]), OrderModule],
  controllers: [RiderController],
  providers: [RiderService],
  exports:[RiderService]
})
export class RiderModule {}
