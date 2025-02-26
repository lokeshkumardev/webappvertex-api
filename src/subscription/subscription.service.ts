import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionDto } from './dto/subscription.dto'; // Assuming you have a DTO for subscription
import CustomError from 'src/common/providers/customer-error.service';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import { Wallet } from 'src/wallet/schema/wallet.schema';
import { Plan } from 'src/plan/schema/plan.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,

    @InjectModel(Wallet.name) // Inject Wallet Model
    private readonly walletModel: Model<Wallet>,

    @InjectModel(Plan.name)
    private readonly planModel: Model<Plan>,
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

      const plan = await this.planModel.findById(subscriptionDto.planId);
      if (!plan) {
        throw new CustomError(404, 'Plan not found');
      }

      const newSubscription = new this.subscriptionModel({
        ...subscriptionDto,
        price: plan.price, // ✅ Plan ka Price
        offerPrice: plan.OfferPrice,
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
      throw throwException(error);
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
  async skipMeal(userId: string, date: string) {
    try {
      const subscription = await this.subscriptionModel.findOne({
        userId: new Types.ObjectId(userId),
        endDate: { $gte: new Date(date) }, // Check active subscription
      });

      if (!subscription)
        throw new CustomResponse(400, 'Subscription not found');

      const selectedDate = new Date(date);

      // Check if meal is already skipped
      if (
        subscription.skippedDays.some(
          (d) => d.toDateString() === selectedDate.toDateString(),
        )
      ) {
        throw new BadRequestException('Meal already skipped for this day');
      }

      // Calculate Per Day Amount
      const perDayCost =
        Number(subscription.totalAmount) / Number(subscription.validity);

      // Add date to skippedDays array
      subscription.skippedDays.push(selectedDate);
      await subscription.save();

      // Update Wallet
      let wallet = await this.walletModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      if (!wallet) {
        wallet = new this.walletModel({
          userId: new Types.ObjectId(userId),
          balance: perDayCost,
        });
      } else {
        wallet.balance += perDayCost;
      }

      await wallet.save();
      return new CustomResponse(200, 'Meal skipped and amount credited', {
        balance: wallet.balance,
      });
    } catch (error) {
      throw throwException(error);
    }
  }
}
