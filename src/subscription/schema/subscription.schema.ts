import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ required: true, enum: [15, 30] })
  planDays: number;

  @Prop({ required: true })
  totalAmount: number; // Total price of plan

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
