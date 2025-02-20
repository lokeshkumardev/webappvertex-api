import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './schema/wallet.schema';
import { TransactionService } from '../transaction/transaction.service';
import { AddMoneyDto, DeductMoneyDto } from './dto/wallet.dto';
import { throwException } from 'src/util/errorhandling';
import CustomResponse from 'src/common/providers/custom-response.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService, // Fix circular dependency
  ) {}

  async getBalance(userId: string) {
    try {
      const wallet = await this.walletModel.findOne({ userId });
      const finalAmount = wallet ? wallet.balance : 0;
      return new CustomResponse(200, 'Fetch Wallet Amount Successfully', {
        wallet_amount: finalAmount,
      });
    } catch (error) {
      throwException(error);
    }
  }

  async addMoney(addMoneyDto: AddMoneyDto) {
    try {
      const userId = addMoneyDto.userId;
      let wallet = await this.walletModel.findOne({ userId });

      if (!wallet) {
        wallet = new this.walletModel({ userId, balance: 0 });
      }
      wallet.balance += addMoneyDto.amount;
      await wallet.save();
      await this.transactionService.createTransaction({
        userId,
        amount: addMoneyDto.amount,
        type: 'credit',
      });

      return new CustomResponse(200, 'Money added successfully', wallet);
    } catch (error) {
      throwException(error);
    }
  }

  async deductMoney(userId: string, deductMoneyDto: DeductMoneyDto) {
    try {
      const wallet = await this.walletModel.findOne({ userId });
      if (!wallet || wallet.balance < deductMoneyDto.amount) {
        throw new CustomResponse(400, 'Insufficient balance');
      }

      wallet.balance -= deductMoneyDto.amount;

      wallet.title = deductMoneyDto.title || 'Amount Deducted';
      wallet.time = new Date();
      await wallet.save();
      await this.transactionService.createTransaction({
        userId,
        amount: deductMoneyDto.amount,
        type: 'debit',
      });

      return new CustomResponse(200, 'Money deducted successfully', wallet);
    } catch (error) {
      throwException(error);
    }
  }
}
