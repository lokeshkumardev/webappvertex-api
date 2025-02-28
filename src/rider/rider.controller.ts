import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { stat } from 'fs';

@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  // Create a new rider with profile picture
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePicture', maxCount: 1 }]),
  )
  async createRider(
    @Body() createRiderDto: CreateRiderDto,
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[] },
  ) {
    return this.riderService.createRider(
      createRiderDto,
      files?.profilePicture?.[0],
    );
  }

  // Upload rider documents
  @Post('uploadDocuments')
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
    @Body() uploadDocumentsDto: any,
    @UploadedFiles()
    files: {
      aadharFront?: Express.Multer.File[];
      aadharBack?: Express.Multer.File[];
      panFront?: Express.Multer.File[];
      drivingLicenseFront?: Express.Multer.File[];
      drivingLicenseBack?: Express.Multer.File[];
    },
  ) {
    return this.riderService.uploadDocuments(uploadDocumentsDto, files);
  }

  // Get all riders
  @Get('getAllRiders')
  async getAllRiders() {
    return this.riderService.findAll();
  }

  // Get documents by rider ID
  @Get(':riderId/documents')
  async getDocuments(@Param('riderId') riderId: string) {
    return this.riderService.getDocuments(riderId);
  }
  @Patch('updateRiderStatus/:id')
  async updateRiderStatus(
    @Param('id') id: string,
    @Body('status') status: boolean,
  ) {
    return this.riderService.updateRiderStatus(id, status);
  }

  @Patch(':riderId/updatedocuments')
  async updateDocumentStatus(
    @Param('riderId') riderId: string,
    @Body('status') status: boolean,
  ) {
    return this.riderService.updateDocumentStatus(riderId, status);
  }
}
