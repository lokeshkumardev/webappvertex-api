import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subcategory } from '../category.schema/sub-category.schema';
import {
  CreateSubcategoryDTO,
  UpdateSubcategoryDTO,
} from '../dto/create-subcategory.dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import { Category } from '../category.schema/category.schema'; // Corrected import path
import { fileUpload } from 'src/util/fileupload';
import CustomError from 'src/common/providers/customer-error.service';
@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel('Subcategory') private subcategoryModel: Model<Subcategory>,
    @InjectModel('Category') private categoryModel: Model<Category>, // Inject Category Model
  ) {}
  // Create Subcategory
  async createSubcategory(
    createSubcategoryDto: CreateSubcategoryDTO,
    files: any,
  ) {
    try {
      if (!createSubcategoryDto || !files) {
        throw new NotFoundException(400, 'Missing required fields or files');
      }
      const webImageFile = files.find((file) => file.fieldname === 'web_image');
      const appImageFile = files.find((file) => file.fieldname === 'app_image');

      // Upload files using your fileUpload function
      const webImage = fileUpload('subcategory/webImage', webImageFile || null);
      createSubcategoryDto['web_image'] = webImage
        ? [
            `${process.env.SERVER_BASE_URL}uploads/subcategory/webImage/${webImage}`,
          ]
        : [];
      const appImage = fileUpload('subcategory/appImage', appImageFile || null);
      createSubcategoryDto['app_image'] = appImage
        ? [
            `${process.env.SERVER_BASE_URL}uploads/subcategory/appImage/${appImage}`,
          ]
        : [];
      const category = await this.categoryModel.findById(
        createSubcategoryDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      // const categoryBySlug = await this.categoryModel.findOne({ slug: createSubcategoryDto.slug });
      // if (!categoryBySlug) {
      //   throw new NotFoundException('Category with the specified slug not found');
      // }
      const subcategory = new this.subcategoryModel(createSubcategoryDto);
      const subSave = await subcategory.save();
      return new CustomResponse(
        HttpStatus.OK,
        'CreateSubcategory Save SuccessFully',
        subSave,
      );
    } catch (error) {
      throwException(error);
    }
  }

  // Update Subcategory
  async updateSubcategory(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDTO,
    files: any,
  ) {
    try {
      if (!id || !updateSubcategoryDto || !files) {
        throw new NotFoundException(400, 'Missing required fields or files');
      }
      if (files && files.length > 0) {
        const webImageFile = files.find(
          (file) => file.fieldname === 'web_image',
        );
        if (webImageFile) {
          const webImage = fileUpload(
            'subcategory/webImage',
            webImageFile || null,
          );
          updateSubcategoryDto['web_image'] = webImage
            ? [
                `${process.env.SERVER_BASE_URL}uploads/subcategory/webImage/${webImage}`,
              ]
            : [];
        }

        const appImageFile = files.find(
          (file) => file.fieldname === 'app_image',
        );
        if (appImageFile) {
          const appImage = fileUpload(
            'subcategory/appImage',
            appImageFile || null,
          );

          updateSubcategoryDto['app_image'] = appImage
            ? [
                `${process.env.SERVER_BASE_URL}uploads/subcategory/appImage/${appImage}`,
              ]
            : [];
        }
      }
      const category = await this.categoryModel.findById(
        updateSubcategoryDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const subcategory = await this.subcategoryModel.findByIdAndUpdate(
        id,
        updateSubcategoryDto,
        { new: true },
      );
      if (!subcategory) {
        throw new NotFoundException('SubCategory  not found');
      }
      return new CustomResponse(
        HttpStatus.OK,
        'CreateSubcategory Update Successfully',
        subcategory,
      );
    } catch (error) {
      throwException(error);
    }
  }

  // Delete Subcategory
  async deleteSubcategory(id: string) {
    try {
      const subCatCheck = await this.subcategoryModel.findById(id);
      if (!subCatCheck) {
        throw new NotFoundException('Sub Category not found');
      }
      const subcategory = await this.subcategoryModel.findByIdAndDelete(id);
      return new CustomResponse(
        HttpStatus.OK,
        'Subcategory Delete SuccessFully',
        subcategory,
      );
    } catch (error) {
      throwException(error);
    }
  }

  // Get Subcategories by UserType
  async getSubcategoriesByUserType(userType: 'daily' | 'permanent') {
    try {
      const subcategories = await this.subcategoryModel.find({ userType });
      return new CustomResponse(
        HttpStatus.OK,
        'Get All SubCategory SucessFully',
        subcategories,
      );
    } catch (error) {
      throw new CustomError(
        500,
        `Error fetching subcategories: ${error.message}`,
      );
    }
  }

  // Get All Subcategories
  async getAllSubcategories() {
    try {
      const subcategories = await this.subcategoryModel.find();
      return new CustomResponse(
        HttpStatus.OK,
        'Subcategory Get All SuccessFully',
        subcategories,
      );
    } catch (error) {
      throwException(error);
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

      const subcategories = await this.subcategoryModel.find({
        categoryId: categoryId,
      });
      return new CustomResponse(
        HttpStatus.OK,
        'Subcategory By Id SuccessFully',
        subcategories,
      );
    } catch (error) {
      throwException(error);
    }
  }
  async getSubCategoryBySubcategoryID(id: string) {
    try {
      // Check if the category exists
      const category = await this.subcategoryModel.findById(id);
      if (!category) {
        return new CustomResponse(404, 'Not Found SubCategory');
      }

      const subcategories = await this.subcategoryModel.findOne({ _id: id });
      return new CustomResponse(
        HttpStatus.OK,
        'All Subcategories get With subCategory Id',
        subcategories,
      );
    } catch (error) {
      throwException(error);
    }
  }
  async getFilteredSubCategories(filters: Record<string, any>) {
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
          if (key === 'is_published' || key === 'categoryId') {
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
      // console.log('Filtered Categories:', query);
      const filterQuery = await this.subcategoryModel.find(query).exec();

      // Check if no data found, return custom response
      if (filterQuery.length === 0) {
        return new CustomResponse(404, 'Sub Category Not Found');
      }

      // Return categories if found
      return new CustomResponse(
        200,
        'Sub Categories Retrieved Successfully',
        filterQuery,
      );
    } catch (error) {
      // Handle and throw the error
      throwException(error);
    }
  }
}
