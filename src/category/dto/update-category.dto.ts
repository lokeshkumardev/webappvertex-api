import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  app_image?: string; // Optional image path

  @IsString()
  @IsOptional()
  web_image?: string;

  
}
