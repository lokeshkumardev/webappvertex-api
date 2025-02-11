import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  // @IsString()
  // @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  // @IsString()
  // @IsNotEmpty()
  subCategoryId: string; // This references the Subcategory

  @IsOptional()
  @IsNumber()
  specialOffer?: number; // Percentage, default 0

  @IsOptional()
  @IsNumber()
  discount?: number; // Percentage, default 0

  @IsOptional()
  @IsNumber()
  totalQuantity?: number; // Default is 1
}
