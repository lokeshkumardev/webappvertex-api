import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateBannerDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  bannerImage?: string;
  web_image?:string;
  app_image?:string;
}
