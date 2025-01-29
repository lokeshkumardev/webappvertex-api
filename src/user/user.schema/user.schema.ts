import { Schema } from 'mongoose';

// Define User schema
export const UserSchema = new Schema(
  {
    userType: { type: String },
    userEmail: { type: String },
    userAddress: { type: String },
    userPhone: { type: String },
    userAge: { type: Number },
    loginType: { type: String },
    userPassword: { type: String },
    otpExpiration: { type: Date },
    otp: { type: String },
    role: { type: String },
  },
  { timestamps: true },
); // Adding timestamps for createdAt and updatedAt
