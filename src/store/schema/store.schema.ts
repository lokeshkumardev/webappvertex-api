import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userPhone: string;

  @Prop({ required: true })
  storeId: string;

  @Prop()
  webImage?: string;

  @Prop()
  appImage?: string;

  @Prop({ required: true })
  pickupCenterName: string;

  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ required: true, enum: serviceType })
  serviceType: serviceType;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
