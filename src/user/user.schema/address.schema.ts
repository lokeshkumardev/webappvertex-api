import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) userName: string;
  @Prop({ required: true }) landmark: string;
  @Prop({ required: true }) alternatePhone: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [String], required: true },
  })
  location: { type: string; coordinates: string[] };

  @Prop({ required: true }) userId: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
