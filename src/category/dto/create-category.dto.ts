import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() // Add validation for Image field
  @IsNotEmpty()
  image: string; // Changed from 'Image' to 'image' for consistency

  @IsString()
  @IsNotEmpty()
  description: string;
}
