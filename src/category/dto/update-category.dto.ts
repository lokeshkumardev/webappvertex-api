import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string; // Optional image path

  @IsString()
  @IsOptional()
  description?: string; // Optional image path
}
