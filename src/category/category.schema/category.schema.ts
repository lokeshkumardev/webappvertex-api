// src/category/category.schema/category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the Category interface
export interface ICategory {
  name: string;
  description: string;
  web_image?: string[]; // Marked as optional
  app_image?: string[]; // Marked as optional
  offer?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  averageRating?: number;
}

// Define the Category Schema using Mongoose decorators
@Schema()
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: false }) // Marked as optional
  web_image?: string[];

  @Prop({ type: [String], required: false }) // Marked as optional
  app_image?: string[];

  @Prop({ required: false }) // Optional field
  offer?: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: false })
  meta_title?: string;

  @Prop({ required: false })
  meta_description?: string;

  @Prop({ default: 0 })
  averageRating: number;
}

// Create the Mongoose Schema for the Category class
export const CategorySchema = SchemaFactory.createForClass(Category);
