// src/services/category.service.ts
import { Injectable, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/category.schema/category.schema';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../category/dto/create-category.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) { }

  private generateImageUrls(files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }, serverUrl: string) {
    const appImageUrls = files.app_image
      ? files.app_image.map(file => `${serverUrl}/uploads/${file.filename}`)
      : [];

    const webImageUrls = files.web_image
      ? files.web_image.map(file => `${serverUrl}/uploads/${file.filename}`)
      : [];

    return { appImageUrls, webImageUrls };
  }

  async createCategory(createCategoryDto: CreateCategoryDTO, files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }) {
    try {
      if (!createCategoryDto || !files) {
        return new CustomResponse(
          HttpStatus.CONFLICT,
          'Missing required fields or files',
        );
      }

      const existingCategory = await this.categoryModel.findOne({
        $or: [{ name: createCategoryDto.name }, { slug: createCategoryDto.slug }],
      });

      if (existingCategory) {
        throw new NotFoundException('Category with the same name or slug already exists');
      }

      const serverUrl = 'http://localhost:3000'; // Adjust for production URL
      const { appImageUrls, webImageUrls } = this.generateImageUrls(files, serverUrl);

      createCategoryDto.app_image = appImageUrls;
      createCategoryDto.web_image = webImageUrls;

      const category = new this.categoryModel(createCategoryDto);
      const categorySave = await category.save();
      return new CustomResponse(
        HttpStatus.OK,
        'Category Save Successfully',
        categorySave,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDTO, files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }) {
    try {
      if (!id || !updateCategoryDto || !files) {
        throw new NotFoundException(400, 'Missing required fields or files');
      }

      const updatedCategory = await this.categoryModel.findByIdAndUpdate(
        id,
        updateCategoryDto,
        { new: true }
      );

      if (!updatedCategory) {
        throw new NotFoundException(404, 'Category not found');
      }

      const serverUrl = 'http://localhost:3000'; // Adjust for production URL
      const { appImageUrls, webImageUrls } = this.generateImageUrls(files, serverUrl);

      updatedCategory.app_image = appImageUrls;
      updatedCategory.web_image = webImageUrls;

      const updatCat=await updatedCategory.save();
      return new CustomResponse(
        HttpStatus.OK,
        'Category Update Successfully',
        updatCat,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async deleteCategory(id: string) {
    try {
      const categoryId = await this.categoryModel.findById(id);
      if (!categoryId) {
        throw new NotFoundException('No Record found for category');
      }

      const deletedCategory = await this.categoryModel.findByIdAndDelete(id);

      return new CustomResponse(
        HttpStatus.OK,
        'Category Delete SuccessFully',
        deletedCategory
      );
    } catch (error) {
      throwException(error);
    }
  }

  // New method to get a category by its ID
  async getCategoryById(id: string) {
    try {
      const category = await this.categoryModel.findById(id);

      if (!category) {
        throw new NotFoundException(404, 'Category not found');
      }

      return new CustomResponse(HttpStatus.OK, 'Category found', category);
    } catch (error) {
      throwException(error);
    }
  }

  // New method to get all categories
  async getAllCategories() {
    try {
      const categories = await this.categoryModel.find();

      if (!categories || categories.length === 0) {
        throw new NotFoundException(404, 'No categories found');
      }

      return new CustomResponse(HttpStatus.OK, 'Categories found', categories);
    } catch (error) {
      throwException(error);
    }
  }
}
