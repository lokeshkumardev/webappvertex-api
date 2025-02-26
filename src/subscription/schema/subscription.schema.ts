import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  planType: string;

  @Prop({ type: String, required: true })
  OfferPrice: string;

  @Prop({ required: true, enum: ['7 days', '15 days', '30 days'] })
  validity: string;

  @Prop({ required: true })
  totalAmount: string; // Total price of plan

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [Date], default: [] })
  skippedDays: Date[];

  @Prop({ type: [String], enum: ['breakfast', 'lunch', 'dinner'], default: [] })
  services: string[];
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
