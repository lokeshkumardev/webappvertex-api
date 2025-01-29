import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { SubcategorySchema } from '../category.schema/sub-category.schema';
import { CategoryModule } from '../category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subcategory', schema: SubcategorySchema }]),
    forwardRef(() => CategoryModule), // Use forwardRef here to resolve circular dependency
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
