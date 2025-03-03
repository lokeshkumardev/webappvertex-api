import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from '../user-profile/schema/user-profile.schema';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import CustomError from 'src/common/providers/customer-error.service';
import { fileUpload } from 'src/util/fileupload';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel('UserProfile')
    private readonly profileModel: Model<UserProfile>,
  ) {}

  async createProfile(dto: CreateUserProfileDto, files: Express.Multer.File[]) {
    const existingProfile = await this.profileModel
      .findOne({ userId: dto.userId })
      .exec();

    if (!dto.userId) {
      throw new ConflictException('userId is required');
    }

    if (existingProfile) {
      throw new ConflictException('Profile with this userId already exists');
    }

    if (files.length > 0) {
      const file = files.find((f) => f.fieldname === 'profilePicture');
      if (file) {
        const fileName = fileUpload('user_Profile', file);
        dto['profilePicture'] =
          `${process.env.SERVER_BASE_URL}uploads/user_Profile/${fileName}`;
      }
    }

    const userProfile = new this.profileModel({
      ...dto,
      profilePicture: dto['profilePicture'],
    });

    await userProfile.save();
    return new CustomResponse(
      200,
      'User Profile Successfully Created',
      userProfile,
    );
  }

  async getProfile(userId: string) {
    const profile = await this.profileModel.findOne({ userId }).lean().exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return new CustomResponse(
      200,
      'User_Profile Retrived Successfully',
      profile,
    );
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserProfileDto,
    files: Express.Multer.File[],
  ) {
    if (files.length > 0) {
      const file = files.find((f) => f.fieldname === 'profilePicture');
      if (file) {
        const fileName = fileUpload('user_Profile', file);
        dto['profilePicture'] =
          `${process.env.SERVER_BASE_URL}uploads/user_Profile/${fileName}`;
      }
    }

    const updatedProfile = await this.profileModel
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            ...dto,
            profilePicture: dto['profilePicture'] || dto.profilePicture,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }

    return new CustomResponse(
      200,
      'User_Profile Update Successfully',
      updatedProfile,
    );
  }

  async deleteProfile(userId: string): Promise<{ message: string }> {
    const result = await this.profileModel.findOneAndDelete({ userId }).exec();
    if (!result) {
      throw new NotFoundException('Profile not found');
    }

    return new CustomResponse(200, 'Profile deleted successfully', result);
  }
}
