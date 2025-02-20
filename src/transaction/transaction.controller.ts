import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/transaction.dto';
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('createTrans')
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get('getTrans/history/:userId')
  async getTransactionHistory(@Param('userId') userId: string) {
    return this.transactionService.getTransactionHistory(userId);
  }
}
