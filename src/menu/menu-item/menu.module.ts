import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MenuItemSchema } from '../dto/menu-item.dto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MenuItem', schema: MenuItemSchema }]),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),  // Path to static files (uploads folder)
    //   serveRoot: '/uploads',  // URL route for accessing static files
    // }),
  ],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
