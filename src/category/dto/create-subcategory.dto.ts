// src/dto/subcategory.dto.ts

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
  offer?: string;
  categoryId: string;
  userType?: 'daily' | 'permanent';
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
}
