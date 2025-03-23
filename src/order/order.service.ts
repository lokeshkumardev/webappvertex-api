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
import { Rider } from 'src/rider/rider.schema/rider.schema';

dotenv.config({ path: './.env' });

@Injectable()
export class OrderService {
  private razorpayInstance: any;

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Rider') private readonly riderModel: Model<Rider>,
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
        userLongitude,
        userLatitude,
        riderId,
      } = createOrderDto;

      const subcategory = await this.subcategoryModel.findById(subCategoryId);
      if (!subcategory) throw new CustomResponse(404, 'Subcategory not found');

      const subCategoryPrice = subcategory.price;
      const totalAmount = subCategoryPrice * totalQuantity;
      const discountAmount = (totalAmount * discount) / 100;
      const specialOfferAmount = (totalAmount * specialOffer) / 100;
      const finalAmount = totalAmount - discountAmount - specialOfferAmount;
      const orderNumber = `${Math.floor(Math.random() * 10000)}`;

      // ✅ Find nearby riders within 5km
      const userLocation = [Number(userLongitude), Number(userLatitude)];
      const nearbyRiders = await this.riderModel
        .find({
          riderLocation: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: userLocation,
              },
              $maxDistance: 5000, // 5km radius
            },
          },
        })
        .limit(1);

      const assignedRider = nearbyRiders.length ? nearbyRiders[0]._id : null;

      // ✅ Ensure `riderId` is valid
      const newOrder = new this.orderModel({
        orderNumber,
        riderId: assignedRider, // ✅ Ensure it's either an ObjectId or null
        userId,
        serviceType,
        address,
        totalAmount,
        finalAmount,
        totalQuantity,
        specialOffer,
        discount,
        subCategoryId,
        userLocation: {
          type: 'Point',
          coordinates: userLocation,
        },
        status: 'pending',
      });

      // console.log('Saving Order:', newOrder); // ✅ Debugging

      const savedOrder = await newOrder.save();
      // console.log('Saved Order:', savedOrder); // ✅ Debugging
      return new CustomResponse(200, 'Order Created Successfully', savedOrder);
    } catch (error) {
      console.error('Error in createOrder:', error);
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
    try {
      const order = await this.orderModel.findById(orderId).lean(); // ✅ `lean()` se object immutable ho jata hai
      if (!order) throw new CustomError(404, 'Order not found');

      const razorpayOrder = await this.razorpayInstance.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: `ORD-${order._id}`,
        payment_capture: true,
      });

      // ✅ `userLocation` untouched rakho
      await this.orderModel.findByIdAndUpdate(orderId, {
        $set: { razorpayOrderId: razorpayOrder.id }, // ✅ Sirf Razorpay Order ID update ho rahi hai
      });

      return new CustomResponse(200, 'Payment Order Created', {
        razorpayOrder,
      });
    } catch (error) {
      throwException;
    }
  }

  async verifyPayment(body: any) {
    const { event, payload } = body;

    // Log the payload for debugging
    console.log('payload.payment.entity', payload?.payment?.entity);

    // Check if event is 'payment.captured'
    if (event !== 'payment.captured') {
      return new CustomResponse(400, 'Invalid event type');
    }

    // Check if payload.payment.entity exists
    if (!payload?.payment?.entity) {
      return new CustomResponse(400, 'Payment entity is missing');
    }

    const {
      id: paymentId,
      order_id: razorpayOrderId,
      signature,
    } = payload.payment.entity;

    // Check if all required fields are present
    if (!paymentId || !razorpayOrderId || !signature) {
      return new CustomResponse(400, 'Missing payment details');
    }

    // Log the extracted payment details

    try {
      const order = await this.orderModel.findOne({
        razorpayOrderId: { $regex: new RegExp(`^${razorpayOrderId}$`, 'i') },
      });

      if (!order) {
        throw new CustomError(404, 'Order not found');
      }

      // Generate the expected signature using HMAC
      const expectedSignature = createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET as string,
      )
        .update(razorpayOrderId + '|' + paymentId)
        .digest('hex');

      // Compare the signatures to ensure payment validity
      if (signature !== expectedSignature) {
        throw new CustomError(400, 'Invalid payment signature');
      }

      // Update the order with payment details
      order.razorpayPaymentId = paymentId;
      order.razorpaySignature = signature;
      order.paymentStatus = 'paid';
      // order.status = 'paid'; // Unnecessary if the status is already 'paid'
      await order.save();

      // Return success response
      return new CustomResponse(200, 'Payment verified successfully', order);
    } catch (error) {
      // Catch any errors and return a clear response
      // console.error('Error verifying payment:', error);
      return new CustomResponse(
        error.statusCode || 500,
        error.message || 'An error occurred while verifying payment',
      );
    }
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
    return new CustomResponse(200, 'Order deleted successfully', result);
  }
  async updateOrderStatus(
    orderId: string,
    updateBody: { status: string },
  ): Promise<any> {
    const { status } = updateBody;

    if (!['pending', 'confirmed'].includes(status)) {
      throw new CustomError(400, `Invalid status value: ${status}`);
    }

    // Find order and populate rider details
    const order = await this.orderModel
      .findById(orderId)
      .populate({
        path: 'riderId',
        select: 'name phone vehicleNumber', // ✅ Select only necessary fields
      })
      .exec();

    if (!order) throw new CustomError(404, 'Order not found');

    // if (!order) throw new CustomError(404, 'Order not found');

    order.status = status;
    await order.save();

    // console.log('Updated Order:', order); // Debugging
    return new CustomResponse(200, 'Order Status Updated Successfully', order);
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
