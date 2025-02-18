import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './dto/subscription.dto';
import { Types } from 'mongoose';
import { Subscription } from './schema/subscription.schema';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Endpoint to create a new subscription
  @Post()
  async createSubscription(@Body() subscriptionDto: SubscriptionDto) {
    // console.log('Received Subscription Data:', subscriptionDto);
    return this.subscriptionService.createSubscription(subscriptionDto);
  }

  // Endpoint to find a subscription by userId and planId
  @Get(':userId/:planId')
  async findSubscription(
    @Param('userId') userId: string,
    @Param('planId') planId: string,
  ) {
    // Convert strings to ObjectIds
    const userObjectId = new Types.ObjectId(userId);
    const planObjectId = new Types.ObjectId(planId);

    return this.subscriptionService.findSubscription(
      userObjectId,
      planObjectId,
    );
  }
  @Post('skip')
  async skipMeal(@Body() body: { userId: string; date: string }) {
    return this.subscriptionService.skipMeal(body.userId, body.date);
  }
}
