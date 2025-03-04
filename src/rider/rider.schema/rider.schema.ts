import { Schema, Document } from 'mongoose';

export const RiderSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fathersName: { type: String, required: true },
    dob: { type: String, required: true },
    whatsappNumber: { type: String },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    primaryMobileNumber: { type: String, unique: true, required: true },
    secondaryMobileNumber: { type: String },
    language: { type: String, required: true },
    referralCode: { type: String },
    completeAddress: { type: String, required: true },
    status: { type: Boolean, required: true },

    // Profile Picture
    profilePicture: { type: String },

    userType: {
      type: String,
      required: true,
      enum: ['rider'],
      default: 'rider',
    },
  },
  { timestamps: true },
);

export interface Rider extends Document {
  firstName: string;
  lastName: string;
  fathersName: string;
  dob: string;
  whatsappNumber: string;
  bloodGroup: string;
  city: string;
  primaryMobileNumber: string;
  secondaryMobileNumber: string;
  language: string;
  referralCode: string;
  completeAddress: string;
  profilePicture?: string;
  status: boolean;
}
