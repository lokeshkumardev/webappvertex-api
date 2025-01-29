import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  riderId: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: string;
}
