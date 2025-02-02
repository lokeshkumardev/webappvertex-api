// src/dto/category.dto.ts
export class CreateCategoryDTO {
  name: string;
  description: string;
  slug: string;
  web_image?: string[];  // Optional array of strings
  app_image?: string[];  // Optional array of strings
  offer?: string;
  meta_title?: string;
  meta_description?: string;
}

export class UpdateCategoryDTO {
  name?: string;
  description?: string;
  web_image?: string[];  // Optional array of strings
  app_image?: string[];  // Optional array of strings
  offer?: string;
  meta_title?: string;
  meta_description?: string;
  slug: string;
}
