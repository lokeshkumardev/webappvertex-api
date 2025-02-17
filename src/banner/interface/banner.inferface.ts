import { Document } from 'mongoose';

export interface Banner extends Document {
  readonly title: string;
  readonly description: string;
  readonly bannerImage: any;
  readonly createdAt: Date;
}
