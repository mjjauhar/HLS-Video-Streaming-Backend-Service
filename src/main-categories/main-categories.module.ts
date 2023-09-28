import { Module } from '@nestjs/common';
import { MainCategoriesService } from './main-categories.service';
import { MainCategoriesController } from './main-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { main_category_schema } from './schema';
import { sub_category_schema } from 'src/sub-categories/schema';
import { topic_schema } from 'src/topics/schema';
import { course_schema } from 'src/courses/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'main_category', schema: main_category_schema },
      { name: 'sub_category', schema: sub_category_schema },
      { name: 'topic', schema: topic_schema },
      { name: 'course', schema: course_schema },
    ]),
  ],
  controllers: [MainCategoriesController],
  providers: [MainCategoriesService],
})
export class MainCategoriesModule {}
