import {
  Injectable,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/interface/user.interface'; // Import the User interface
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import CustomError from 'src/common/providers/customer-error.service';

@Injectable()
export class UserService {
  private twilioClient: any;
  private otpStore: { [key: string]: string } = {}; // Temporary in-memory store for OTPs

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async updateLocation(
    userId: string,
    longitude: number,
    latitude: number,
    address?: string,
  ) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new CustomResponse(404, 'User not found');
      }

      // ✅ Location update karein
      user.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      // ✅ Agar address aaya hai toh update karein
      if (address) {
        user.userAddress = address;
      }

      await user.save();
      return new CustomResponse(200, 'Location updated successfully', user);
    } catch (error) {
      throwException(error);
    }
  }

  async updateUserByUserId(userId: string, updateData: Partial<CreateUserDto>) {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new CustomResponse(404, 'User not found');
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, updateData, {
          new: true,
          runValidators: true,
        })
        .exec();

      return new CustomResponse(200, 'User updated successfully', updatedUser);
    } catch (error) {
      throwException(error);
    }
  }

  // // Find a user by phone number
  // async findByPhone(phone: string): Promise<User | null> {
  //   return this.userModel.findOne({ userPhone: phone }).exec();
  // }

  // Find a user by ID
  async findUserById(userId: string) {
    const findUser = await this.userModel.findById(userId).exec();
    if (!findUser) {
      throw new CustomError(404, 'User not found');
    }
    return new CustomResponse(200, 'User Retrieved Successfully', findUser);
  }

  // Find admin by username (example, assuming admins are users with a role)
  // async findAdminByUsername(username: string): Promise<User | null> {
  //   return this.userModel.findOne({ username, isAdmin: true }).exec(); // Assuming `isAdmin` flag
  // }

  // Other user CRUD operations (create, update, delete, etc.)
  async findNearbyUsers(
    longitude: number,
    latitude: number,
    maxDistance = 5000,
  ) {
    try {
      const users = await this.userModel.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: maxDistance, // Default: 5 KM
          },
        },
      });

      if (!users.length) {
        return new CustomResponse(404, 'No Users Found Nearby');
      }

      return new CustomResponse(
        200,
        'Nearby Users Retrieved Successfully',
        users,
      );
    } catch (error) {
      throw new CustomError(500, error.message || 'Internal Server Error');
    }
  }
}
