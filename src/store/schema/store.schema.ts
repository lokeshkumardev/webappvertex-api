import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StoreDocument = Store & Document;

export enum OrderStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export enum serviceType {
  FOOD = 'food',
  Laundry = 'laundry',
}

@Schema({ timestamps: true })
export class Store {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' }) // ✅ Order reference (optional)
  orderId?: string;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userPhone: string;

  @Prop()
  webImage?: string;

  @Prop()
  appImage?: string;

  @Prop({ required: true })
  customerAddress: string;

  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ required: true, enum: serviceType })
  serviceType: serviceType;

  @Prop({ required: true }) // ✅ **Add orderNumber**
  orderNumber: string;

  @Prop({ required: true }) // ✅ **Add finalAmount**
  finalAmount: number;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
