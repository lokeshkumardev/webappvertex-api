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
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Total users
    const totalUsers = await this.userModel.countDocuments();

    // Total orders
    const totalOrders = await this.orderModel.countDocuments();

    // Today’s orders
    const todayOrders = await this.orderModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Today’s customers (unique users who placed orders today)
    const todayCustomers = await this.orderModel
      .distinct('userId', {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })
      .then((users) => users.length);

    return {
      totalUsers,
      totalOrders,
      todayOrders,
      todayCustomers,
      message: 'Dashboard statistics fetched successfully',
    };
  }

  async createDashboardStats() {
    return {
      message: 'Dashboard statistics created successfully',
    };
  }
}
