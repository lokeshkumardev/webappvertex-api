import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/createBanner.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateBannerDto } from './dto/updateBanner.dto';
import { ROUTE } from 'src/util/constants';


@Controller(ROUTE.BANNER)
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  @Post('createBanner')
  @UseInterceptors(AnyFilesInterceptor()) // Intercept file uploads
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles()files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }
  ) {
    return await this.bannerService.createBanner(createBannerDto, files);

  }

  @Get('getAllBanner')
  async findAll() {
    return await this.bannerService.findAllBanners();

  }

  @Get('getBannerById/:id')
  async findById(@Param('id') id: string) {
    return await this.bannerService.findBannerById(id);

  }

  @Put('editBanner/:id')
  @UseInterceptors(AnyFilesInterceptor())// Intercept file uploads for update
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFiles()files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }
  ) {
    return await this.bannerService.updateBanner(id, updateBannerDto, files);

  }

  @Delete('deleteBanner/:id')
  async delete(@Param('id') id: string) {

    return await this.bannerService.deleteBanner(id);
  }
}
