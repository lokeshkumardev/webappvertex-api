import { Body, Controller, Param, Post, Get, Put, Query } from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Import AuthService to use OTP functionality
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';
import { ROUTE } from 'src/util/constants';
import { create } from 'domain';
import { AddressDto } from './dto/address.dto';
import { Address } from './user.schema/address.schema';

@Controller(ROUTE.USER)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // Inject AuthService for OTP handling
  ) {}

  @Post('create-address')
  async createAddress(@Body() dto: AddressDto) {
    return this.userService.createAddress(dto); // ✅ Corrected: Service method call
  }

  @Get('address/:userId')
  async getAddress(@Param('userId') userId: string) {
    // console.log('Received userId:', userId); // Debugging
    return this.userService.getAddress(userId);
  }

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

  @Put('updateUser/:userId/:id')
  async updateUser(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateData: AddressDto,
    // CreateUserDto:CreateUserDto
  ) {
    return this.userService.updateUserByUserId(userId, id, updateData);
  }
  // @Get('getAdminbyUserName/:username')
  // async findAdminByUsername(@Param('username') username: string) {
  // }
}
