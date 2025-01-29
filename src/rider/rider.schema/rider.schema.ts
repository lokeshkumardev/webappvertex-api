import { Schema, Document } from 'mongoose';

// Rider Schema
export const RiderSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'on_delivery', 'offline'], default: 'available' },
  assignedOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // Orders assigned to the rider
}, { timestamps: true });

export interface Rider extends Document {
  name: string;
  phone: string;
  status: string;
  assignedOrders: string[];
}
