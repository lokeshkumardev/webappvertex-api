import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { TwilioModule } from 'src/common/utils/twilio.module';
import { UserSchema } from 'src/user/user.schema/user.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RiderModule } from 'src/rider/rider.module';
// auth.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule), // Handle circular dependency
    TwilioModule,
    RiderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Export AuthService to use in UserModule
})
export class AuthModule {}
