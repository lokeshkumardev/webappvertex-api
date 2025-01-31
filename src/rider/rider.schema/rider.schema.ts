import { Schema, Document } from 'mongoose';

// Rider Schema
export const RiderSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fathersName: { type: String, required: true },
  dob: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  secondaryMoibleNumber: { type: String },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  primaryMoibleNumber: { type: String, required: true },
  language: { type: String, required: true },
  profilePicture: { type: String, required: true},
  refferalCode: { type: String, required: true},
  status: { type: String, enum: ['available', 'on_delivery', 'offline'], default: 'available' },
  assignedOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // Orders assigned to the rider
}, { timestamps: true });

export interface Rider extends Document {
  firstName: string;
  lastName: string;
  fathersName: string;
  dob: string;
  whatsappNumber: string;
  secondaryMoibleNumber: string;
  bloodGroup: string;
  city: string;
  primaryMoibleNumber: string;
  language: string;
  phone: string;
  profilePicture:string;
  refferalCode: string;
  status: string;
  assignedOrders: string[];
}
