import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StockStatus } from '../dto/create-inventory.dto'; // Importing the enum

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false, min: 0 })
  quantity: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
