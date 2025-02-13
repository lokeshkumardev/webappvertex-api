import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StockStatus } from '../dto/create-inventory.dto'; // Importing the enum

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: StockStatus })
  status: StockStatus;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
