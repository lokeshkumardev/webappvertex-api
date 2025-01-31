import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/createBanner.dto';
import { fileUpload } from 'src/util/fileupload';
import { throwException } from '../util/errorhandling';
import CustomResponse from 'src/common/providers/custom-response.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBannerDto } from './dto/updateBanner.dto';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('bannerImage')) // Intercept file uploads
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Handle file upload and get the file name
      const fileName = fileUpload('banners', file);

      // Add file name to the DTO
      createBannerDto.bannerImage = fileName;

      // Create the banner
      const banner = await this.bannerService.create(createBannerDto);

      // Return a custom response
      return new CustomResponse(200, 'Banner created successfully', banner);
    } catch (error) {
      // Use custom error handling
      throwException(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const banners = await this.bannerService.findAll();
      return new CustomResponse(200, 'Banners fetched successfully', banners);
    } catch (error) {
      throwException(error);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const banner = await this.bannerService.findById(id);  // Change this to your actual base URL
      if (banner.imageUrl) {
        banner.imageUrl = `${process.env.SERVER_BASE_URL}/uploads/banners/${banner.imageUrl}`;
      }
      return new CustomResponse(200, 'Banner fetched successfully', banner);
    } catch (error) {
      throwException(error);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('bannerImage')) // Intercept file uploads for update
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File, // Get the uploaded file
  ) {
    try {
        console.log('file',file)
        const fileName = fileUpload('banners', file);

      // Add file name to the DTO
      updateBannerDto.bannerImage = fileName;
      const banner = await this.bannerService.update(id, updateBannerDto);
      return new CustomResponse(200, 'Banner updated successfully', banner);
    } catch (error) {
      throwException(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.bannerService.delete(id);
      return new CustomResponse(200, 'Banner deleted successfully');
    } catch (error) {
      throwException(error);
    }
  }
}
