import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { sub_category_schema } from './schema';
import { topic_schema } from 'src/topics/schema';
import { course_schema } from 'src/courses/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'sub_category', schema: sub_category_schema },
      { name: 'topic', schema: topic_schema },
      { name: 'course', schema: course_schema },
    ]),
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
