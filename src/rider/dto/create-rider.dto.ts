import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

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

  @IsPhoneNumber()
  @IsNotEmpty()
  whatsappNumber: string;

  @IsPhoneNumber()
  @IsOptional()
  secondaryMoibleNumber: string;

  @IsString()
  @IsNotEmpty()
  bloodGroup: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  primaryMoibleNumber: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  profilePicture: string;

  @IsString()
  @IsOptional()
  refferalCode: string;

  userType: string;

  @IsString()
  @IsOptional()
  status: string;
}
