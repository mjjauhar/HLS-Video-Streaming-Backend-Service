import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { video_schema } from './schema';
import { lecture_schema } from 'src/lectures/schema';
import { rule_schema } from 'src/rules/schema';
import { section_schema } from 'src/sections/schema';
import { course_schema } from 'src/courses/schema';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'video', schema: video_schema },
        { name: 'lecture', schema: lecture_schema },
        { name: 'section', schema: section_schema },
        { name: 'course', schema: course_schema },
        { name: 'rule', schema: rule_schema },
      ]
    ),
    FacultiesModule
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule { }
