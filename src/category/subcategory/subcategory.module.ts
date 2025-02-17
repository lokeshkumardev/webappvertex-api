import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategoryService } from './subcategory.service';
import { SubcategorySchema } from '../category.schema/sub-category.schema';
import { CategoryModule } from '../category.module';
import { SubcategoryController } from './subcategory.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Subcategory', schema: SubcategorySchema },
    ]),
    forwardRef(() => CategoryModule), // Fix circular dependency issue
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService, MongooseModule],
})
export class SubcategoryModule {}
