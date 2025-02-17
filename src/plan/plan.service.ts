import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan } from './schema/plan.schema';
import { PlanDto } from './dto/plan.dto';
import { fileUpload } from 'src/util/fileupload'; // Assuming you have this function
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {}

  async createPlan(
    planDto: PlanDto,
    files?: {
      webImage?: Express.Multer.File[];
      appImage?: Express.Multer.File[];
    },
  ) {
    if (!planDto) {
      throw new Error('Missing required fields');
    }

    const webImageFile = files?.webImage?.[0];
    const appImageFile = files?.appImage?.[0];

    if (webImageFile) {
      const uploadedWebImage = await fileUpload('plans/webImage', webImageFile);
      planDto.webImage = `${process.env.SERVER_BASE_URL}/uploads/plans/webImage/${uploadedWebImage}`;
    }

    if (appImageFile) {
      const uploadedAppImage = await fileUpload('plans/appImage', appImageFile);
      planDto.appImage = `${process.env.SERVER_BASE_URL}/uploads/plans/appImage/${uploadedAppImage}`;
    }

    planDto.webImage = planDto.webImage;
    planDto.appImage = planDto.appImage;

    const newPlan = new this.planModel(planDto);
    const plan = await newPlan.save();

    return new CustomResponse(
      HttpStatus.CREATED,
      'Plan created successfully',
      plan,
    );
  }

  async getPlansBySubCategory(subCategoryId: string): Promise<Plan[]> {
    return this.planModel.find({ subCategoryId }).exec();
  }

  async getPlansByUserType(userType: string): Promise<Plan[]> {
    return this.planModel.find({ userType }).exec();
  }

  async getPlanById(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  //   async updatePlan(id: string, planDto: Partial<PlanDto>): Promise<Plan> {
  //     const updatedPlan = await this.planModel
  //       .findByIdAndUpdate(id, planDto, { new: true })
  //       .exec();
  //     if (!updatedPlan) throw new NotFoundException('Plan not found');
  //     return updatedPlan;
  //   }

  async updatePlan(id: string, planDto: PlanDto, files: any) {
    try {
      if (!id || !planDto || !files) {
        throw new CustomResponse(400, 'Missing required fields or files');
      }
      if (files && files.length > 0) {
        const webImageFile = files.find(
          (file) => file.fieldname === 'web_image',
        );
        if (webImageFile) {
          //   const fileName = fileUpload('banners/webImage', webImageFile);
          const webImage = fileUpload(
            'category/webImage',
            webImageFile || null,
          );
          planDto['web_image'] = webImage
            ? [
                `${process.env.SERVER_BASE_URL}uploads/category/webImage/${webImage}`,
              ]
            : [];
        }

        const appImageFile = files.find(
          (file) => file.fieldname === 'app_image',
        );
        if (appImageFile) {
          const appImage = fileUpload(
            'category/appImage',
            appImageFile || null,
          );

          planDto['app_image'] = appImage
            ? [
                `${process.env.SERVER_BASE_URL}uploads/category/appImage/${appImage}`,
              ]
            : [];
        }
      }
      const updatedCategory = await this.planModel.findByIdAndUpdate(
        id,
        planDto,
        { new: true },
      );

      if (!updatedCategory) {
        throw new CustomResponse(404, 'Category not found');
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
      const categoryId = await this.planModel.findById(id);
      if (!categoryId) {
        throw new NotFoundException('No Record found for category');
      }

      const deletedCategory = await this.planModel.findByIdAndDelete(id);

      return new CustomResponse(
        HttpStatus.OK,
        'Category Delete SuccessFully',
        deletedCategory,
      );
    } catch (error) {
      throwException(error);
    }
  }

  async deletePlan(id: string): Promise<void> {
    const result = await this.planModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Plan not found');
  }
}
