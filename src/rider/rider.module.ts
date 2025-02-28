import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { Rider } from './rider.schema/rider.schema';
import { RiderSchema } from './rider.schema/rider.schema';
import { UserModule } from 'src/user/user.module';
import { documentSchema } from './rider.schema/document.schema';
// import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rider', schema: RiderSchema }]),
    MongooseModule.forFeature([{ name: 'Document', schema: documentSchema }]),
    UserModule,
    // DocumentModule,
  ],
  controllers: [RiderController],
  providers: [RiderService],
  exports: [RiderService, MongooseModule],
})
export class RiderModule {}
