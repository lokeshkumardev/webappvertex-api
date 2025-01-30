import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './interface/banner.inferface';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class BannerService {
  constructor(@InjectModel('Banner') private readonly bannerModel: Model<Banner>) {}

  // Create a new banner
  async create(createBannerDto: any): Promise<any> {
    try {
      const newBanner = new this.bannerModel(createBannerDto);
      return newBanner.save();
    } catch (error) {
      throwException(error);
    }
  }

  // Get all banners
  async findAll(): Promise<any> {
    try {
      const banners = await this.bannerModel.find().select('-__v').exec(); 
      if (!banners) {
        throw new Error('Banner not found');
      }
      return banners.map(banner => {
        return {
          ...banner.toObject(),
          fullImageUrl: banner.bannerImage ? `${process.env.SERVER_BASE_URL}/uploads/banners/${banner.bannerImage}` : null
        };
      });
    } catch (error) {
      throwException(error);
    }
  }

  // Get a banner by ID
  async findById(id: string): Promise<any> {
    try {
      // Await the banner data to resolve the promise
      const banner = await this.bannerModel.findById(id).exec();
  
      // Check if the banner exists
      if (!banner) {
        throw new Error('Banner not found');
      }
  
      // Construct the full image URL if bannerImage exists
      const fullImageUrl = banner.bannerImage
        ? `${process.env.SERVER_BASE_URL}/uploads/banners/${banner.bannerImage}`
        : null;
  
      return {
        ...banner.toObject(),  // Convert the mongoose document to a plain object
        fullImageUrl
      };
    } catch (error) {
      // Call the custom error handler
      throwException(error);
    }
  }
  

  // Update a banner by ID
  

  
  async update(id: string, updateBannerDto: any): Promise<any> {
    try {
    
      // Update the banner with the new data
      const updatedBanner = await this.bannerModel
        .findByIdAndUpdate(id, updateBannerDto, { new: true })
        .exec();
  
      if (!updatedBanner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
  
      return updatedBanner;  // Return the updated banner
    } catch (error) {
      throwException(error);  // Handle any errors that occur
    }
  }
  // Delete a banner by ID
  async delete(id: string): Promise<any> {
    try {
      // Await the result of findByIdAndDelete to get the deleted banner object
      const deltebanner = await this.bannerModel.findByIdAndDelete(id).exec();
      console.log(deltebanner)
      // Check if the banner was found and deleted
      if (!deltebanner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
  
      return deltebanner; // Return the deleted banner object
    } catch (error) {
      // Custom error handling
      throwException(error);
    }
  }
}
