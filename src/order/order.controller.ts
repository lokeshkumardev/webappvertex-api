import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Post(':id/payment')
  async createPayment(@Param('id') orderId: string) {
    return this.orderService.createPayment(orderId);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.orderService.verifyPayment(body);
  } 

  @Post(':id/refund')
  async refundPayment(@Param('id') orderId: string) {
    return this.orderService.refundPayment(orderId);
  }
}
