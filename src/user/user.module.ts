import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register User schema
    forwardRef(() => AuthModule),
    // If necessary, use forwardRef here for circular dependencies
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, MongooseModule], // Export MongooseModule to allow other modules to access UserModel
})
export class UserModule {}
