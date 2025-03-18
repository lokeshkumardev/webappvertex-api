// src/dto/subcategory.dto.ts
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LaundryItemDTO {
  itemName: string;
  count: number;
  price: number;
}
export class CreateSubcategoryDTO {
  name: string;
  description: string;
  slug: string;
  web_image?: string[]; // Separate for web images
  app_image?: string[]; // Separate for app images
  price?: number;
  rating?: number;
  ExtraMeal?: {
    roti: string;
    price: string;
  }[];
  offer?: string;
  categoryId: string;
  userType: 'daily' | 'permanent';
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
  serviceType?: string;

  @IsOptional()
  @Type(() => LaundryItemDTO) // 👈 Ensure proper transformation
  laundryItems?: LaundryItemDTO[];
}

export class UpdateSubcategoryDTO {
  name?: string;
  description?: string;
  slug?: string;
  web_image?: string[]; // Separate for web images
  app_image?: string[]; // Separate for app images
  price?: number;
  rating?: number;
  ExtraMeal?: {
    roti: string;
    price: string;
  }[];

  laundryItems?: {
    itemName: string;
    count: string;
    price: string;
  }[];
  offer?: string;
  categoryId: string;
  userType?: 'daily' | 'permanent';
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
  categoryType?: string;
}
