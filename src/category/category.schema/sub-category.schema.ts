// src/models/sub-category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubcategoryDocument = Subcategory & Document;

@Schema()
export class Subcategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  slug: string;

  @Prop({ type: [String], required: false }) // Marked as optional
  web_image?: string[];

  @Prop({ type: [String], required: false }) // Marked as optional
  app_image?: string[];

  @Prop()
  price: number;

  @Prop()
  rating: number;

  @Prop()
  offer: string;

  @Prop({ required: true })
  categoryId: string; // Make sure this is the correct reference field type

  @Prop({ required: true, enum: ['daily', 'permanent'] })
  userType: 'daily' | 'permanent';

  @Prop()
  meta_title: string;

  @Prop()
  meta_description: string;

  @Prop()
  is_published?: boolean;

  @Prop({
    type: [
      {
        roti: String,
        price: String,
      },
    ],
    default: [],
  })
  ExtraMeal?: { roti: string; price: string }[];
}

// Export the Mongoose schema
export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
