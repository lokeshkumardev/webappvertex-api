import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class RiderTransaction extends Document {
  @Prop({ required: true })
  riderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  type: 'credit' | 'debit';
}

export const RiderTransactionSchema =
  SchemaFactory.createForClass(RiderTransaction);
