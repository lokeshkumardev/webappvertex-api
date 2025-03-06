import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankDetail } from './schema/bank-details.schema';
import { CreateBankDetailDto } from './dto/bank-details.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import CustomError from 'src/common/providers/customer-error.service';

@Injectable()
export class BankDetailService {
  constructor(
    @InjectModel('BankDetail')
    private readonly bankDetailModel: Model<BankDetail>,
  ) {}

  async createBankDetail(createBankDetailDto: CreateBankDetailDto) {
    const existingBankDetail = await this.bankDetailModel.findOne({
      accountNumber: createBankDetailDto.accountNumber,
    });

    if (existingBankDetail) {
      throw new CustomError(403, 'Account number already exists');
    }
    const newBankDetail = new this.bankDetailModel(createBankDetailDto);
    const bankDetail = await newBankDetail.save();
    return new CustomResponse(
      200,
      'BankDetails Created Successfully',
      bankDetail,
    );
  }

  async getBankDetailByRiderId(riderId: string) {
    const bankDetail = await this.bankDetailModel
      .findOne({ riderId })
      .select('+accountNumber')
      .exec();
    if (!bankDetail)
      throw new CustomError(404, 'Bank details not found for this rider');
    return new CustomResponse(
      200,
      'BankDetails Retrived Successfully',
      bankDetail,
    );
  }

  async updateBankDetail(
    riderId: string,
    updateData: Partial<CreateBankDetailDto>,
  ) {
    const updatedBankDetail = await this.bankDetailModel
      .findOneAndUpdate({ riderId }, updateData, { new: true })
      .exec();
    if (!updatedBankDetail)
      throw new CustomError(404, 'Bank details not found for update');
    return new CustomResponse(
      200,
      'BankDeatils Updated Successfully',
      updatedBankDetail,
    );
  }

  async deleteBankDetail(riderId: string) {
    const deleted = await this.bankDetailModel
      .findOneAndDelete({ riderId })
      .exec();
    if (!deleted)
      throw new CustomError(404, 'Bank details not found for deletion');
    return new CustomResponse(
      200,
      'Bank details deleted successfully',
      deleted,
    );
  }
}
