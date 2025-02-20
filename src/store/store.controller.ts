import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Query,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreDto, OrderStatus } from './dto/store.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { get } from 'http';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'web_image', maxCount: 1 },
      { name: 'app_image', maxCount: 1 },
    ]),
  )
  async createStoreOrder(
    @Body() storeDto: StoreDto,
    @UploadedFiles()
    files: {
      web_image?: Express.Multer.File[];
      app_image?: Express.Multer.File[];
    },
  ) {
    return this.storeService.createStoreOrder(storeDto, files);
  }
  @Patch('update-status/:orderId')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.storeService.updateOrderStatus(orderId, status);
  }
  @Get('filters')
  async getFilteredStores(@Query() filterDto: StoreDto) {
    return this.storeService.getFilteredStores(filterDto);
  }
  @Get(':storeId')
  async getStoreOrders(@Param('storeId') storeId: string) {
    return this.storeService.getStoreOrders(storeId);
  }

  @Delete(':id')
  async deleteStoreOrders(@Param('id') id: string) {
    return this.storeService.deleteStoreOrders(id);
  }
}
