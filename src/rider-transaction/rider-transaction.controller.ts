import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RiderTransactionService } from './rider-transaction.service';
import { CreateRiderTransactionDto } from './dto/rider-transaction.dto';

@Controller('rider-transaction')
export class RiderTransactionController {
  constructor(
    private readonly riderTransactionService: RiderTransactionService,
  ) {}

  @Post('createRiderTransaction')
  async createRiderTransaction(
    @Body() createRiderTransaction: CreateRiderTransactionDto,
  ) {
    return this.riderTransactionService.createRiderTransaction(
      createRiderTransaction,
    );
  }
  @Get('getRiderTransaction/:riderId')
  async getRiderTransaction(@Param('riderId') riderId: string) {
    return this.riderTransactionService.getRiderTransaction(riderId);
  }
}
