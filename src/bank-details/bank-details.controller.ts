import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BankDetailService } from './bank-details.service';
import { CreateBankDetailDto } from './dto/bank-details.dto';

@Controller('bank-details')
export class BankDetailController {
  constructor(private readonly bankDetailService: BankDetailService) {}

  @Post()
  async createBankDetail(@Body() createBankDetailDto: CreateBankDetailDto) {
    return this.bankDetailService.createBankDetail(createBankDetailDto);
  }

  @Get(':riderId')
  async getBankDetail(@Param('riderId') riderId: string) {
    return this.bankDetailService.getBankDetailByRiderId(riderId);
  }

  @Put(':riderId')
  async updateBankDetail(
    @Param('riderId') riderId: string,
    @Body() updateData: Partial<CreateBankDetailDto>,
  ) {
    return this.bankDetailService.updateBankDetail(riderId, updateData);
  }

  @Delete(':riderId')
  async deleteBankDetail(@Param('riderId') riderId: string) {
    return this.bankDetailService.deleteBankDetail(riderId);
  }
}
