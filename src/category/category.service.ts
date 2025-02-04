// src/services/category.service.ts
import { Injectable, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from '../category/category.schema/category.schema';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../category/dto/create-category.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import { fileUpload } from 'src/util/fileupload';
import { error } from 'console';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) { }

  async createCategory(createCategoryDto: CreateCategoryDTO, files: any) {
    try {
      if (!createCategoryDto || !files) {
        return new CustomResponse(
          HttpStatus.CONFLICT,
          'Missing required fields or files',
        );
      }
      const webImageFile = files.find(file => file.fieldname === 'web_image');
      const appImageFile = files.find(file => file.fieldname === 'app_image');

      // Upload files using your fileUpload function
      const webImage = fileUpload('category/webImage', webImageFile || null);

      createCategoryDto['web_image'] = webImage
        ? [`${process.env.SERVER_BASE_URL}uploads/category/webImage/${webImage}`]
        : [];
      const appImage = fileUpload('category/appImage', appImageFile || null);
      createCategoryDto['app_image'] = appImage
        ? [`${process.env.SERVER_BASE_URL}uploads/category/appImage/${appImage}`]
        : [];
      const existingCategory = await this.categoryModel.findOne({
        $or: [{ name: createCategoryDto.name }, { slug: createCategoryDto.slug }],
      });

      if (existingCategory) {
        throw new NotFoundException('Category with the same name or slug already exists');
      }

      const category = new this.categoryModel(createCategoryDto);
      const categorySave = await category.save();
      return new CustomResponse(
        HttpStatus.OK,
        'Category Save Successfully',
        categorySave
      );
    } catch (error) {
      throwException(error);
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDTO, files: any) {
    try {
      if (!id || !updateCategoryDto || !files) {
        throw new NotFoundException(400, 'Missing required fields or files');
      }
      if (files && files.length > 0) {
        const webImageFile = files.find(file => file.fieldname === 'web_image');
        if (webImageFile) {
          const fileName = fileUpload('banners/webImage', webImageFile);
          const webImage = fileUpload('category/webImage', webImageFile || null);
          updateCategoryDto['web_image'] = webImage
            ? [`${process.env.SERVER_BASE_URL}uploads/category/webImage/${webImage}`]
            : [];
        }

        const appImageFile = files.find(file => file.fieldname === 'app_image');
        if (appImageFile) {
          const appImage = fileUpload('category/appImage', appImageFile || null);

          updateCategoryDto['app_image'] = appImage
            ? [`${process.env.SERVER_BASE_URL}uploads/category/appImage/${appImage}`]
            : [];
        }
      }
      const updatedCategory = await this.categoryModel.findByIdAndUpdate(
        id,
        updateCategoryDto,
        { new: true }
      );

      if (!updatedCategory) {
        throw new NotFoundException(404, 'Category not found');
      }

      const updatCat = await updatedCategory.save();
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

  async getFilteredCategories(filters: Record<string, any>) {
    try {
      const query: any = {};
      // if (filters.id) {
      //   // Convert 'id' to ObjectId only if it is a valid ObjectId string
      //   if (Types.ObjectId.isValid(filters.id)) {
      //     query._id = filters.id; // Only if the id is valid
      //   } else {
      //     throw new Error('Invalid ObjectId format');
      //   }
      // }
      // Loop through each filter key and dynamically build the query
      for (const [key, value] of Object.entries(filters)) {


        if (value) {
          // For boolean filters like is_published, public
          if (key === 'is_published' || key === 'public') {
            query[key] = value;
          }
          // For ObjectId based filter (e.g., filtering by _id)
          else if (key === 'id' && value) {
            // Convert _id to ObjectId for comparison
            query._id = new Types.ObjectId(value); // Convert string to ObjectId
          }
          // For date range filter (assuming filters contains date keys like 'startDate' and 'endDate')
          else if (key === 'create_at' && value) {
            query.createdAt = { $gte: new Date(value) }; // Greater than or equal to start date
          } else if (key === 'update_at' && value) {
            query.createdAt = { $lte: new Date(value) }; // Less than or equal to end date
          }
          // For text-based search like name, description, etc.
          else {
            query[key] = { $regex: value, $options: 'i' }; // Case-insensitive match
          }
        }
      }
      console.log('Filtering by', query);
      // Execute the query
      // console.log('Filtered Categories:', query);
      const filterQuery = await this.categoryModel.find(query).exec();


      // Check if no data found, return custom response
      if (filterQuery.length === 0) {
        return new CustomResponse(404, 'Category Not Found');
      }

      // Return categories if found
      return new CustomResponse(200, 'Categories Retrieved Successfully', filterQuery);

    } catch (error) {
      // Handle and throw the error
      throwException(error);
    }
  }

}
