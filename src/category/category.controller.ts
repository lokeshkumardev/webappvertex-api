import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
  Get,
  InternalServerErrorException,
  BadRequestException,
  Param,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { Express } from 'express'; // Correct import for file type
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.schema/category.schema';
import { imageUploadConfig } from '../common/utils/imageUpload.helper'; // Import the helper
import { CustomResponse } from '../common/response/customeResponse'; // Import the custom response class
import { generateResponse } from '../common/utils/response.utils';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create and upload category image
  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadConfig()))
  async uploadCategoryImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<CustomResponse<Category>> {
    console.log('Uploaded file:', file); // Debug statement
    try {
      if (!file) {
        throw new BadRequestException('Image is required');
      }

      const imagePath = `/assets/category/${file.filename}`; // Correct path for category

      const createCategoryDto: CreateCategoryDto = {
        name,
        image: imagePath, // Use image path here
        description,
      };

      const category =
        await this.categoryService.createCategory(createCategoryDto);

      return generateResponse(
        'success',
        'Category created successfully',
        category,
      );
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(
        CustomResponse.error('Failed to create category'),
      );
    }
  }

  // Get all categories
  @Get()
  async getAllCategory(): Promise<CustomResponse<Category[]>> {
    try {
      const categories = await this.categoryService.getAllCategory();
      return generateResponse(
        'success',
        'Categories retrieved successfully',
        categories,
      );
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(
        CustomResponse.error('Failed to retrieve categories'),
      );
    }
  }

  // Get category by ID
  @Get(':categoryId')
  async getCategoryById(
    @Param('categoryId') categoryId: string,
  ): Promise<CustomResponse<Category>> {
    try {
      const category = await this.categoryService.getCategoryById(categoryId);

      if (!category) {
        throw new BadRequestException(
          `Category with ID ${categoryId} not found`,
        );
      }

      return generateResponse(
        'success',
        'Category retrieved successfully',
        category,
      );
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(
        CustomResponse.error('Failed to retrieve category'),
      );
    }
  }

  // Update category
  @Put(':categoryId')
  @UseInterceptors(FileInterceptor('image', imageUploadConfig())) // Use FileInterceptor to handle file uploads
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @UploadedFile() file: Express.Multer.File, // Corrected typing
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CustomResponse<Category>> {
    try {
      if (file) {
        updateCategoryDto.image = `/assets/${file.filename}`; // Update the image path
      }

      const updatedCategory = await this.categoryService.updateCategory(
        categoryId,
        updateCategoryDto,
      );

      if (!updatedCategory) {
        throw new BadRequestException(
          `Category with ID ${categoryId} not found`,
        );
      }

      return generateResponse(
        'success',
        'Category updated successfully',
        updatedCategory,
      );
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(
        CustomResponse.error('Failed to update category'),
      );
    }
  }
}
