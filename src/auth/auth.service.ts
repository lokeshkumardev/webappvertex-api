import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'; // Password hashing
import { Model } from 'mongoose';
import * as otpLib from 'otplib'; // OTP generation package
import { TwilioService } from 'src/common/utils/twilio.service';
import { User } from 'src/user/interface/user.interface';
import { MESSAGE } from 'src/util/constants';
import CustomResponse from 'src/common/providers/custom-response.service';
import { throwException } from 'src/util/errorhandling';
import { AdminLoginDto } from './dto/admin-login.dto';
import CustomError from 'src/common/providers/customer-error.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>, // Mongoose model for User
    private readonly twilioService: TwilioService, // Twilio service to send OTP
  ) {}

  // Generate OTP
  generateOTP() {
    otpLib.totp.options = { digits: 4 }; // Set OTP to 4 digits
    return otpLib.totp.generate('secret-key'); // Generate OTP using a secret key
  }

  // Send OTP to user's phone number and save OTP in DB
  async sendOTP(createUserDto): Promise<any> {
    try {
      const otp = this.generateOTP();
      const userPhone = createUserDto.userPhone;
      console.log('userphone', userPhone);
      const user = await this.userModel.findOne({ userPhone });

      if (!user || !user.userPhone || user.userPhone === '') {
        const newUser = new this.userModel({
          userPhone: createUserDto.userPhone,
          otp: otp,
        });

        await newUser.save();
        await this.twilioService.sendOTP(userPhone, otp);
      } else {
        await this.userModel.updateOne(
          { userPhone },
          {
            otp,
            otpExpiration: new Date(Date.now() + 2 * 60 * 1000), // OTP expiration set to 2 minutes
          },
        );
        await this.twilioService.sendOTP(userPhone, otp);
        return new CustomResponse(HttpStatus.OK, MESSAGE.OTP.SENT);
      }
    } catch (error) {
      throwException(error);
    }
  }

  // Verify OTP
  async verifyOTP(createUserDto): Promise<any> {
    try {
      const userPhone = createUserDto.userPhone;
      const user = await this.userModel.findOne({ userPhone });

      // Check if OTP matches and if it is not expired
      if (
        user &&
        createUserDto.otp === user.otp &&
        new Date() < user.otpExpiration
      ) {
        return new CustomResponse(HttpStatus.OK, MESSAGE.OTP.VERIFY, user);
      }

       return new CustomResponse(401, 'OTP Expire Or Failed');
    } catch (error) {
      throwException('failed to verify otp');
    }
  }

  // Resend OTP
  async resendOtp(createUserDto): Promise<any> {
    try {
      const otp = this.generateOTP();
      const userPhone = createUserDto.userPhone;
      console.log('userphone', userPhone);
      const user = await this.userModel.findOne({ userPhone });

      if (!user || !user.userPhone || user.userPhone === '') {
        const newUser = new this.userModel({
          userPhone: createUserDto.userPhone,
          otp: otp,
        });

        await newUser.save();
        await this.twilioService.sendOTP(userPhone, otp);
      } else {
        await this.userModel.updateOne(
          { userPhone },
          {
            otp,
            otpExpiration: new Date(Date.now() + 2 * 60 * 1000), // OTP expiration set to 2 minutes
          },
        );
        await this.twilioService.sendOTP(userPhone, otp);
        return new CustomResponse(HttpStatus.OK, MESSAGE.OTP.RESENT);
      }
    } catch (error) {
      throwException('Failed');
    }
  }

  // Admin login (using email and password)
  async adminLogin(userEmail, userPassword): Promise<any> {
    try {
      const user = await this.userModel.findOne({ userEmail });
      // Check if user exists and is an admin
      if (user && user.role !== 'user') {
        const isPasswordValid = await bcrypt.compare(
          userPassword,
          user.userPassword,
        ); // Compare hashed password

        if (isPasswordValid) {
          // return { message: 'Login successful', userId: user._id };
          return new CustomResponse(200, 'Login successful', user);
        }

        throw new CustomError(404, 'Invalid Password !');
      }

      throw new CustomError(401, 'Unauthorized access');
    } catch (error) {
      console.error('Error in adminLogin:', error);
      throwException(error);
    }
  }
}
