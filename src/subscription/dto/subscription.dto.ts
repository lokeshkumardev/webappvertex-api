import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsISO8601,
} from 'class-validator';

export class SubscriptionDto {
  @IsNotEmpty()
  @IsString()
  planType: string;

  @IsNotEmpty()
  // @IsNumber()
  // @IsPositive()
  OfferPrice: string;

  @IsNotEmpty()
  // @IsNumber()
  // @IsPositive()
  totalAmount: string;

  @IsNotEmpty()
  planId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  // @IsNumber()
  // @IsPositive()
  validity: string; // 15 or 30 days

  @IsNotEmpty()
  @IsDateString()
  startDate: string; // YYYY-MM-DD format

  @IsNotEmpty()
  @IsDateString()
  endDate: string; // YYYY-MM-DD format

  skippedDays: string[]; // Array of skipped dates
}
