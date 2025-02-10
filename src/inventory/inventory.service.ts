import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Inventory,
  InventoryDocument,
} from '../inventory/schema/inventory.schema';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  async create(data: any) {
    try {
      const inventory = await new this.inventoryModel(data).save();
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

  async update(id: string, data: any) {
    try {
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
}
