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
import CustomResponse from 'src/common/providers/custom-response.service';
import CustomError from 'src/common/providers/customer-error.service';

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
  async createOrder(createOrderDto: CreateOrderDto) {
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
      throw new CustomResponse(404, 'Subcategory is required');
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
    if (!userId) {
      return new CustomResponse(404, 'userId is required');
    }

    const savedOrder = await newOrder.save();

    return new CustomResponse(200, 'Order Created Successfully', savedOrder);
  }

  /**
   * Fetch all orders with populated references.
   */
  async getAllOrders() {
    try {
      const orders = await this.orderModel
        .find()
        .populate('userId subCategoryId') // Populate subCategoryId to get Subcategory details
        .exec();
      return new CustomResponse(
        200,
        'All Order Retrieved Successfully',
        orders,
      );
    } catch (error) {
      throw new CustomError(error);
    }
  }
  /**
   * Fetch a single order by ID with populated references.
   */
  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new CustomError(404, 'Order not found');
    return new CustomResponse(200, 'order successfully fetched by id', order);
  }

  /**
   * Update an order status.
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    // Allowed statuses validation
    const allowedStatuses = ['pending', 'in_progress', 'completed'];
    if (!allowedStatuses.includes(status)) {
      throw new CustomError(400, 'Invalid status value');
    }

    // Find and update the order
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new CustomError(404, 'Order not found');

    order.status = status;
    await order.save();
    return order;
  }

  /**
   * Delete an order by ID.
   */
  async deleteOrder(orderId: string): Promise<{ message: string }> {
    const result = await this.orderModel.findByIdAndDelete(orderId);
    if (!result) throw new CustomError(404, 'Order not found');

    return new CustomResponse(200, 'Order deleted successfully', result);
  }
}
