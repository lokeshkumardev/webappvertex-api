import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { StockStatus } from './create-inventory.dto'; // Assuming the enum is defined there

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(StockStatus)
  status?: StockStatus;
}
