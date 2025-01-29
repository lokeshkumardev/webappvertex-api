import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateRiderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber() // Validates that the phone is a valid phone number format
  @IsNotEmpty()
  phone: string;
}
