import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ required: false })
  title: string;

  @Prop({ default: () => new Date() })
  time: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
