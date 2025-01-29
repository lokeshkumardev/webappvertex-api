import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory } from '../category.schema/sub-category.schema';
import { CategoryService } from '../category.service';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel('Subcategory') private subcategoryModel: Model<Subcategory>,
    private readonly categoryService: CategoryService, // Inject CategoryService to validate categories
  ) {}

  // Create a new subcategory
  async createSubcategory(createSubcategoryDto: any): Promise<any> {
    // Ensure category exists
    const category = await this.categoryService.getCategoryById(
      createSubcategoryDto.category,
    );
    if (!category) {
      throw new Error('Category not found');
    }

    const newSubcategory = new this.subcategoryModel(createSubcategoryDto);
    const savedSubcategory = await newSubcategory.save();

    // Transform the response to include indexed images
    const transformedResponse = {
      ...savedSubcategory.toObject(),
      images: savedSubcategory.images.map((image: string, index: number) => ({
        index,
        image,
      })),
    };

    return {
      status: 'success',
      message: 'Subcategory created successfully',
      data: transformedResponse,
    };
  }

  // Get all subcategories
  async getAllSubcategories(): Promise<Subcategory[]> {
    return this.subcategoryModel.find().exec();
  }

  // Get subcategory by ID
  async getSubcategoryById(subcategoryId: string): Promise<Subcategory | null> {
    return this.subcategoryModel
      .findById(subcategoryId)
      .populate('category')
      .exec();
  }

  // Get subcategories by category
  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return this.subcategoryModel.find({ category: categoryId }).exec();
  }

  async updateSubcategory(
    subcategoryId: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<any> {
    try {
      // Fetch the existing subcategory
      const existingSubcategory =
        await this.subcategoryModel.findById(subcategoryId);
      if (!existingSubcategory) {
        throw new Error('Subcategory not found');
      }

      // Update the images field only if new images are provided
      if (
        updateSubcategoryDto.images &&
        updateSubcategoryDto.images.length > 0
      ) {
        existingSubcategory.images = updateSubcategoryDto.images; // Overwrite images
      }

      // Update other fields
      Object.assign(existingSubcategory, updateSubcategoryDto);

      // Save the updated subcategory
      return await existingSubcategory.save();
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw new Error('Failed to update subcategory');
    }
  }
}
