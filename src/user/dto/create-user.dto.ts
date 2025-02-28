import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  userName: string;
  userType: string;

  userEmail: string;

  userAddress: string;
  @IsString()
  userPhone: string;

  userAge: number;

  loginType: string;

  otp: string;

  userPassword: string;
  role: 'user' | 'admin';
  otpExpiration: { type: Date };
}
