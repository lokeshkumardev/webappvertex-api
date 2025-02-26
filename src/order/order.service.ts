import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const Razorpay = require('razorpay');
// This is the recommended way if esModuleInterop is enabled
import { createHmac } from 'crypto';
import { Order } from './order.schema/order.schema';
import { CreateOrderDto } from './dto/create-order-dto';
import { Subcategory } from 'src/category/category.schema/sub-category.schema';
import CustomResponse from 'src/common/providers/custom-response.service';
import CustomError from 'src/common/providers/customer-error.service';
import { User } from 'src/user/interface/user.interface';
import * as dotenv from 'dotenv';
import { throwException } from 'src/util/errorhandling';

dotenv.config({ path: './.env' });

@Injectable()
export class OrderService {
  private razorpayInstance: any;

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Subcategory')
    private readonly subcategoryModel: Model<Subcategory>,
  ) {
    this.razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * ✅ Create a new order
   */
  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const {
        userId,
        serviceType,
        address,
        subCategoryId,
        specialOffer = 0,
        discount = 0,
        totalQuantity = 1,
      } = createOrderDto;

      const subcategory = await this.subcategoryModel.findById(subCategoryId);
      if (!subcategory) throw new CustomResponse(404, 'Subcategory not found');

      const subCategoryPrice = subcategory.price;
      const totalAmount = subCategoryPrice * totalQuantity;

      const discountAmount = (totalAmount * discount) / 100;
      const specialOfferAmount = (totalAmount * specialOffer) / 100;
      const finalAmount = totalAmount - discountAmount - specialOfferAmount;
      const orderNumber = `${Math.floor(Math.random() * 10000)}`;
      createOrderDto.orderNumber = orderNumber;
      const newOrder = new this.orderModel({
        orderNumber,
        userId,
        serviceType,
        address,
        totalAmount,
        finalAmount,
        totalQuantity,
        specialOffer,
        discount,
        subCategoryId,
        status: 'pending',
      });

      const savedOrder = await newOrder.save();
      return new CustomResponse(200, 'Order Created Successfully', savedOrder);
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * ✅ Get all orders
   */
  async getAllOrders() {
    const orders = await this.orderModel
      .find()
      .populate('userId subCategoryId')
      .exec();
    return new CustomResponse(200, 'All Orders Retrieved Successfully', orders);
  }

  /**
   * ✅ Get order by ID
   */
  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new CustomError(404, 'Order not found');
    return new CustomResponse(200, 'Order fetched successfully', order);
  }

  /**
   * ✅ Create Razorpay Payment Order
   */
  /**
   * ✅ Create Razorpay Payment Order
   */
  async createPayment(orderId: string, amount: any) {
    // console.log('amount', amount);
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new CustomError(404, 'Order not found');

    // Create Razorpay payment order
    const razorpayOrder = await this.razorpayInstance.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `ORD-${order._id}`,
      payment_capture: true,
    });

    // Save the Razorpay order ID in the database
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // Razorpay payment link
    const paymentLink = `https://checkout.razorpay.com/v1/checkout.js?order_id=${razorpayOrder.id}`;

    return new CustomResponse(200, 'Payment Order Created', {
      razorpayOrder,
      paymentLink, // Provide the payment link to the user
    });
  }

  /**
   * ✅ Verify Razorpay Payment
   */
  async verifyPayment(body: any) {
    const { event, payload } = body;
    console.log(body);
    if (event !== 'payment.captured')
      return new CustomResponse(400, 'Invalid event type');

    const { order_id, id: paymentId, signature } = payload.payment.entity;

    const order = await this.orderModel.findOne({ razorpayOrderId: order_id });
    if (!order) throw new CustomError(404, 'Order not found');

    const expectedSignature = createHmac(
      'sha256',
      process.env.RAZORPAY_KEY_SECRET as string,
    )
      .update(order_id + '|' + paymentId)
      .digest('hex');

    if (signature !== expectedSignature)
      throw new CustomError(400, 'Invalid payment signature');

    order.razorpayPaymentId = paymentId;
    order.razorpaySignature = signature;
    order.paymentStatus = 'paid';
    order.status = 'paid';
    await order.save();

    return new CustomResponse(200, 'Payment verified successfully', order);
  }

  /**
   * ✅ Refund Payment
   */
  async refundPayment(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order || order.paymentStatus !== 'paid')
      throw new CustomError(
        404,
        'Payment not found or not eligible for refund',
      );

    const refund = await this.razorpayInstance.payments.refund(
      order.razorpayPaymentId as string,
      {},
    );
    order.paymentStatus = 'refunded';
    await order.save();

    return new CustomResponse(200, 'Payment refunded successfully', refund);
  }

  async deleteOrder(orderId: string): Promise<{ message: string }> {
    // Find the order by ID and delete it
    const result = await this.orderModel.findByIdAndDelete(orderId);
    if (!result) throw new CustomError(404, 'Order not found');

    return { message: 'Order deleted successfully' }; // Return success message
  }
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const allowedStatuses = ['pending', 'in_progress', 'completed'];
    if (!allowedStatuses.includes(status)) {
      throw new CustomError(400, 'Invalid status value');
    }

    const order = await this.orderModel.findById(orderId);
    if (!order) throw new CustomError(404, 'Order not found');

    order.status = status;
    await order.save();
    return order;
  }

  async getOrderHistoryByUrserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new CustomError(404, 'User Not Found');

    const orders = await this.orderModel
      .find({ userId }) // Sirf us user ke orders find karna
      .populate('subCategoryId', 'name description') // Category ka name aur description include karega
      .lean();

    if (!orders.length)
      throw new CustomError(404, 'No Orders Found for this User');

    return new CustomResponse(200, 'Order History Fetch SuccessFully ', orders);
  }
  async getPaymentStatus(id: string, paymentStatus: any) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) throw new CustomError(404, 'Order not found');
      var paymentStatus = paymentStatus;
      const res = await this.orderModel
        .findByIdAndUpdate(id, paymentStatus, { new: true })
        .exec();
      return new CustomResponse(200, 'Payment Status Updated !', res);
    } catch (error) {
      throwException(error);
    }
  }
}
