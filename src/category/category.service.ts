import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) {}

  // Create a new category
  async createCategory(createCategoryDto: any): Promise<Category> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  // Get all categories
  // CategoryService
  async getAllCategory(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();
    console.log('Fetched Categories:', categories); // Make sure data is being fetched correctly
    return categories; // Ensure this is returned properly
  }

  // Get category by ID
  async getCategoryById(categoryId: string): Promise<Category | null> {
    return this.categoryModel.findById(categoryId).exec();
  }

  // Update category
  async updateCategory(
    categoryId: string,
    updateCategoryDto: any,
  ): Promise<Category | null> {
    return this.categoryModel
      .findByIdAndUpdate(categoryId, updateCategoryDto, { new: true })
      .exec();
  }
}
