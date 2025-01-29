import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rider } from './rider.schema/rider.schema';
import { OrderService } from '../order/order.service'; // Import order service to update orders when assigning a rider

@Injectable()
export class RiderService {
  constructor(
    @InjectModel('Rider') private riderModel: Model<Rider>,
    private readonly orderService: OrderService, // Inject OrderService to assign rider to orders
  ) {}

  // Create a new rider
  async createRider(createRiderDto: any): Promise<Rider> {
    const newRider = new this.riderModel(createRiderDto);
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
  async updateRiderStatus(riderId: string, status: string): Promise<Rider | null> {
    return this.riderModel.findByIdAndUpdate(
      riderId,
      { status },
      { new: true },
    ).exec();
  }

  // Assign an order to a rider
//   async assignOrderToRider(riderId: string, orderId: string): Promise<Rider | null> {
//     const rider = await this.riderModel.findById(riderId);
//     if (!rider) {
//       throw new Error('Rider not found');
//     }

//     // Check if order is already assigned to someone else (optional check)
//     const order = await this.orderService.getOrderById(orderId);
//     if (order?.riderId) {
//       throw new Error('Order is already assigned to another rider');
//     }

//     rider.assignedOrders.push(orderId); // Add order to rider's assigned orders
//     await rider.save();

//     // Update order with riderId
//     await this.orderService.assignRider(orderId, riderId);

//     return rider;
//   }
// async assignRider(orderId: string, riderId: string): Promise<Order | null> {
//     const order = await this.orderModel.findById(orderId);
//     if (!order) {
//       throw new Error('Order not found');
//     }
  
//     // Assign rider to the order
//     order.riderId = riderId;
//     return order.save();
//   }
}
