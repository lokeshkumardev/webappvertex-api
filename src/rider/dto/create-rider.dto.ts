import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateRiderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  fathersName: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsString()
  @IsNotEmpty()
  bloodGroup: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  primaryMobileNumber: string;

  @IsOptional()
  @IsString()
  secondaryMobileNumber?: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsString()
  @IsNotEmpty()
  completeAddress: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;
}
