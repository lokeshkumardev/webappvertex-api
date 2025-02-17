import { IsString, IsOptional, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateSubcategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsOptional()
  category?: string; // Optionally update category

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  categoryType: string;

  @IsString()
  @IsOptional()
  app_image?: string[]; // Optional image path

  @IsString()
  @IsOptional()
  web_image?: string[];

  @IsOptional()
  @IsString()
  metaTitle: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;
}
