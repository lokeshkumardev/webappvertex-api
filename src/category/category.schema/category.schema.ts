import { Schema, Document } from 'mongoose';

export interface Category extends Document {
  name: string;
  image: string;
  description: string;
}

export const CategorySchema = new Schema<Category>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});
