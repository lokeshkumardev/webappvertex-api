import { IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber()
  userPhone: string;

  @IsString()
  otp: string;
  fcmToken;
}
