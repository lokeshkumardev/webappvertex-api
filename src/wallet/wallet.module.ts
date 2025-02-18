import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    forwardRef(() => TransactionModule), // Fix circular dependency
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService,MongooseModule],
})
export class WalletModule {}
