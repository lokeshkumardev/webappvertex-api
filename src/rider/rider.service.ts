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
      let profilePicture: string | undefined;

      if (profilePicture) {
        const uploadedFileName = fileUpload('profile_pictures', profilePicture);
        profilePicture = `${process.env.SERVER_BASE_URL}/uploads/profile_pictures/${uploadedFileName}`;
      }

      const newRider = new this.riderModel({
        ...createRiderDto,
        profilePicture,
      });

      const existingRider = await this.riderModel.findOne({
        primaryMobileNumber: createRiderDto.primaryMobileNumber,
      });
      if (existingRider) {
        throw new CustomResponse(403, 'Rider Already Exits !');
      }
      const rider = await newRider.save();

      return new CustomResponse(200, 'Rider Successfully Created', rider);
    } catch (error) {
      throw new CustomError(500, 'Internal check Error');
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
      const rider = await this.riderModel.findById(uploadDocumentsDto.riderId);
      if (!rider) {
        throw new CustomError(500, 'Invalid Rider ID');
      }

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

      const documentData = new this.documentModel(uploadDocumentsDto);
      const savedDocument = await documentData.save();

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
        throw new CustomError(404, 'Rider not found');
      }
      return new CustomResponse(200, 'Documents retrieved successfully', rider);
    } catch (error) {
      throw new CustomError(500, error.message || 'Internal Server Error');
    }
  }
}
