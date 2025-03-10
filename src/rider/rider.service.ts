import { Catch, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rider } from './rider.schema/rider.schema';
import { CreateRiderDto } from './dto/create-rider.dto';
import { fileUpload } from 'src/util/fileupload';
import CustomResponse from 'src/common/providers/custom-response.service';
import { User } from 'src/user/interface/user.interface';
import CustomError from 'src/common/providers/customer-error.service';
import { RiderDocument } from './rider.schema/document.schema';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';

@Injectable()
export class RiderService {
  constructor(
    @InjectModel('Rider') private riderModel: Model<Rider>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Document') private documentModel: Model<RiderDocument>,
  ) {}

  async createRider(
    createRiderDto: CreateRiderDto,
    profileImage?: Express.Multer.File,
  ) {
    try {
      // ✅ Profile picture upload
      if (profileImage) {
        const uploadedFileName = fileUpload('profile_pictures', profileImage);
        createRiderDto.profilePicture = `${process.env.SERVER_BASE_URL}/uploads/profile_pictures/${uploadedFileName}`;
      }

      // ✅ Check if Rider already exists
      const existingRider = await this.riderModel.findOne({
        primaryMobileNumber: createRiderDto.primaryMobileNumber,
      });

      if (existingRider) {
        return new CustomResponse(403, 'Rider Already Exists!');
      }

      // ✅ Create Rider with GeoJSON Location
      const newRider = new this.riderModel({
        ...createRiderDto,
        riderLocation: {
          type: 'Point',
          coordinates: [createRiderDto.longitude, createRiderDto.latitude], // Longitude, Latitude
        },
      });

      const rider = await newRider.save();
      return new CustomResponse(200, 'Rider Successfully Created', rider);
    } catch (error) {
      console.error(error);
      throw new CustomError(500, 'Internal Server Error');
    }
  }

  async uploadDocuments(
    uploadDocumentsDto: any,
    files: {
      aadharFront?: Express.Multer.File[];
      aadharBack?: Express.Multer.File[];
      panFront?: Express.Multer.File[];
      drivingLicenseFront?: Express.Multer.File[];
      drivingLicenseBack?: Express.Multer.File[];
    },
  ) {
    try {
      // Check if Rider exists
      const rider = await this.riderModel.findById(uploadDocumentsDto.riderId);
      if (!rider) {
        throw new CustomError(500, 'Invalid Rider ID');
      }

      // Find existing documents for the rider
      let existingDocument = await this.documentModel.findOne({
        riderId: uploadDocumentsDto.riderId,
      });

      // Process file uploads
      if (files?.aadharFront?.[0]) {
        const fileName = fileUpload('documents/aadhar', files.aadharFront[0]);
        uploadDocumentsDto.aadharFront = `${process.env.SERVER_BASE_URL}/uploads/documents/aadhar/${fileName}`;
      }

      if (files?.aadharBack?.[0]) {
        const fileName = fileUpload('documents/aadhar', files.aadharBack[0]);
        uploadDocumentsDto.aadharBack = `${process.env.SERVER_BASE_URL}/uploads/documents/aadhar/${fileName}`;
      }

      if (files?.panFront?.[0]) {
        const fileName = fileUpload('documents/pan', files.panFront[0]);
        uploadDocumentsDto.panFront = `${process.env.SERVER_BASE_URL}/uploads/documents/pan/${fileName}`;
      }

      if (files?.drivingLicenseFront?.[0]) {
        const fileName = fileUpload(
          'documents/dl',
          files.drivingLicenseFront[0],
        );
        uploadDocumentsDto.drivingLicenseFront = `${process.env.SERVER_BASE_URL}/uploads/documents/dl/${fileName}`;
      }

      if (files?.drivingLicenseBack?.[0]) {
        const fileName = fileUpload(
          'documents/dl',
          files.drivingLicenseBack[0],
        );
        uploadDocumentsDto.drivingLicenseBack = `${process.env.SERVER_BASE_URL}/uploads/documents/dl/${fileName}`;
      }

      let savedDocument;
      if (existingDocument) {
        // Update existing document
        savedDocument = await this.documentModel.findOneAndUpdate(
          { riderId: uploadDocumentsDto.riderId },
          { $set: uploadDocumentsDto },
          { new: true }, // Return updated document
        );
      } else {
        // Create new document entry
        const documentData = new this.documentModel(uploadDocumentsDto);
        savedDocument = await documentData.save();
      }

      return new CustomResponse(
        200,
        'Documents uploaded successfully',
        savedDocument,
      );
    } catch (error) {
      console.error('Upload Error:', error);
      throw new CustomError(400, error.message);
    }
  }

  async findAll(status?: string) {
    try {
      const query: any = {};
      if (status) query.status = status; // Optional filtering by status

      const riders = await this.riderModel.find(query).exec();
      if (!riders.length) {
        throw new CustomError(404, 'No Riders Found');
      }

      return new CustomResponse(200, 'Riders Retrieved Successfully', riders);
    } catch (error) {
      throw new CustomError(500, error.message || 'Internal Server Error');
    }
  }
  async getDocuments(riderId: string) {
    try {
      const rider = await this.documentModel.findOne({ riderId: riderId });
      if (!rider) {
        throw new CustomError(404, 'Rider Not Found');
      }
      return new CustomResponse(200, 'Documents retrieved successfully', rider);
    } catch (error) {
      throw new CustomError(500, error.message || 'Internal Server Error');
    }
  }

  async getRider(riderId: string) {
    try {
      const rider = await this.riderModel.findById(riderId);
      if (!rider) {
        throw new CustomError(404, 'Rider Not Found');
      }
      return new CustomResponse(200, 'Rider Retrived Successfully', rider);
    } catch (error) {
      throw new CustomError(500, 'Internal Server Error');
    }
  }

  async updateRider(
    riderId: string,
    updateRiderStatus: any,
    profileImage?: Express.Multer.File,
  ) {
    try {
      if (profileImage) {
        const uploadedFileName = fileUpload('profile_pictures', profileImage);
        updateRiderStatus.profilePicture = `${process.env.SERVER_BASE_URL}/uploads/profile_pictures/${uploadedFileName}`;
      }
      const rider = await this.riderModel.findByIdAndUpdate(
        riderId,
        { $set: updateRiderStatus }, // Ensure DTO is correctly structured
        { new: true, runValidators: true },
      );

      if (!rider) {
        throw new CustomError(404, 'Rider Not Found');
      }

      return new CustomResponse(200, 'Rider Updated Successfully', rider);
    } catch (error) {
      throw new CustomError(500, error.message || 'Internal Server Error');
    }
  }
}
