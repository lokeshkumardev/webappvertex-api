import { Schema, Document } from 'mongoose';

export const SubcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    }, // Linking subcategory with category
    categoryType: {
      type: String,
      required: true, // Fixed typo
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      type: [String], // Array of strings
      required: true,
    },

    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Subcategory Interface
export interface Subcategory extends Document {
  name: string;
  category: string; // Category ID this subcategory belongs to
  categoryType: string;
  slug: string;
  images: string[];
  metaTitle: string;
  metaDescription: string;
}
