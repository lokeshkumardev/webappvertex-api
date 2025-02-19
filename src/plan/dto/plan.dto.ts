import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class PlanDto {
  // @IsNotEmpty()
  // @IsString()
  // name: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  validity: string;

  // @IsNotEmpty()
  // @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  plan: string; // Breakfast, Lunch, Dinner

  @IsNotEmpty()
  @IsString()
  userType: string;

  @IsNotEmpty()
  @IsString()
  planType: string; // "Golden" or "Silver"

  OfferPrice: number;

  // @IsOptional()
  // @IsString()
  webImage?: string;

  // @IsOptional()
  // @IsString()
  appImage?: string;
}
