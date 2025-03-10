import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto';
import { UpdateRiderDto } from './dto/updateRider.dto';

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

  @Get(':riderId')
  async getRider(@Param('riderId') riderId: string) {
    return this.riderService.getRider(riderId);
  }

  @Put(':riderId')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePicture', maxCount: 1 }]),
  )
  async updateRider(
    @Param('riderId') riderId: string,
    @Body() updateRiderStatus: UpdateRiderDto,
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[] },
  ) {
    return this.riderService.updateRider(
      riderId,
      updateRiderStatus,
      files?.profilePicture?.[0],
    );
  }
}
