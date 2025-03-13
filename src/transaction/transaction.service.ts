import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schema/transaction.schema';
import { Wallet } from 'src/wallet/schema/wallet.schema';
import { CreateTransactionDto } from './dto/transaction.dto';
import { throwException } from 'src/util/errorhandling';
import CustomResponse from 'src/common/providers/custom-response.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>, // Inject Wallet model
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<any> {
    try {
      if (createTransactionDto.amount <= 0) {
        throw new CustomResponse(
          400,
          'Transaction amount must be greater than zero',
        );
      }
      // console.log('hiiiiiiii')
      if (
        !createTransactionDto.userId ||
        !createTransactionDto.amount ||
        !createTransactionDto.type
      ) {
        throw new CustomResponse(400, 'Invalid transaction data');
      }

      // Fetch the user's wallet
      const wallet = await this.walletModel.findOne({
        userId: createTransactionDto.userId,
      });
      if (!wallet) {
        throw new CustomResponse(404, 'Wallet not found for this user');
      }

      // Debit or Credit the wallet based on transaction type
      if (createTransactionDto.type === 'debit') {
        if (wallet.balance < createTransactionDto.amount) {
          throw new CustomResponse(400, 'Insufficient balance');
        }
        wallet.balance -= createTransactionDto.amount;
      } else if (createTransactionDto.type === 'credit') {
        wallet.balance += createTransactionDto.amount;
      } else {
        throw new CustomResponse(400, 'Invalid transaction type');
      }

      // Save the updated wallet balance
      await wallet.save();

      // Create the transaction record
      const transaction =
        await this.transactionModel.create(createTransactionDto);
      return new CustomResponse(
        200,
        'Transaction created successfully',
        transaction,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async getTransactionHistory(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new CustomResponse(400, 'User ID is required');
      }

      const transactions = await this.transactionModel
        .find({ userId })
        .sort({ createdAt: -1 });
      if (!transactions.length) {
        throw new CustomResponse(404, 'No transactions found for this user');
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
