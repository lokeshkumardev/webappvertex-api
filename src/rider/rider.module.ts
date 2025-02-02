import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { RiderSchema } from './rider.schema/rider.schema';
import { OrderModule } from '../order/order.module';
import { UserModule } from 'src/user/user.module'; // Import UserModule to use UserModel

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rider', schema: RiderSchema }]),
    OrderModule, // Import OrderModule to use OrderService
    UserModule,  // Import UserModule to use UserModel
  ],
  controllers: [RiderController],
  providers: [RiderService],
  exports: [RiderService], // Export RiderService if other modules need to use it
})
export class RiderModule {}
