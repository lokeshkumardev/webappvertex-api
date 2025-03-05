import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetailSchema } from './schema/bank-details.schema';
import { BankDetailController } from './bank-details.controller';
import { BankDetailService } from './bank-details.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BankDetail', schema: BankDetailSchema },
    ]),
  ],
  providers: [BankDetailService],
  controllers: [BankDetailController],
  exports: [BankDetailService],
})
export class BankDetailModule {}
