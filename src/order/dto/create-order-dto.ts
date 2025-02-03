import { IsString, IsArray, IsNumber, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  @IsMongoId({ each: true })
  products: string[];

  @IsOptional()
  @IsNumber()
  specialOffer?: number;  // Optional: Special offer percentage

  @IsOptional()
  @IsNumber()
  discount?: number;  // Optional: Discount percentage
}
