import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class SubscriptionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  planId: string;

  @IsNotEmpty()
  userId: string;
}
