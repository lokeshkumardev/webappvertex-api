import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { WalletModule } from 'src/wallet/wallet.module';
import { PlanModule } from 'src/plan/plan.module';
import { Plan, PlanSchema } from 'src/plan/schema/plan.schema';

@Module({
  imports: [
    // Import the MongooseModule and register the Subscription schema
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
    WalletModule,
    PlanModule,
  ],
  controllers: [SubscriptionController], // Register the controller to handle the routes
  providers: [SubscriptionService], // Register the service to handle the business logic
})
export class SubscriptionModule {}
