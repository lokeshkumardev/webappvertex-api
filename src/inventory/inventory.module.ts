import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory,InventorySchema } from './schema/inventory.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
