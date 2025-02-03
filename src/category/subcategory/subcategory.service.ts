import { Injectable, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory } from '../category.schema/sub-category.schema';
import { CreateSubcategoryDTO, UpdateSubcategoryDTO } from '../dto/create-subcategory.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import { Category } from '../category.schema/category.schema'; // Corrected import path
import { fileUpload } from 'src/util/fileupload';
@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel('Subcategory') private subcategoryModel: Model<Subcategory>,
    @InjectModel('Category') private categoryModel: Model<Category>, // Inject Category Model
  ) { }

  private generateImageUrls(files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }, serverUrl: string) {
  //   const fileName = fileUpload(ENTITY.USER, file);
  //   updateUserDto['filePath'] =
  //     process.env.SERVER_BASE_URL + `uploads/${ENTITY.USER}/${fileName}`;
  // }
    const appImageUrls = files.app_image
      ? files.app_image.map(file => `${serverUrl}/uploads/${file.filename}`)
      : [];
    const webImageUrls = files.web_image
      ? files.web_image.map(file => `${serverUrl}/uploads/${file.filename}`)
      : [];

    return { appImageUrls, webImageUrls };
  }

  // Create Subcategory
  async createSubcategory(createSubcategoryDto: CreateSubcategoryDTO, files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }) {
    try {
      const serverUrl = 'http://147.93.103.99:8000/'; // Adjust for production URL

      // Check if Category exists
      const category = await this.categoryModel.findById(createSubcategoryDto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const categoryBySlug = await this.categoryModel.findOne({ slug: createSubcategoryDto.slug });
      if (!categoryBySlug) {
        throw new NotFoundException('Category with the specified slug not found');
      }
      //  console.log('files',files)
      // Generate image URLs
      const { appImageUrls, webImageUrls } = this.generateImageUrls(files, serverUrl);

      // Add these URLs to DTO before saving
      createSubcategoryDto.app_image = appImageUrls;
      createSubcategoryDto.web_image = webImageUrls;
     
      // Create the subcategory
      // const subcategory = new this.subcategoryModel(createSubcategoryDto);
      // console.log('hiii',subcategory)
      // const subSave = await subcategory.save();
      return new CustomResponse(
        HttpStatus.OK,
        'CreateSubcategory Save SuccessFully',
        'kk'
      );

    } catch (error) {
      throwException(error);
    }
  }

  // Update Subcategory
  async updateSubcategory(id: string, updateSubcategoryDto: UpdateSubcategoryDTO, files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }) {
    try {
      const serverUrl = 'http://147.93.103.99:8000/';; // Adjust for production URL

      // Check if Category exists
      const category = await this.categoryModel.findById(updateSubcategoryDto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const { appImageUrls, webImageUrls } = this.generateImageUrls(files, serverUrl);

      updateSubcategoryDto.app_image = appImageUrls;
      updateSubcategoryDto.web_image = webImageUrls;

      const subcategory = await this.subcategoryModel.findByIdAndUpdate(id, updateSubcategoryDto, { new: true });
      if (!subcategory) {
        throw new NotFoundException('SubCategory  not found');
      }
      return new CustomResponse(
        HttpStatus.OK,
        'CreateSubcategory Update Successfully',
        subcategory
      );

    } catch (error) {
      throwException(error);
    }
  }

  // Delete Subcategory
  async deleteSubcategory(id: string) {
    try {
      const subcategory = await this.subcategoryModel.findByIdAndDelete(id);
      if (!subcategory) {
        throw new NotFoundException('Category not found');
      }
      return new CustomResponse(
        HttpStatus.OK,
        'CreateSubcategory Delete SuccessFully',
        subcategory
      );
    } catch (error) {
      throwException(error)
    }
  }

  // Get Subcategories by UserType
  async getSubcategoriesByUserType(userType: 'daily' | 'permanent') {
    try {
      const subcategories = await this.subcategoryModel.find({ userType });
      return new CustomResponse(
        HttpStatus.OK,
        'Get All SubCategory SucessFully',
        subcategories
      );
    } catch (error) {
      throw new Error(`Error fetching subcategories: ${error.message}`);
    }
  }

  // Get All Subcategories
  async getAllSubcategories() {
    try {
      const subcategories = await this.subcategoryModel.find();
      return new CustomResponse(
        HttpStatus.OK,
        'Subcategory Get All SuccessFully',
        subcategories
      );
    } catch (error) {
      throwException(error)
    }
  }

  // Get Subcategories by Category ID
  async getSubcategoriesByCategoryId(categoryId: string) {
    try {
      // Check if the category exists
      // const category = await this.subcategoryModel.findById(categoryId);
      // if (!category) {
      //   throw new NotFoundException('Category Not Found ')
      // }

      const subcategories = await this.subcategoryModel.find({ categoryId: categoryId });
      console.log(subcategories)
      return new CustomResponse(
        HttpStatus.OK,
        'Subcategory By Id  SuccessFully',
        subcategories
      );
    } catch (error) {
      throwException(error)
    }
  }
  async getSubCategoryBySubcategoryID(id: string) {
    try {
      // Check if the category exists
      const category = await this.subcategoryModel.findById(id);
      if (!category) {
        return new CustomResponse(
          404,
          'Not Found SubCategory',
        );
      }

      const subcategories = await this.subcategoryModel.findOne({_id:id});
      console.log('subcategory',subcategories)
      return new CustomResponse(
        HttpStatus.OK,
        'All Subcategories get With Category Id',
        subcategories
      );
    } catch (error) {
      throwException(error)
    }
  }
}

