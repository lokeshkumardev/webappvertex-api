import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service'; // Import AuthService to use OTP functionality
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,  // Inject AuthService for OTP handling
  ) { }


  @Post('craete-user')
  async(@Body() CreateUserDto: CreateUserDto) {
    console.log('hiiiii')

  }

  // Other user CRUD operations (create, update, delete, etc.) remain unchanged
}
