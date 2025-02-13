import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Inventory,
  InventoryDocument,
} from '../inventory/schema/inventory.schema';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import { CreateInventoryDto } from '../inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from '../inventory/dto/update-inventory.dto';
import { StockStatus } from '../inventory/dto/create-inventory.dto';
import { stat } from 'fs';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  // Automatically determine stock status based on quantity
  private determineStockStatus(quantity: number): StockStatus {
    if (quantity === 0) return StockStatus.OUT_OF_STOCK;
    if (quantity > 0 && quantity <= 5) return StockStatus.LOW_STOCK;
    return StockStatus.IN_STOCK;
  }

  async create(data: CreateInventoryDto) {
    try {
      const status = this.determineStockStatus(data.quantity);
      const inventory = await new this.inventoryModel({
        ...data,
        status,
      }).save();
      return new CustomResponse(
        201,
        'Inventory Created Successfully',
        inventory,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async findAll() {
    try {
      const items = await this.inventoryModel.find().exec();
      if (items.length === 0) {
        throw new CustomResponse(404, 'No inventory items found');
      }
      return new CustomResponse(
        200,
        'Inventory List Retrieved Successfully',
        items,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.inventoryModel.findById(id).exec();
      if (!item) throw new NotFoundException('Inventory item not found');
      return new CustomResponse(
        200,
        'Inventory Item Retrieved Successfully',
        item,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async update(id: string, data: UpdateInventoryDto) {
    try {
      if (data.quantity !== undefined) {
        data.status = this.determineStockStatus(data.quantity);
      }

      const updatedItem = await this.inventoryModel
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      if (!updatedItem)
        throw new CustomResponse(404, 'Inventory item not found');
      return new CustomResponse(
        200,
        'Inventory Item Updated Successfully',
        updatedItem,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedItem = await this.inventoryModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedItem)
        throw new CustomResponse(404, 'Inventory item not found');
      return new CustomResponse(
        200,
        'Inventory Deleted Successfully',
        deletedItem,
      );
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * Generic Filter Method
   * Example: /inventory/filter?status=in_stock&minPrice=100&maxPrice=500
   */
  async filterInventory(query: any) {
    try {
      let filter: any = {};

      // Apply filters based on query parameters
      if (query.status) {
        filter.status = query.status;
      }
      if (query.minQuantity) {
        filter.quantity = {
          ...filter.quantity,
          $gte: parseInt(query.minQuantity),
        };
      }
      if (query.maxQuantity) {
        filter.quantity = {
          ...filter.quantity,
          $lte: parseInt(query.maxQuantity),
        };
      }
      if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' }; // Case-insensitive search
      }

      const items = await this.inventoryModel.find(filter).exec();
      if (!items.length) {
        throw new CustomResponse(
          404,
          'No inventory items match the filter criteria',
        );
      }

      return new CustomResponse(
        200,
        'Filtered Inventory Retrieved Successfully',
        items,
      );
    } catch (error) {
      throwException(error);
    }
  }
}
