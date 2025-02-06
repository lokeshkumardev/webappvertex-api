  import { Schema, Document } from 'mongoose';

  export const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceType: { type: String, enum: ['food', 'laundry'], required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'delivered'], default: 'pending' },
    totalAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },  // Final price after discounts/offers
    totalQuantity: { type: Number, default: 0 },  // Total quantity of products in the order
    address: { type: String, required: true },
    specialOffer: { type: Number, default: 0 }, // Optional field for special offer percentage
    discount: { type: Number, default: 0 },  // Optional field for discount percentage
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
  });

  export interface Order extends Document {
    userId: string;
    serviceType: string;
    status: string;
    totalAmount: number;
    finalAmount: number;
    totalQuantity: number;
    address: string;
    specialOffer?: number;
    discount?: number;
    products: string[];
    riderId: string;
  }
