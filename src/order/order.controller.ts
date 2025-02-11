import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { Order } from './order.schema/order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Creates a new order.
   */
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  /**
   * Fetch all orders.
   */
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  /**
   * Fetch a single order by ID.
   */
  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  /**
   * Update the order status.
   */
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: string,
  ): Promise<{ success: boolean; message: string; data?: Order }> {
    const updatedOrder = await this.orderService.updateOrderStatus(
      orderId,
      status,
    );
    return {
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    };
  }

  /**
   * Delete an order by ID.
   */
  @Delete(':id')
  async deleteOrder(
    @Param('id') orderId: string,
  ): Promise<{ message: string }> {
    return this.orderService.deleteOrder(orderId);
  }
}
