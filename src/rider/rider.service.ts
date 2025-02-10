import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rider } from './rider.schema/rider.schema';
import { OrderService } from '../order/order.service'; // Import order service to update orders when assigning a rider
import { User } from 'src/user/interface/user.interface'; // Import User model
import CustomResponse from 'src/common/providers/custom-response.service';

@Injectable()
export class RiderService {
  constructor(
    @InjectModel('Rider') private riderModel: Model<Rider>,
    @InjectModel('User') private userModel: Model<User>, // Inject OrderService to assign rider to orders
  ) {}

  // Create a new rider
  async createRider(createRiderDto: any): Promise<Rider> {
    // Check if user exists based on phone number
    const user = await this.userModel.findOne({ phone: createRiderDto.phone });
    if (!user) {
      throw new CustomResponse(404, 'User not found');
    }

    // Check if rider already exists
    const existingRider = await this.riderModel.findOne({
      phone: createRiderDto.phone,
    });
    if (existingRider) {
      throw new CustomResponse(403, 'User already registered as a rider');
    }

    // Map user ID to rider and create entry
    const newRider = new this.riderModel({
      ...createRiderDto,
      userId: user._id,
    });
    return newRider.save();
  }

  // Get all riders
  async getAllRiders(): Promise<Rider[]> {
    return this.riderModel.find().exec();
  }

  // Get rider by ID
  async getRiderById(riderId: string): Promise<Rider | null> {
    return this.riderModel.findById(riderId).populate('assignedOrders').exec();
  }

  // Update rider status (e.g., available, on_delivery, offline)
  async updateRiderStatus(
    riderId: string,
    status: string,
  ): Promise<Rider | null> {
    return this.riderModel
      .findByIdAndUpdate(riderId, { status }, { new: true })
      .exec();
  }
}
