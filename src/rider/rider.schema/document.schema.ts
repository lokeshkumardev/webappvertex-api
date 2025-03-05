import { Schema, Document as MongooseDocument } from 'mongoose';

export const documentSchema = new Schema({
  riderId: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
  aadharFront: { type: String, default: null },
  panFront: { type: String, default: null },
  aadharBack: { type: String, default: null },
  drivingLicenseFront: { type: String, default: null },
  drivingLicenseBack: { type: String, default: null },
  status: { type: Boolean, default: false },
});

export interface RiderDocument extends MongooseDocument {
  riderId: string;
  aadharFront: string;
  panFront: string;
  aadharBack: string;
  drivingLicenseFront: string;
  drivingLicenseBack: string;
  status: boolean;
}
