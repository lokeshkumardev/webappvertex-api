// src/controllers/category.controller.ts
import { Controller, Post, Body, Param, Put, Get, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../category/dto/create-category.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/util/multiplefileupload';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'app_image', maxCount: 5 },
        { name: 'web_image', maxCount: 5 },
      ],
      multerOptions
    )
  )
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDTO,
    @UploadedFiles() files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }
  ) {
    return this.categoryService.createCategory(createCategoryDto, files);
  }

  @Put('editCategory/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'app_image', maxCount: 5 },
        { name: 'web_image', maxCount: 5 },
      ],
      multerOptions
    )
  )
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @UploadedFiles() files: { app_image?: Express.Multer.File[]; web_image?: Express.Multer.File[] }
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
}
