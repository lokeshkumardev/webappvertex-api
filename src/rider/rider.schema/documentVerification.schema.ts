import { Schema, Types } from 'mongoose';

export const DocumentVerificationSchema = new Schema({
  riderId: { type: Types.ObjectId, required: true, ref: 'Rider' }, // ✅ Ensure ObjectId
  aadharFront: { type: String, required: true },
  panFront: { type: String, required: true },
  aadharBack: { type: String },
  drivingLicenseFront: { type: String },
  drivingLicenseBack: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});
