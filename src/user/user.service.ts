import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/interface/user.interface'; // Import the User interface
import * as twilio from 'twilio';

@Injectable()
export class UserService {
  private twilioClient: any;
  private otpStore: { [key: string]: string } = {}; // Temporary in-memory store for OTPs

  constructor(@InjectModel('User') private userModel: Model<User>) {
  
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
