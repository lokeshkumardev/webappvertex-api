import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  // Create a new order with all calculations
  async createOrder(createOrderDto: any): Promise<Order> {
    // Get the products and calculate the original price
    const products = createOrderDto.products; // Assumes this is an array of product IDs
    const originalPrice = await this.calculateTotalPrice(products);

    // Apply discounts and special offers
    const { discount, specialOffer } = createOrderDto; // Assuming the DTO includes discount & offer details
    const finalPrice = this.calculateFinalPrice(originalPrice, discount, specialOffer);

    const newOrder = new this.orderModel({
      ...createOrderDto,
      originalPrice,
      finalPrice,
      discount,
      specialOffer,
      offerDetails: this.getOfferDetails(specialOffer),
    });

    return newOrder.save();
  }

  // Calculate total price of products
  private async calculateTotalPrice(productIds: string[]): Promise<number> {
    // Assuming you have a product model and can calculate the total price of products
    // const products = await this.getProductsByIds(productIds);
    // const total = products.reduce((sum, product) => sum + product.price, 0);
    const total=0;
    return total;
  }

  // Get product details by their IDs
  // private async getProductsByIds(productIds: string[]): Promise<any[]> {
  //   // Assuming you have a Product service or model to fetch products by their IDs
  //   return await this.productModel.find({ '_id': { $in: productIds } });
  // }

  // Calculate the final price after applying the discount and special offers
  private calculateFinalPrice(originalPrice: number, discount: number, specialOffer: string): number {
    let priceAfterDiscount = originalPrice - (originalPrice * (discount / 100));
    // If there's a special offer, apply it
    if (specialOffer === 'NEWYEAR2025') {
      // Example of a specific special offer
      priceAfterDiscount -= 10; // Fixed $10 off for the New Year special offer
    }
    return Math.max(priceAfterDiscount, 0); // Ensure final price is not negative
  }

  // Get offer details (e.g., promo code details)
  private getOfferDetails(offerCode: string) {
    if (offerCode === 'NEWYEAR2025') {
      return { code: offerCode, description: 'New Year 2025 Offer: $10 off on orders above $50.' };
    }
    return null;
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
