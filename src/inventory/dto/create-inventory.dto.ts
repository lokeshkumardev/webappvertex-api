import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;
}
