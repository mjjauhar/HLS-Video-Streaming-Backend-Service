import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { section_schema } from './schema';
import { course_schema } from 'src/courses/schema';
import { faculty_schema } from 'src/faculties/schema';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'section', schema: section_schema },
        { name: 'course', schema: course_schema },
        { name: 'faculty', schema: faculty_schema }
      ]
    ),
    FacultiesModule
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule { }
