import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createProfile(
    @Body() dto: CreateUserProfileDto, // Accept raw body
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.userProfileService.createProfile(dto, files);
  }

  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    return this.userProfileService.getProfile(userId);
  }

  @Put(':userId')
  @UseInterceptors(AnyFilesInterceptor())
  async updateProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateUserProfileDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.userProfileService.updateProfile(userId, dto, files);
  }

  @Delete(':userId')
  async deleteProfile(@Param('userId') userId: string) {
    return this.userProfileService.deleteProfile(userId);
  }
}
