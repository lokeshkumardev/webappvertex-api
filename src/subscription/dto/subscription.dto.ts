import { 
  IsMongoId, 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsPositive, 
  IsDateString, 
  IsArray, 
  ArrayNotEmpty ,
  IsISO8601
} from 'class-validator';

export class SubscriptionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  planId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  planDays: number; // 15 or 30 days

  @IsNotEmpty()
  @IsDateString()
  startDate: string; // YYYY-MM-DD format

  @IsNotEmpty()
  @IsDateString()
  endDate: string; // YYYY-MM-DD format


  skippedDays: string[]; // Array of skipped dates
}
