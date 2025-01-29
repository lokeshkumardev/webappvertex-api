import { IsPhoneNumber } from 'class-validator';

export class GenerateOtpDto {
  @IsPhoneNumber()
  userPhone: string;
}
