import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RiderTransaction } from './schema/rider-transaction.schema';
import { Model } from 'mongoose';
import CustomError from 'src/common/providers/customer-error.service';
import CustomResponse from 'src/common/providers/custom-response.service';
import { CreateRiderTransactionDto } from './dto/rider-transaction.dto';
import { RiderWallet } from 'src/rider-wallet/schema/rider-wallet.schema';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class RiderTransactionService {
  constructor(
    @InjectModel(RiderTransaction.name)
    private riderTransaction: Model<RiderTransaction>,
    @InjectModel(RiderWallet.name) private riderWalletModel: Model<RiderWallet>,
  ) {}

  async createRiderTransaction(
    createRiderTransactionDto: CreateRiderTransactionDto,
  ) {
    const wallet = await this.riderWalletModel.findOne({
      riderId: createRiderTransactionDto.riderId,
    });

    if (!wallet) {
      throw new CustomResponse(404, 'Wallet not found for this Rider');
    }
    if (createRiderTransactionDto.amount <= 0) {
      throw new CustomError(400, 'Amount Is insufficient');
    }
    if (
      !createRiderTransactionDto.riderId ||
      !createRiderTransactionDto.amount ||
      !createRiderTransactionDto.type
    ) {
      throw new CustomResponse(400, 'Invalid transaction data');
    }

    if (createRiderTransactionDto.type === 'debit') {
      if (wallet.balance < createRiderTransactionDto.amount) {
        throw new CustomResponse(400, 'Insufficient balance');
      }
      wallet.balance -= createRiderTransactionDto.amount;
    } else if (createRiderTransactionDto.type === 'credit') {
      wallet.balance += createRiderTransactionDto.amount;
    } else {
      throw new CustomResponse(400, 'Invalid transaction type');
    }

    await wallet.save();
    const transaction = await this.riderTransaction.create(
      createRiderTransactionDto,
    );
    return new CustomResponse(
      200,
      'Transaction created successfully',
      transaction,
    );
  }
  catch(error) {
    throwException(error);
  }

  async getRiderTransaction(riderId: string) {
    try {
      if (!riderId) {
        throw new CustomResponse(400, 'Rider ID is required');
      }

      const transactions = await this.riderTransaction
        .find({ riderId })
        .sort({ createdAt: -1 });
      if (!transactions.length) {
        throw new CustomResponse(404, 'No transactions found for this Rider');
      }

      return new CustomResponse(
        200,
        'Transaction history retrieved successfully',
        transactions,
      );
    } catch (error) {
      throwException(error);
    }
  }
}
