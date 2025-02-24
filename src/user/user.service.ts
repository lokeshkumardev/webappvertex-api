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

@Injectable()
export class UserService {
  private twilioClient: any;
  private otpStore: { [key: string]: string } = {}; // Temporary in-memory store for OTPs

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    console.log('hiii', this.userModel);
    // Check if user email already exists
    try {
      if (!createUserDto.userEmail) {
        throw new CustomResponse(409, 'Email Field Is Requrired');
      }
      if (!createUserDto.userPassword) {
      } else {
        const userPhone = await this.userModel.findOne({
          userPhone: createUserDto.userPhone,
        });
        if (userPhone) {
          throw new CustomResponse(403, 'userPhone Already Exits');
        }
      }

      const existingUser = await this.userModel.findOne({
        userEmail: createUserDto.userEmail,
      });
      if (existingUser) {
        throw new CustomResponse(403, 'User with this email already exists');
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.userPassword, 10);

      // Create the new user with hashed password
      const newUser = new this.userModel({
        ...createUserDto,
        userPassword: hashedPassword,
      });

      const user = await newUser.save();
      return new CustomResponse(200, 'success', user);
    } catch (error) {
      // console.log('error', error);
      throwException(error);
    }
  }

  // Find a user by phone number
  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ userPhone: phone }).exec();
  }

  // Find a user by ID
  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  // Find admin by username (example, assuming admins are users with a role)
  async findAdminByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username, isAdmin: true }).exec(); // Assuming `isAdmin` flag
  }

  // Other user CRUD operations (create, update, delete, etc.)
}
