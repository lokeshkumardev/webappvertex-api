import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RiderWalletService } from './rider-wallet.service';
import { AddMoneyDto, DeductMoneyDto } from './dto/rider-wallet.dto';

@Controller('rider-wallet')
export class RiderWalletController {
  constructor(private readonly RiderWalletService: RiderWalletService) {}

  @Get('getWalletMoney/balance/:riderId')
  async getBalance(@Param('riderId') riderId: string) {
    return this.RiderWalletService.getBalance(riderId);
  }

  @Post('addWalletMoney/add')
  async addMoney(@Body() addMoneyDto: AddMoneyDto) {
    return this.RiderWalletService.addMoney(addMoneyDto);
  }

  @Post('deductWalletMoney/deduct/:riderId')
  async deductMoney(
    @Param('riderId') riderId: string,
    @Body() deductMoneyDto: DeductMoneyDto,
  ) {
    return this.RiderWalletService.deductMoney(riderId, deductMoneyDto);
  }
}
