import { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface UserProfile extends Document {
  userId: Types.ObjectId;
  name?: string;
  userEmail?: string;
  userAddress?: string;
  userPhone?: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserProfileSchema = new Schema<UserProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, trim: true },
    userEmail: { type: String, trim: true, lowercase: true },
    userAddress: { type: String, trim: true },
    userPhone: { type: String, trim: true },
    profilePicture: { type: String },
  },
  { timestamps: true },
);
