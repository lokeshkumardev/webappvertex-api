import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderTransactionController } from './rider-transaction.controller';
import { RiderTransactionService } from './rider-transaction.service';
import { RiderWalletModule } from 'src/rider-wallet/rider-wallet.module';
import {
  RiderTransaction,
  RiderTransactionSchema,
} from './schema/rider-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RiderTransaction.name, schema: RiderTransactionSchema },
    ]), // ✅ Fix: Correct model registration
    forwardRef(() => RiderWalletModule), // ✅ Fix Circular Dependency
  ],
  providers: [RiderTransactionService],
  controllers: [RiderTransactionController],
  exports: [RiderTransactionService, MongooseModule], // ✅ Fix: Ensure MongooseModule is exported
})
export class RiderTransactionModule {}
