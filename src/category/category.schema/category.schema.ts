// src/category/category.schema/category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the Category interface
export interface ICategory {
  name: string;
  description: string;
  web_image?: string[];
  app_image?: string[];
  offer?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  averageRating?: number;
  is_published?: boolean; // New field for publish/unpublish
  categoryType?: string;
}

// Define the Category Schema using Mongoose decorators
@Schema({ timestamps: true }) // Enables automatic createdAt and updatedAt fields
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: false })
  web_image?: string[];

  @Prop({ type: [String], required: false })
  app_image?: string[];

  @Prop({ required: false })
  offer?: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: false })
  meta_title?: string;

  @Prop({ required: false })
  meta_description?: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: false }) // Default to unpublished
  is_published: boolean;
  
  @Prop({ required: false })
  categoryType?: string;
}

// Create the Mongoose Schema for the Category class
export const CategorySchema = SchemaFactory.createForClass(Category);
