import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { course_schema } from './schema';
import { faculty_schema } from 'src/faculties/schema';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'course', schema: course_schema },
        { name: 'faculty', schema: faculty_schema }
      ]
    ),
    WishlistModule,
    FacultiesModule
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule { }
