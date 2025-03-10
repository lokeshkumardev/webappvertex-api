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
    status: { type: Boolean, required: true, default: false },

    // ✅ Profile Picture
    profilePicture: { type: String },

    // ✅ User Type
    userType: {
      type: String,
      required: true,
      enum: ['rider'],
      default: 'rider',
    },

    // ✅ Rider Location (GeoJSON)
    riderLocation: {
      type: {
        type: String,
        enum: ['Point'], // GeoJSON type
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true },
);

// ✅ Add Geo Index for location-based queries
RiderSchema.index({ riderLocation: '2dsphere' });

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
  userType: string;

  // ✅ Add location property
  riderLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}
