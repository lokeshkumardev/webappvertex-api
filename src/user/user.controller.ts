import { Body, Controller, Param, Post, Get, Put, Query } from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Import AuthService to use OTP functionality
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';
import { ROUTE } from 'src/util/constants';

@Controller(ROUTE.USER)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // Inject AuthService for OTP handling
  ) {}

  @Put('update-location/:id')
  async updateLocation(
    @Param('id') userId: string,
    @Body() body: { longitude: string; latitude: string; address: string },
  ) {
    return this.userService.updateLocation(
      userId,
      body.longitude,
      body.latitude,
      body.address,
    ); // ✅ Corrected
  }

  @Get('nearby-users')
  async getNearbyUsers(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
  ) {
    return this.userService.findNearbyUsers(longitude, latitude);
  }

  // Other user CRUD operations (create, update, delete, etc.) remain unchanged

  @Get('getUser/:userId')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }

  @Put('updateUser/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateData: CreateUserDto,
  ) {
    return this.userService.updateUserByUserId(userId, updateData);
  }
  // @Get('getAdminbyUserName/:username')
  // async findAdminByUsername(@Param('username') username: string) {
  // }
}
