import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { rating_schema } from './schema';
import { faculty_schema } from 'src/faculties/schema';
import { course_schema } from 'src/courses/schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'rating', schema: rating_schema },
        { name: 'faculty', schema: faculty_schema },
        { name: 'course', schema: course_schema }
      ]
    ),
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule { }
