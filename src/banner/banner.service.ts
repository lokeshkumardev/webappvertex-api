import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './interface/banner.inferface';
import { fileUpload } from 'src/util/fileupload';
import { throwException } from 'src/util/errorhandling';
import CustomResponse from 'src/common/providers/custom-response.service';

@Injectable()
export class BannerService {
  constructor(@InjectModel('Banner') private readonly bannerModel: Model<Banner>) { }

  // Create a new banner
  async createBanner(createBannerDto: any, files: any): Promise<any> {
    try {

      const webImageFile = files.find(file => file.fieldname === 'web_image');
      const fileName = fileUpload('banners/webImage', webImageFile);
      createBannerDto.web_image = process.env.SERVER_BASE_URL + `uploads/banners/webImage/` + fileName;
      const appImageFile = files.find(file => file.fieldname === 'app_image');
      const app_image = fileUpload('banners/appImage', appImageFile);
      createBannerDto.app_image = process.env.SERVER_BASE_URL + `uploads/banners/appImage/` + app_image;

      // Handle file upload and get the file name


      const newBanner = new this.bannerModel(createBannerDto);
      const newBannerSave = await newBanner.save();
      return new CustomResponse(
        200,
        'Banner Create Successfully',
        newBannerSave
      )
    } catch (error) {
      throwException(error);
    }
  }

  // Get all banners
  async findAllBanners(): Promise<any> {
    try {
      const banners = await this.bannerModel.find().select('-__v').exec();
      if (!banners) {
        throw new Error('Banner not found');
      }
      return new CustomResponse(200, 'All Banner Fetch SuccessFully', banners)
    } catch (error) {
      throwException(error);
    }
  }

  // Get a banner by ID
  async findBannerById(id: string): Promise<any> {
    try {
      const banner = await this.bannerModel.findById(id).exec();
      if (!banner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
      return new CustomResponse(
        200,
        'Banner Fetch Successfully',
        banner
      )
    } catch (error) {
      throwException(error);
    }
  }

  // Update a banner by ID
  async updateBanner(id: string, updateBannerDto: any, files: any): Promise<any> {
    try {
      // Handle file upload only if images are provided in the DTO
      if (files && files.length > 0) {
        const webImageFile = files.find(file => file.fieldname === 'web_image');
        if (webImageFile) {
          const fileName = fileUpload('banners/webImage', webImageFile);
          updateBannerDto.web_image = process.env.SERVER_BASE_URL + `uploads/banners/webImage/` + fileName;
        }

        const appImageFile = files.find(file => file.fieldname === 'app_image');
        if (appImageFile) {
          const app_image = fileUpload('banners/appImage', appImageFile);
          updateBannerDto.app_image = process.env.SERVER_BASE_URL + `uploads/banners/appImage/` + app_image;
        }
      }

      // Update the banner with only the provided fields
      const updatedBanner = await this.bannerModel
        .findByIdAndUpdate(id, updateBannerDto, { new: true })
        .exec();

      if (!updatedBanner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }

      return new CustomResponse(200, 'Banner updated successfully', updatedBanner);
    } catch (error) {
      throwException(error);
    }
  }

  // Delete a banner by ID
  async deleteBanner(id: string): Promise<any> {
    try {
      const deletedBanner = await this.bannerModel.findByIdAndDelete(id).exec();
      if (!deletedBanner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }

      return new CustomResponse(
        200,
        'Banner Delete Successfully',
        deletedBanner
      )
    } catch (error) {
      throwException(error);
    }
  }
}
