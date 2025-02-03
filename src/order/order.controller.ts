import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { ROUTE } from 'src/util/constants';

@Controller(ROUTE.ORDER)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // Get order details by ID
  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  // Update order status (e.g., from "pending" to "delivered")
  @Put('status/:orderId')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: string },
  ) {
    return this.orderService.updateOrderStatus(orderId, body.status);
  }

  // Get all orders by user
  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  // Get orders by status (pending, delivered, etc.)
  @Get('status/:status')
  async getOrdersByStatus(@Param('status') status: string) {
    return this.orderService.getOrdersByStatus(status);
  }

  // Assign a rider to an order
  @Put('assign-rider/:orderId')
  async assignRider(@Param('orderId') orderId: string, @Body() body: { riderId: string }) {
    return this.orderService.assignRider(orderId, body.riderId);
  }
}
