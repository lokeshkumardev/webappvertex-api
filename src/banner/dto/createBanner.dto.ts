import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  app_image:string;
  web_image:string;
}
