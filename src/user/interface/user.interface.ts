import { Document } from 'mongoose';

// User document interface (for TypeScript type safety)
export interface User extends Document {
  userName: string;
  userType: string;
  userEmail: string;
  userAddress: string;
  userPhone: string;
  userAge: number;
  loginType: string;
  userPassword: string;
  otp: string;
  otpExpiration: Date; // Assuming password will be a string
  role: 'user' | 'admin';
}
