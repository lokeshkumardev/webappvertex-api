import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  // orderNumber: string;
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
  specialOffer?: string; // Percentage, default 0

  @IsOptional()
  @IsNumber()
  discount?: string; // Percentage, default 0

  @IsOptional()
  @IsNumber()
  totalQuantity?: string; // Default is 1
}
