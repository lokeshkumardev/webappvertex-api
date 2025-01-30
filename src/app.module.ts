import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { RiderModule } from './rider/rider.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MenuModule } from './menu/menu-item/menu.module';
import { BannerModule } from './banner/banner.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
@Module({
  imports: [ConfigModule.forRoot({}),
  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to the folder containing the uploaded images
    }),
    
    MongooseModule.forRoot(process.env.MONGO_URI as string, {}),
    AuthModule, UserModule, OrderModule, ProductModule, CategoryModule, RiderModule, MenuModule, BannerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
