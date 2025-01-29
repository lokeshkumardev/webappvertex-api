import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateRiderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['available', 'on_delivery', 'offline']) // Validate against specific statuses
  status: string;
}
