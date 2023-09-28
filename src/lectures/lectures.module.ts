import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { lecture_schema } from './schema';
import { section_schema } from 'src/sections/schema';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'lecture', schema: lecture_schema },
        { name: 'section', schema: section_schema }
      ]
    ),
    FacultiesModule
  ],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export class LecturesModule { }
