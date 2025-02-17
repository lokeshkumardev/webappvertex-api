import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PlanService } from './plan.service';
import { PlanDto } from './dto/plan.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { fileUpload } from 'src/util/fileupload';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'webImage', maxCount: 1 },
      { name: 'appImage', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      webImage?: Express.Multer.File[];
      appImage?: Express.Multer.File[];
    },
    @Body() planDto: PlanDto,
  ) {
    return this.planService.createPlan(planDto, files);
  }

  @Get('getByPlanId/:id')
  getPlanById(@Param('id') id: string) {
    return this.planService.getPlanById(id);
  }

  @Get('subcategory/:subCategoryId')
  getPlansBySubCategory(@Param('subCategoryId') subCategoryId: string) {
    return this.planService.getPlansBySubCategory(subCategoryId);
  }

  @Get('usertype/:userType')
  getPlansByUserType(@Param('userType') userType: string) {
    return this.planService.getPlansByUserType(userType);
  }

  // @Put(':id')
  // updatePlan(@Param('id') id: string, @Body() planDto: Partial<PlanDto>) {
  //   return this.planService.updatePlan(id, planDto);
  // }

  @Put('editPlan/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'webImage', maxCount: 1 },
      { name: 'appImage', maxCount: 1 },
    ]),
  )
  async(
    @Param('id') id: string,
    @Body() planDto: PlanDto,
    @UploadedFiles()
    files: {
      appImage?: Express.Multer.File[];
      webImage?: Express.Multer.File[];
    },
  ) {
    return this.planService.updatePlan(id, planDto, files);
  }
  @Get('getFilteredPlan')
  async getCategories(
    @Query() filterParams: Record<string, any>, // Accept all query parameters as an object
  ) {
    return this.planService.getFilteredPlan(filterParams);
  }
  @Delete(':id')
  deletePlan(@Param('id') id: string) {
    return this.planService.deletePlan(id);
  }
}
