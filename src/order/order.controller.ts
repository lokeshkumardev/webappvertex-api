import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { updateOrderDto } from './dto/update-order-dto';

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

  @Post('payment/:id')
  async createPayment(@Param('id') orderId: string, @Body() amount: any) {
    return this.orderService.createPayment(orderId, amount.amount);
  }

  @Get('getOrderHistoryByUrserId/:userId')
  async getOrderHistoryByUrserId(@Param('userId') userId: string) {
    return this.orderService.getOrderHistoryByUrserId(userId);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.orderService.verifyPayment(body);
  }

  @Post(':id/refund')
  async refundPayment(@Param('id') orderId: string) {
    return this.orderService.refundPayment(orderId);
  }

  @Put('paymentStatus/:id')
  async checkPaymentStatus(
    @Param('id') id: string,
    @Body() paymentStatus: string,
  ) {
    return this.orderService.getPaymentStatus(id, paymentStatus);
  }

  @Put('orderStatus/:id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: updateOrderDto, // Use DTO for validation
  ) {
    return this.orderService.updateOrderStatus(orderId, body); // FIXED: Passing only status
  }
}
