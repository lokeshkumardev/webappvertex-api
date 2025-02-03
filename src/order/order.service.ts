import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  // Create a new order
  async createOrder(createOrderDto: any): Promise<Order> {
    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderModel
      .findById(orderId)
      .populate('userId')
      .populate('products')
      .populate('riderId')
      .exec();
  }

  // Get all orders for a user
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId })
      .populate('products')
      .populate('riderId')
      .exec();
  }

  // Update the status of an order
  async updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(orderId, { status }, { new: true })
      .exec();
  }

  // Assign a rider to an order
  async assignRider(orderId: string, riderId: string): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(orderId, { riderId }, { new: true })
      .exec();
  }

  // Get all orders with a particular status
  async getOrdersByStatus(status: string): Promise<Order[]> {
    return this.orderModel
      .find({ status })
      .populate('products')
      .populate('riderId')
      .exec();
  }
}
