import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderWalletController } from './rider-wallet.controller';
import { RiderWalletService } from './rider-wallet.service';
import { RiderWallet, RiderWalletSchema } from './schema/rider-wallet.schema';
import { RiderTransactionModule } from 'src/rider-transaction/rider-transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RiderWallet.name, schema: RiderWalletSchema },
    ]), // ✅ Fix: Ensure correct model registration
    forwardRef(() => RiderTransactionModule), // ✅ Fix Circular Dependency
  ],
  controllers: [RiderWalletController],
  providers: [RiderWalletService],
  exports: [RiderWalletService, MongooseModule], // ✅ Fix: Ensure MongooseModule is exported
})
export class RiderWalletModule {}
