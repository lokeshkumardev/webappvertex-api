import { Body, Controller, Param, Post, Get, Put } from '@nestjs/common';
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

  @Post('craete-user')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Other user CRUD operations (create, update, delete, etc.) remain unchanged

  @Get('getUser/:userId')
  async findById(@Param('userId') userId: string) {
    return this.userService.findById(userId);
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
  //   return this.userService.findAdminByUsername(username);
  // }
}
