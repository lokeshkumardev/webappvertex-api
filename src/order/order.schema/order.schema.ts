import { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    riderId: { type: Types.ObjectId, ref: 'Rider', default: null },
    serviceType: { type: String, enum: ['food', 'laundry'], required: true },

    totalAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true }, // Final amount after discount and offers
    totalQuantity: { type: Number, default: 1 },
    address: { type: String, required: true },

    specialOffer: { type: Number, default: 0 }, // Percentage
    discount: { type: Number, default: 0 }, // Percentage
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed'],
      default: 'pending',
    },

    // ✅ User Location (Proper GeoJSON Format)
    userLocation: {
      type: {
        type: String,
        enum: ['Point'], // Ensure type is always "Point"
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true, // Ensure it's always provided
      },
    },

    orderNumber: { type: String, unique: true, default: 0 },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// ✅ Geospatial Index for Searching Riders Nearby
OrderSchema.index({ userLocation: '2dsphere' });

export interface Order extends Document {
  userId: string;
  orderNumber: string;
  riderId?: string | null;
  serviceType: string;
  totalAmount: number;
  finalAmount: number;
  totalQuantity: number;
  address: string;
  specialOffer?: number;
  discount?: number;
  subCategoryId: string;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  userLocation: {
    type: 'Point';
    coordinates: [number, number]; // Ensure it's always [longitude, latitude]
  };
}
