import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema/order.schema';
import { CreateOrderDto } from './dto/create-order-dto';
import { Subcategory } from 'src/category/category.schema/sub-category.schema'; // Import Subcategory model

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Subcategory')
    private readonly subcategoryModel: Model<Subcategory>, // Inject Subcategory model
  ) {}

  /**
   * Creates a new order with discount & offer calculations.
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      userId,
      serviceType,
      address,
      subCategoryId,
      specialOffer = 0,
      discount = 0,
      totalQuantity = 1,
    } = createOrderDto;

    // Fetch Subcategory details (price in this case)
    const subcategory = await this.subcategoryModel.findById(subCategoryId);
    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    // Calculate total amount based on Subcategory price
    const subCategoryPrice = subcategory.price; // Assuming price is available on Subcategory
    const totalAmount = subCategoryPrice * totalQuantity; // Multiply by quantity

    // Apply discounts & offers
    const discountAmount = (totalAmount * discount) / 100;
    const specialOfferAmount = (totalAmount * specialOffer) / 100;
    const finalAmount = totalAmount - discountAmount - specialOfferAmount;

    const newOrder = new this.orderModel({
      userId,
      serviceType,
      address,
      totalAmount,
      finalAmount,
      totalQuantity,
      specialOffer,
      discount,
      subCategoryId, // Save the subcategory reference
      status: 'pending', // default status
    });

    return newOrder.save();
  }

  /**
   * Fetch all orders with populated references.
   */
  async getAllOrders(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('userId subCategoryId') // Populate subCategoryId to get Subcategory details
      .exec();
  }

  /**
   * Fetch a single order by ID with populated references.
   */
  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel
      .findById(orderId)
      .populate('userId subCategoryId') // Populate subCategoryId to get Subcategory details
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  /**
   * Update an order status.
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    // Validate the status
    const allowedStatuses = ['pending', 'in_progress', 'completed'];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.status = status;
    return order.save();
  }

  /**
   * Delete an order by ID.
   */
  async deleteOrder(orderId: string): Promise<{ message: string }> {
    const result = await this.orderModel.findByIdAndDelete(orderId);
    if (!result) throw new NotFoundException('Order not found');

    return { message: 'Order deleted successfully' };
  }
}
