import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/interface/user.interface';
import { Order } from '../order/order.schema/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Order') private orderModel: Model<Order>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalOrders = await this.orderModel.countDocuments();

    return {
      totalUsers,
      totalOrders,
      message: 'Dashboard statistics fetched successfully',
    };
  }

  async createDashboardStats() {
    return {
      message: 'Dashboard statistics created successfully',
    };
  }
}
