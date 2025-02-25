import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schema/store.schema';
import { StoreDto, OrderStatus } from './dto/store.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import { fileUpload } from 'src/util/fileupload';
import { throwException } from 'src/util/errorhandling';
import { Types } from 'mongoose';
import CustomError from 'src/common/providers/customer-error.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel('Order') private orderModel: Model<any>,
  ) {}

  async createStoreOrder(storeDto: StoreDto, files: any) {
    try {
      if (!storeDto || Object.keys(storeDto).length === 0) {
        return new CustomResponse(
          HttpStatus.CONFLICT,
          'Missing required fields',
        );
      }

      if (!files || Object.keys(files).length === 0) {
        return new CustomResponse(
          HttpStatus.CONFLICT,
          'Missing required files',
        );
      }

      const webImage = files?.web_image?.[0]
        ? fileUpload('store/webImage', files.web_image[0])
        : null;

      const appImage = files?.app_image?.[0]
        ? fileUpload('store/appImage', files.app_image[0])
        : null;

      storeDto['webImage'] =
        `${process.env.SERVER_BASE_URL}/uploads/store/webImage/${webImage}`;

      storeDto['appImage'] =
        `${process.env.SERVER_BASE_URL}/uploads/store/appImage/${appImage}`;

      // 🔥 **Latest Order Fetch Karna**
      const order = await this.orderModel
        .findOne()
        .sort({ createdAt: -1 })
        .exec();

      if (!order) {
        return new CustomResponse(HttpStatus.NOT_FOUND, 'No orders found.');
      }

      // ✅ **Order Details Store Karna**
      storeDto['orderNumber'] = order.orderNumber;
      storeDto['finalAmount'] = order.finalAmount;

      const newOrder = new this.storeModel({
        ...storeDto,
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
      });
      const savedOrder = await newOrder.save();

      return new CustomResponse(
        HttpStatus.OK,
        'Store Order Saved Successfully',
        savedOrder,
      );
    } catch (error) {
      console.error('Error in createStoreOrder:', error);
      throwException(error);
    }
  }

  async getFilteredStores(filters: Record<string, any>) {
    try {
      const query: any = {};

      if (filters.serviceType) {
        query.serviceType = filters.serviceType; // Exact match
      }

      const stores = await this.storeModel.find(query).exec();

      if (!stores.length) {
        return new CustomResponse(HttpStatus.NOT_FOUND, 'No Stores Found');
      }

      return new CustomResponse(
        HttpStatus.OK,
        'Stores retrieved successfully',
        stores,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async getStoreOrders(storeId: string) {
    const getStore = await this.storeModel.find({ storeId }).exec();
    return new CustomResponse(200, 'Store Retrived Successfully', getStore);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updatedOrder = await this.storeModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return new CustomError(404, 'Order not found');
    }
    return updatedOrder;
  }

  async deleteStoreOrders(id: string) {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      return new CustomResponse(404, 'Store not found');
    }

    const deleteStoreOrders = await this.storeModel
      .findByIdAndDelete(id)
      .exec();
    return new CustomResponse(
      200,
      'Store orders deleted successfully',
      deleteStoreOrders,
    );
  }

  async getUserHistory(userId: string) {
    try {
      const history = await this.orderModel.find({ userId }).exec();

      if (!history.length) {
        return new CustomResponse(404, 'No history found for this user');
      }

      return new CustomResponse(
        200,
        'User history fetched successfully',
        history,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async getStoreOrderByOrderNumber(orderNumber: string) {
    try {
      const order = await this.storeModel.findOne({ orderNumber }).exec();

      if (!order) {
        return new CustomResponse(HttpStatus.NOT_FOUND, 'No order found.');
      }

      return new CustomResponse(
        HttpStatus.OK,
        'Order found successfully.',
        order,
      );
    } catch (error) {
      console.error('Error in getStoreOrderByOrderNumber:', error);
      throwException(error);
    }
  }

  async getAllOrder() {
    try {
      const stores = await this.storeModel.find();
      if (!stores || stores.length === 0) {
        return new CustomResponse(HttpStatus.NOT_FOUND, 'No Stores found.');
      }
      return new CustomResponse(
        HttpStatus.OK,
        'Stores found successfully.',
        stores,
      );
    } catch (error) {
      throw new CustomError(500, error);
    }
  }
}
