// src/controllers/category.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  Put,
  Get,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../category/dto/create-category.dto';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { multerOptions } from 'src/util/multiplefileupload';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  @UseInterceptors(AnyFilesInterceptor())
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDTO,
    @UploadedFiles()
    files: {
      app_image?: Express.Multer.File[];
      web_image?: Express.Multer.File[];
    },
  ) {
    return this.categoryService.createCategory(createCategoryDto, files);
  }

  @Put('editCategory/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @UploadedFiles()
    files: {
      app_image?: Express.Multer.File[];
      web_image?: Express.Multer.File[];
    },
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto, files);
  }

  @Delete('deleteCategory/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Get('getCategoryById/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  // New endpoint to get all categories
  @Get('getAllCategory')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Get('getFilteredCategories')
  async getCategories(
    @Query() filterParams: Record<string, any>, // Accept all query parameters as an object
  ) {
    return this.categoryService.getFilteredCategories(filterParams);
  }
}
