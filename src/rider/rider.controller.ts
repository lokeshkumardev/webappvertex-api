import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';
import { AssignOrderDto } from './dto/assign-order.dto';
import { ROUTE } from 'src/util/constants';

@Controller(ROUTE.RIDER)
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  // Create a new rider
  @Post('addRider')
  async createRider(@Body() createRiderDto: CreateRiderDto) {
    return this.riderService.createRider(createRiderDto);
  }

  // Get all riders
  @Get('getAllRiders')
  async getAllRiders() {
    return this.riderService.getAllRiders();
  }

  // Get rider by ID
  @Get('getRiderbyId:riderId')
  async getRiderById(@Param('riderId') riderId: string) {
    return this.riderService.getRiderById(riderId);
  }

  // Update rider status
  @Put('UpdateRiderstatus/:riderId')
  async updateRiderStatus(
    @Param('riderId') riderId: string,
    @Body() updateRiderStatusDto: UpdateRiderStatusDto
  ) {
    return this.riderService.updateRiderStatus(riderId, updateRiderStatusDto.status);
  }

  // Assign an order to a rider
//   @Put('assign-order/:riderId/:orderId')
//   async assignOrderToRider(
//     @Param('riderId') riderId: string,
//     @Param('orderId') orderId: string
//   ) {
//     const assignOrderDto: AssignOrderDto = {
//       riderId: riderId,
//       orderId: orderId,
//     };
//     return this.riderService.assignOrderToRider(assignOrderDto.riderId, assignOrderDto.orderId);
//   }
}
