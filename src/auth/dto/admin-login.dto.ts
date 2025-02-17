import { IsEmail,IsString } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  userEmail: string;

  @IsString()
  userPassword: string;
}
