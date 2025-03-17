import { IsNotEmpty, IsString, IsNumber, IsMongoId } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  alternatePhone: string;

  @IsNotEmpty()
  @IsString()
  landmark: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  // @IsString()
  @IsMongoId()
  userId: string;
}
