import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsMongoId,
} from 'class-validator';

export class CreateUserProfileDto {
  // @IsNotEmpty()
  // @IsMongoId()
  userId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
