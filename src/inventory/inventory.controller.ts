import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('createInventory')
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get('getAllInventory')
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('getInventoryById/:id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put('editInventory/:id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete('deleteInventory/:id')
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }

  /**
   * Generic Filter Endpoint
   * Example: /inventory/filter?status=in_stock&minPrice=100&maxPrice=500
   */
  @Get('InventoryFilter')
  filterInventory(@Query() query: any) {
    return this.inventoryService.filterInventory(query);
  }
}
