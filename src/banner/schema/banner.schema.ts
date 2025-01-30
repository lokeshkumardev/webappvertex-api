import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Banner extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  bannerImage: string;  // Make sure it's not readonly

  @Prop()
  createdAt: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
