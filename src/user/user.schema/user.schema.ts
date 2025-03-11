import { Schema } from 'mongoose';

// Define User schema
export const UserSchema = new Schema(
  {
    userName: { type: String },
    userType: { type: String },
    userEmail: { type: String },
    userAddress: { type: String },
    userPhone: { type: String },
    alternatePhone: { type: String },
    userAge: { type: Number },
    loginType: { type: String },
    userPassword: { type: String },
    otpExpiration: { type: Date },
    otp: { type: String },
    role: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [String], default: [0, 0] }, // Default to (0,0)
    },
  },
  { timestamps: true },
); // Adding timestamps for createdAt and updatedAt
