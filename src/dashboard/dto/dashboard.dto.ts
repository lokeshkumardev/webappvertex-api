import { IsOptional, IsDateString } from 'class-validator';

export class DashboardDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
