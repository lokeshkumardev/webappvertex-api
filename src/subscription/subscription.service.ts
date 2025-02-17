import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionDto } from './dto/subscription.dto'; // Assuming you have a DTO for subscription
import CustomError from 'src/common/providers/customer-error.service';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  // Method to create and save a new subscription
  async createSubscription(subscriptionDto: SubscriptionDto) {
    try {
      // Validate planId and userId are ObjectIds
      if (
        !Types.ObjectId.isValid(subscriptionDto.planId) ||
        !Types.ObjectId.isValid(subscriptionDto.userId)
      ) {
        throw new CustomError(500, 'Invalid planId or userId');
      }

      const newSubscription = new this.subscriptionModel({
        ...subscriptionDto,
        planId: new Types.ObjectId(subscriptionDto.planId),
        userId: new Types.ObjectId(subscriptionDto.userId),
      });

      const savedSubscription = await newSubscription.save();
      const saveData = await savedSubscription;
      return new CustomResponse(
        200,
        'Subscription Created Successfully',
        saveData,
      );
    } catch (error) {
      throw throwException('Failed to create subscription');
    }
  }

  // Method to find a subscription by userId and planId
  async findSubscription(userId: Types.ObjectId, planId: Types.ObjectId) {
    const fetchData = await this.subscriptionModel
      .findOne({ userId, planId })
      .exec();

    return new CustomResponse(
      200,
      'subscription Retrived Successfully',
      fetchData,
    );
  }
}
