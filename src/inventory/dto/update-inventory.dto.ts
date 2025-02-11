import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateInventoryDto {
  name: string;

  quantity: number;

  description?: string;

  price: number;
}
