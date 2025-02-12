import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Query,
  Delete,
  Get,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UploadDocumentsDto } from './dto/uploadDocuments.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async createRider(
    @Body() createRiderDto: CreateRiderDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return await this.riderService.createRider(createRiderDto, profileImage);
  }

  @Post('documents')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'aadharFront', maxCount: 1 },
      { name: 'aadharBack', maxCount: 1 },
      { name: 'panFront', maxCount: 1 },
      { name: 'drivingLicenseFront', maxCount: 1 },
      { name: 'drivingLicenseBack', maxCount: 1 },
    ]),
  )
  async uploadDocuments(
    @Body(new ValidationPipe({ transform: true }))
    uploadDocumentsDto: UploadDocumentsDto,
    @UploadedFiles()
    files: {
      aadharFront?: Express.Multer.File[];
      aadharBack?: Express.Multer.File[];
      panFront?: Express.Multer.File[];
      drivingLicenseFront?: Express.Multer.File[];
      drivingLicenseBack?: Express.Multer.File[];
    },
  ) {
    return await this.riderService.uploadDocuments(uploadDocumentsDto, files);
  }
  @Get('getAllRiders')
  async findAll(@Query('status') status?: string) {
    return this.riderService.findAll(status);
  }
  @Get(':riderId/documents')
  async getDocuments(@Param('riderId') riderId: string) {
    return this.riderService.getDocuments(riderId);
  }
}
