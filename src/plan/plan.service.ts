import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Plan } from './schema/plan.schema';
import { PlanDto } from './dto/plan.dto';
import { fileUpload } from 'src/util/fileupload';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {}

  async createPlan(planDto: PlanDto, files?: { webImage?: Express.Multer.File[]; appImage?: Express.Multer.File[] }) {
    try {
      if (!planDto) throw new CustomResponse(HttpStatus.BAD_REQUEST, 'Missing required fields');

      if (files?.webImage?.[0]) {
        planDto.webImage = `${process.env.SERVER_BASE_URL}/uploads/plans/webImage/${await fileUpload('plans/webImage', files.webImage[0])}`;
      }

      if (files?.appImage?.[0]) {
        planDto.appImage = `${process.env.SERVER_BASE_URL}/uploads/plans/appImage/${await fileUpload('plans/appImage', files.appImage[0])}`;
      }

      const newPlan = new this.planModel(planDto);
      const plan = await newPlan.save();

      return new CustomResponse(HttpStatus.CREATED, 'Plan created successfully', plan);
    } catch (error) {
      throwException(error);
    }
  }

  async getPlanById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) throw new CustomResponse(HttpStatus.BAD_REQUEST, 'Invalid Plan ID');
      const plan = await this.planModel.findById(id).exec();
      if (!plan) throw new NotFoundException('Plan not found');
      return new CustomResponse(HttpStatus.OK, 'Plan retrieved successfully', plan);
    } catch (error) {
      throwException(error);
    }
  }

  async getPlansBySubCategory(subCategoryId: string) {
    try {
      const plans = await this.planModel.find({ subCategoryId }).exec();
      if (!plans.length) return new CustomResponse(HttpStatus.NOT_FOUND, 'No Plans Found for this SubCategory');
      return new CustomResponse(HttpStatus.OK, 'Plans retrieved successfully', plans);
    } catch (error) {
      throwException(error);
    }
  }

  async getPlansByUserType(userType: string) {
    try {
      const plans = await this.planModel.find({ userType }).exec();
      if (!plans.length) return new CustomResponse(HttpStatus.NOT_FOUND, 'No Plans Found for this User Type');
      return new CustomResponse(HttpStatus.OK, 'Plans retrieved successfully', plans);
    } catch (error) {
      throwException(error);
    } 
  }

  async getFilteredPlan(filters: Record<string, any>) {
    try {
      const query: any = {};
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        if (key === 'id' && Types.ObjectId.isValid(value)) query._id = new Types.ObjectId(value);
        else if (['plan', 'userType'].includes(key)) query[key] = value;
        else query[key] = { $regex: value, $options: 'i' };
      }
      const plans = await this.planModel.find(query).exec();
      if (!plans.length) return new CustomResponse(HttpStatus.NOT_FOUND, 'No Plans Found');
      return new CustomResponse(HttpStatus.OK, 'Plans retrieved successfully', plans);
    } catch (error) {
      throwException(error);
    }
  }

  async updatePlan(id: string, planDto: PlanDto, files?: any) {
    try {
      if (!id || !planDto) throw new CustomResponse(HttpStatus.BAD_REQUEST, 'Missing required fields');
      
      if (files?.webImage?.[0]) {
        planDto.webImage = `${process.env.SERVER_BASE_URL}/uploads/plans/webImage/${await fileUpload('plans/webImage', files.webImage[0])}`;
      }
      if (files?.appImage?.[0]) {
        planDto.appImage = `${process.env.SERVER_BASE_URL}/uploads/plans/appImage/${await fileUpload('plans/appImage', files.appImage[0])}`;
      }

      const updatedPlan = await this.planModel.findByIdAndUpdate(id, planDto, { new: true }).exec();
      if (!updatedPlan) throw new CustomResponse(HttpStatus.NOT_FOUND, 'Plan not found');

      return new CustomResponse(HttpStatus.OK, 'Plan updated successfully', updatedPlan);
    } catch (error) {
      throwException(error);
    }
  }

  async deletePlan(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) throw new CustomResponse(HttpStatus.BAD_REQUEST, 'Invalid Plan ID');
      const deletedPlan = await this.planModel.findByIdAndDelete(id).exec();
      if (!deletedPlan) throw new CustomResponse(HttpStatus.NOT_FOUND, 'Plan not found');
      return new CustomResponse(HttpStatus.OK, 'Plan deleted successfully');
    } catch (error) {
      throwException(error);
    }
  }
}
