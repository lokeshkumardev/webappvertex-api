import { Schema, Document, Types } from 'mongoose';

export interface BankDetail extends Document {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  riderId: Types.ObjectId;
}

export const BankDetailSchema = new Schema<BankDetail>(
  {
    accountHolderName: { type: String, required: true, trim: true },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      select: false,
    }, // Hidden by default
    ifscCode: {
      type: String,
      required: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/, // ✅ IFSC Code Validation
    },
    bankName: { type: String, required: true, trim: true },
    branchName: { type: String, trim: true },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
      index: true,
    }, // Indexed for faster lookup
  },
  { timestamps: true },
);
