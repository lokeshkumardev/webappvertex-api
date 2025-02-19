import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRiderDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  fathersName: string;

  @IsNotEmpty()
  @IsString()
  dob: string;

  @IsNotEmpty()
  @IsString()
  whatsappNumber: string;

  @IsNotEmpty()
  @IsString()
  bloodGroup: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  primaryMobileNumber: string;

  @IsOptional()
  @IsString()
  secondaryMobileNumber: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  userType: 'rider';

  @IsOptional()
  @IsString()
  referralCode: string;

  @IsNotEmpty()
  @IsString()
  completeAddress: string;
}
