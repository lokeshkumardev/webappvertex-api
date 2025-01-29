import { Schema, Document } from 'mongoose';

export const SubItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  slug: { type: String, required: true, unique: true },  // SEO-friendly slug
  imageUrl: { type: String, required: false },  // Image URL for the sub-item
});

export interface SubItem extends Document {
  name: string;
  description?: string;
  price: number;
  slug: string;
  imageUrl?: string;  // Optional image URL
}

export const MenuItemSchema = new Schema({
  menuName: { type: String, required: true, enum: ['laundry', 'food'] },
  slug: { type: String, required: true, unique: true },  // SEO-friendly slug for main menu
  subItems: [SubItemSchema]
});

export interface MenuItem extends Document {
  menuName: string;
  slug: string;
  subItems: SubItem[];
}
