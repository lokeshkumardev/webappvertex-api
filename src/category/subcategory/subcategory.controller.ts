// src/controllers/subcategory.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SubcategoryService } from '../subcategory/subcategory.service';
import {
  CreateSubcategoryDTO,
  UpdateSubcategoryDTO,
} from '../dto/create-subcategory.dto';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express'; // Changed to FileFieldsInterceptor for multiple file upload
import { multerOptions } from 'src/util/multiplefileupload';
@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createSubcategory(
    @Body() createSubcategoryDto: CreateSubcategoryDTO,
    @UploadedFiles()
    files: {
      app_image?: Express.Multer.File[];
      web_image?: Express.Multer.File[];
    },
  ) {
    return this.subcategoryService.createSubcategory(
      createSubcategoryDto,
      files,
    );
  }

  @Put('editSubCategory/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateSubcategory(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: CreateSubcategoryDTO,
    @UploadedFiles()
    files: {
      app_image?: Express.Multer.File[];
      web_image?: Express.Multer.File[];
    },
  ) {
    return this.subcategoryService.updateSubcategory(
      id,
      updateSubcategoryDto,
      files,
    );
  }

  @Delete('deleteSubCategory/:id')
  async deleteSubcategory(@Param('id') id: string) {
    return this.subcategoryService.deleteSubcategory(id);
  }

  @Get('getCategoryByUserType')
  async getSubcategoriesByUserType(
    @Query('userType') userType: 'daily' | 'permanent',
  ) {
    return this.subcategoryService.getSubcategoriesByUserType(userType);
  }

  // New endpoint to get all subcategories
  @Get('getAllSubCategory')
  async getAllSubcategories() {
    return this.subcategoryService.getAllSubcategories();
  }
  @Get('getSubCategoryBySubcategoryID/:id')
  async getSubCategoryBySubcategoryID(@Param('id') id: string) {
    return this.subcategoryService.getSubCategoryBySubcategoryID(id);
  }
  // New endpoint to get subcategories by categoryId
  @Get('getSubcategoriesByCategoryId/:categoryId')
  async getSubcategoriesByCategoryId(@Param('categoryId') categoryId: string) {
    return this.subcategoryService.getSubcategoriesByCategoryId(categoryId);
  }
  @Get('getFilteredSubCategories')
  async getCategories(
    @Query() filterParams: Record<string, any>, // Accept all query parameters as an object
  ) {
    return this.subcategoryService.getFilteredSubCategories(filterParams);
  }
  // @Get('category/:categoryId')
  // async getSubCategoryByCategoryId(@Param('categoryId') categoryId: string) {
  //   return this.subcategoryService.getSubcategoriesByCategoryId(categoryId);
  // }
}
