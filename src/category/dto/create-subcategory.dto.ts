import { IsString, IsNotEmpty, IsMongoId, IsArray } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  category: string; // The category this subcategory belongs to

  @IsString()
  @IsNotEmpty()
  categoryType: string; // Subcategory type

  @IsString()
  @IsNotEmpty()
  slug: string; // Unique identifier for the subcategory

  // @IsArray()
  images: string[]; // Array of image URLs

  @IsString()
  @IsNotEmpty()
  metaTitle: string;

  @IsString()
  @IsNotEmpty()
  metaDescription: string;
}
