import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiderWallet } from './schema/rider-wallet.schema';
import { RiderTransactionService } from '../rider-transaction/rider-transaction.service';
import { AddMoneyDto, DeductMoneyDto } from './dto/rider-wallet.dto';
import { throwException } from 'src/util/errorhandling';
import CustomResponse from 'src/common/providers/custom-response.service';

@Injectable()
export class RiderWalletService {
  constructor(
    @InjectModel(RiderWallet.name) private riderWalletModel: Model<RiderWallet>,
    @Inject(forwardRef(() => RiderTransactionService))
    private riderTransactionService: RiderTransactionService, // Fix circular dependency
  ) {}

  async getBalance(riderId: any) {
    try {
      const wallet = await this.riderWalletModel.findOne({ riderId });
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
      const riderId = addMoneyDto.riderId;
      let wallet = await this.riderWalletModel.findOne({ riderId });

      if (!wallet) {
        wallet = new this.riderWalletModel({ riderId, balance: 0 });
      }
      wallet.balance += addMoneyDto.amount;
      await wallet.save();
      await this.riderTransactionService.createRiderTransaction({
        riderId,
        amount: addMoneyDto.amount,
        type: 'credit',
      });

      return new CustomResponse(200, 'Money added successfully', wallet);
    } catch (error) {
      throwException(error);
    }
  }

  async deductMoney(riderId: any, deductMoneyDto: DeductMoneyDto) {
    try {
      const wallet = await this.riderWalletModel.findOne({ riderId });
      if (!wallet || wallet.balance < deductMoneyDto.amount) {
        throw new CustomResponse(400, 'Insufficient balance');
      }

      wallet.balance -= deductMoneyDto.amount;

      wallet.title = deductMoneyDto.title || 'Amount Deducted';
      wallet.time = new Date();
      await wallet.save();
      await this.riderTransactionService.createRiderTransaction({
        riderId,
        amount: deductMoneyDto.amount,
        type: 'debit',
      });

      return new CustomResponse(200, 'Money deducted successfully', wallet);
    } catch (error) {
      throwException(error);
    }
  }
}
