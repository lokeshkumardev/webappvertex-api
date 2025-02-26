import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Plan extends Document {
  // @Prop({ required: true })
  // name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  planDays: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Laundry'] })
  plan: string;

  @Prop({ reuired: true, default: 'permanent' })
  userType: string;

  @Prop({ required: true, enum: ['Golden', 'Silver'] })
  planType: string;

  // @Prop({ type: Types.ObjectId, ref: 'SubCategory', required: true })
  // subCategoryId: Types.ObjectId;
  @Prop({ required: true })
  OfferPrice: number;

  @Prop()
  webImage: string;

  @Prop()
  appImage: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
