import { IsNotEmpty, IsString, Matches, IsMongoId } from 'class-validator';

export class CreateBankDetailDto {
  @IsNotEmpty()
  @IsString()
  accountHolderName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: 'Invalid IFSC Code' })
  ifscCode: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsString()
  branchName?: string;

  @IsNotEmpty()
  @IsMongoId()
  riderId: string;
}
