import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AddMoneyDto, DeductMoneyDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('getWalletMoney/balance/:userId')
  async getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Post('addWalletMoney/add')
  async addMoney(@Body() addMoneyDto: AddMoneyDto) {
    return this.walletService.addMoney(addMoneyDto);
  }

  @Post('deductWalletMoney/deduct/:userId')
  async deductMoney(
    @Param('userId') userId: string,
    @Body() deductMoneyDto: DeductMoneyDto,
  ) {
    return this.walletService.deductMoney(userId, deductMoneyDto);
  }
}
