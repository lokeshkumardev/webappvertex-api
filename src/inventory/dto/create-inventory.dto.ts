import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export enum StockStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock',
}

export class CreateInventoryDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price: number;

  @IsEnum(StockStatus)
  @IsOptional()
  status: StockStatus;
}
