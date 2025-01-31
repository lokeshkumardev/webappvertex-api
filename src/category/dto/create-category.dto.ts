import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

 
  image: string; // Changed from 'Image' to 'image' for consistency

  @IsString()
  @IsNotEmpty()
  description: string;
}
