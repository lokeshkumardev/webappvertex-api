import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ROUTE } from 'src/util/constants';
// import { GenerateOtpDto } from './dto/generate-otp.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller(ROUTE.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('generate-otp')
  async generateOTP(@Body() createUserDto: CreateUserDto) {
    return this.authService.sendOTP(createUserDto); // OTP ko generate karke SMS bhejenge
  }

  // Verify OTP
  @Post('verify-otp')
  async verifyOTP(@Body() createUserDto: VerifyOtpDto) {
    return this.authService.verifyOTP(createUserDto); // OTP verification
  }

  @Post('resend-otp')
  async resendOtp(@Body() createUserDto: CreateUserDto) {
    return this.authService.resendOtp(createUserDto); // OTP verification
  }

  // Admin login (using email and password)
  @Post('admin-login')
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.authService.adminLogin(
      adminLoginDto.userEmail,
      adminLoginDto.userPassword,
    ); // Admin login using email and password
  }

  // // Endpoint for admin login (with username and password)
  // @Post('admin-login')
  // async adminLogin(@Body() body: { username: string; password: string }) {
  //   const admin = await this.authService.adminLogin(body.username, body.password);
  //   if (!admin) {
  //     throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //   }
  //   return admin;
  // }
}
