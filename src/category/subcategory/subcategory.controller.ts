import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { generateResponse } from 'src/common/utils/response.utils';
import { imageUploadConfig } from '../../common/utils/imageUpload.helper'; // Import your helper function
import { CustomResponse } from 'src/common/response/customeResponse'; // Import CustomResponse type

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  // Create a new subcategory with multiple images
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, imageUploadConfig())) // Use the imported helper here
  async createSubcategory(
    @UploadedFiles() files: Express.Multer.File[], // Handle multiple files
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<CustomResponse<any>> {
    try {
      // Validate file upload
      if (!files || files.length === 0) {
        throw new BadRequestException('At least one image is required');
      }

      // Map the file paths to be stored in the database
      const imagePaths = files.map(
        (file) => `/assets/subCategory/${file.filename}`, // Ensure this matches the path in your helper
      );
      createSubcategoryDto.images = imagePaths; // Assign the paths to images array

      // Create the subcategory
      const subcategory =
        await this.subcategoryService.createSubcategory(createSubcategoryDto);

      return generateResponse(
        'success',
        'Subcategory created successfully',
        subcategory,
      );
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(
        CustomResponse.error('Failed to create subcategory'),
      );
    }
  }
  // Get all subcategories
  @Get()
  async getAllSubcategories() {
    try {
      const subcategories = await this.subcategoryService.getAllSubcategories();
      return generateResponse(
        'success',
        'Subcategories fetched successfully',
        subcategories,
      );
    } catch (error) {
      console.error('Error:', error);
      return generateResponse(
        'error',
        'Failed to fetch subcategories',
        error.message || error,
      );
    }
  }

  // Get subcategory by ID
  @Get(':subcategoryId')
  async getSubcategoryById(@Param('subcategoryId') subcategoryId: string) {
    try {
      const subcategory =
        await this.subcategoryService.getSubcategoryById(subcategoryId);
      if (!subcategory) {
        return generateResponse('error', 'Subcategory not found');
      }
      return generateResponse(
        'success',
        'Subcategory fetched successfully',
        subcategory,
      );
    } catch (error) {
      console.error('Error:', error);
      return generateResponse(
        'error',
        'Failed to fetch subcategory',
        error.message || error,
      );
    }
  }

  @Put(':subcategoryId')
  @UseInterceptors(FilesInterceptor('images', 10, imageUploadConfig()))
  async updateSubcategory(
    @Param('subcategoryId') subcategoryId: string,
    @UploadedFiles() files: Express.Multer.File[], // Handle multiple files
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<CustomResponse<any>> {
    try {
      // Process new images if provided
      if (files && files.length > 0) {
        const imagePaths = files.map(
          (file) => `/assets/subCategory/${file.filename}`,
        );
        updateSubcategoryDto.images = imagePaths; // Assign new images
      }

      // Call the service to update the subcategory
      const updatedSubcategory =
        await this.subcategoryService.updateSubcategory(
          subcategoryId,
          updateSubcategoryDto,
        );

      if (!updatedSubcategory) {
        return generateResponse('error', 'Subcategory not found for update');
      }

      return generateResponse(
        'success',
        'Subcategory updated successfully',
        updatedSubcategory,
      );
    } catch (error) {
      console.error('Error:', error);
      return generateResponse(
        'error',
        'Failed to update subcategory',
        error.message || error,
      );
    }
  }
}
