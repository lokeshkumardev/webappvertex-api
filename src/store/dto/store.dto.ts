import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { serviceType } from '../schema/store.schema';

export enum OrderStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export class StoreDto {
  orderId?: string;

  // @IsNotEmpty()
  riderId?: string;

  // @IsNotEmpty()
  // @IsString()
  userName: string;

  // @IsNotEmpty()
  // @IsString()
  userPhone: string;

  @IsOptional()
  webImage?: string;

  @IsOptional()
  appImage?: string;

  // @IsNotEmpty()
  // @IsString()
  customerAddress: string;

  // @IsNotEmpty()
  // @IsString()
  itemName: string;

  // @IsNotEmpty()
  // @IsNumber()
  quantity: number;

  // @IsNotEmpty()
  // @IsEnum(OrderStatus)
  status: OrderStatus;

  orderNumber: string;

  serviceType: serviceType;
}
