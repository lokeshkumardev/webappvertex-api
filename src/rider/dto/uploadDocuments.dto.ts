import { BlobOptions } from 'buffer';
import { IsOptional, IsString } from 'class-validator';

export class UploadDocumentsDto {
  @IsOptional()
  @IsString()
  aadharFront?: string;

  @IsOptional()
  @IsString()
  aadharBack?: string;

  @IsOptional()
  @IsString()
  panFront?: string;

  @IsOptional()
  @IsString()
  drivingLicenseFront?: string;

  @IsOptional()
  @IsString()
  drivingLicenseBack?: string;

  status?: boolean;
}
