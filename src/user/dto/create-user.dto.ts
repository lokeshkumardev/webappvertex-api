import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  userName: string;
  userType: string;
  alternatePhone: string;

  userEmail: string;

  address: string;
  // @IsString()
  userPhone: string;

  userAge: number;

  loginType: string;

  otp: string;

  userPassword: string;
  role: 'user' | 'admin';
  otpExpiration: { type: Date };
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;
}
