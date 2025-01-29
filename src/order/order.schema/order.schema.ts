import { Schema, Document } from 'mongoose';

export const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  serviceType: { type: String, enum: ['food', 'laundry'], required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'delivered'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
});

export interface Order extends Document {
  userId: string;
  serviceType: string;
  status: string;
  totalAmount: number;
  address: string;
  products: string[];
  riderId: string;
}
