import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    // Import the MongooseModule and register the Subscription schema
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    WalletModule
  ],
  controllers: [SubscriptionController], // Register the controller to handle the routes
  providers: [SubscriptionService], // Register the service to handle the business logic
})
export class SubscriptionModule {}
