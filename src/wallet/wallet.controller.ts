import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AddMoneyDto,DeductMoneyDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('getWalletMoney/:userId/balance')
  async getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Post('addWalletMoney/:userId/add')
  async addMoney(@Param('userId') userId: string, @Body() addMoneyDto: AddMoneyDto) {
    return this.walletService.addMoney(userId, addMoneyDto);
  }

  @Post('deductWalletMoney/:userId/deduct')
  async deductMoney(@Param('userId') userId: string, @Body() deductMoneyDto: DeductMoneyDto) {
    return this.walletService.deductMoney(userId, deductMoneyDto);
  }
}
